import NewSimulation from './Simulation';

export default function NewMetaModel(props) {
  return new MetaModel(props);
}

// account for visual skew clicking-to-add an element
const HEADER_OFFSET = 20;
const MARGIN_OFFSET = 8

class MetaModel {
  constructor(props) {
    // inject extra attributes
    Object.keys(props).map((attrib) => this[attrib] = props[attrib] );

    // petri-net
    const model = props.declaration();
    this.schema = model.schema;
    this.places = model.places;
    this.transitions = model.transitions;

    // app state
    this.mode = 'select';
    this.update = () => {
      props.onUpdate();
    };

    this.simulation = {};
    this.lastSelected = null;
    this.currentSelection = null;
  }

  getType(obj) {
    if (obj.target && obj.source) {
      return 'Arc';
    }

    if ( obj.target in this.transitions) {
      return 'Transition';
    }

    if (obj.target in this.places) {
      return 'Place';
    }
  }

  getCurrentObj() {
    if (this.isRunning()) {
      return {type: 'History'};
    } else if (!this.currentSelection) {
      return {type: 'None'};
    }

    const o = {type: this.getType(this.currentSelection)};
    for (const k of Object.keys(this.currentSelection)) {
      o[k] = this.currentSelection[k];
    }
    return o;
  }

  unsetCurrentObj() {
    this.currentSelection = undefined;
    this.update();
  }

  onObjSelect(obj, callback) {
    if (this.mode === 'simulation') {
      return
    }
    this.currentSelection = obj;
    const oid = obj.target;

    callback();
    this.update();
  }

  placeSeq() {
    let x = 0;
    while (this.places['place'+x]) {
      x++;
    }
    return 'place'+x;
  }

  transitionSeq() {
    let x = 0;
    while (this.transitions['txn'+x]) {
      x++;
    }
    return 'txn'+x;
  }

  isRunning() {
    return this.mode === 'execute' && this.simulation != null;
  }

  getState() {
    if (this.isRunning()) {
      return this.simulation.state
    }
  }

  getTokenCount(oid) {
    const p = this.getObj(oid);
    if (!p) {
      console.error('place not found ' +oid);
      return -1;
    }

    if (this.isRunning()) {
      return this.simulation.state[p.offset];
    } else {
      return p.initial;
    }
  }

  fire(oid, multiple) {
    let updated = false;
    if (this.isRunning()) {
      this.simulation.fire(oid, multiple || 1, () => {
        updated = true;
      });
    }
    return updated;
  }

  canFire(oid, role) {
    const t = this.getObj(oid);
    if (role && t.role !== role) {
      return false;
    }

    if (this.isRunning() && oid in this.transitions) {
      const res = this.simulation.canFire(oid);
      return res[1];
    } else {
      return false;
    }
  }

  guardsFail(oid, multiple) {
    return this.simulation.guardsFail(oid, multiple);
  }

  transitionFails(oid, multiple) {
    return this.simulation.transitionFails(oid, multiple);
  }

  getMode() {
    return this.mode;
  }

  getTransition(oid) {
    if (oid in this.transitions) {
      return this.transitions[oid];
    }
  }

  getPlace(oid) {
    if (oid in this.places) {
      return this.places[oid];
    }
  }

  getObj(oid) {
    if (oid in this.transitions) {
      return this.transitions[oid];
    } else if (oid in this.places) {
      return this.places[oid];
    }
  }

  positionUpdated(el, evt, callback) {
    if (['execute', 'delete'].indexOf(this.mode) >= 0 ) {
      return;
    }

    const obj = this.getObj(el.props.id);
    obj.position.x = obj.position.x + evt.movementX;
    obj.position.y = obj.position.y + evt.movementY;
    this.update();

    if (callback) {
      callback();
    }
  }

  menuAction(action, callback) {
    if (this.mode === action ) {
      if (action === 'execute' || action === 'delete') {
        action = 'select';
      }
    }
    this.mode=action;

    switch (action) {
      case 'execute': {
        this.simulation = NewSimulation(this);
        break;
      }
      default: {
        // console.error("unknown menuAction: "+action);
      }
    }

    this.update();
    if (callback) {
      callback(this.mode);
    }
  }

  emptyVector() {
    return Object.keys(this.places).map(() => {
      return 0;
    });
  }

  addPlace(coords) {
    const newOffset = Object.keys(this.places).length;
    const label = this.placeSeq();
    this.places[label] = {
      label: label,
      initial: 0,
      capacity: 0,
      offset: newOffset,
      // KLUDGE this allows for the size of the menu bar
      position: {x: coords.x+MARGIN_OFFSET, y: coords.y-HEADER_OFFSET},
    };

    // extend delta vector size
    for (const oid in this.transitions) {
      this.transitions[oid].delta[newOffset] = 0;
    }

    return true;
  }

  addTransition(coords) {
    const oid = this.transitionSeq();
    this.transitions[oid] = {
      label: oid,
      role: 'default',
      delta: this.emptyVector(),
      position: {x: coords.x, y: coords.y-HEADER_OFFSET},
      guards: {},
    };
    return true;
  }

  editorClick(evt) {
    let updated = false;
    switch (this.mode) {
      case 'place': {
        updated = this.addPlace({x: evt.clientX-8, y: evt.clientY-25});
        break;
      }
      case 'transition': {
        updated = this.addTransition({x: evt.clientX, y: evt.clientY-25});
        break;
      }
      default: {
      }
    }
    evt.stopPropagation();
    if (updated) {
      this.update();
    }
  }

  validArc(begin, end) {
    return (
      (begin in this.places && end in this.transitions) ||
            (begin in this.transitions && end in this.places)
    );
  }

  addArc(begin, end) {
    let t;
    let p;
    let weight;

    if (begin in this.transitions) {
      weight = 1;
      t = this.transitions[begin];
      p = this.places[end];
    } else {
      weight = -1;
      t = this.transitions[end];
      p = this.places[begin];
    }

    t.delta[p.offset] = weight;
  }

  pairSelected(begin, end) {
    let updated = false;

    switch (this.mode) {
      case 'arc': {
        if (this.validArc(begin, end)) {
          this.addArc(begin, end);
          updated = true;
        }
        break;
      }
      default: {
      }
    }
    this.lastSelected = null;
    return updated;
  }

  selectObj(oid) {
    this.currentSelection = {target: oid};

    if (!this.lastSelected) {
      this.lastSelected = oid;
    } else {
      this.pairSelected(this.lastSelected, oid);
    }
  }

  delPlace(oid) {
    const offset = this.places[oid].offset;
    for (const txn in this.transitions) {
      delete this.transitions[txn].delta[offset];
      delete this.transitions[txn].guards[oid];
    }
    delete this.places[oid];
  }

  delArc(obj) {
    let p;
    let t;

    if (obj.source in this.places) {
      p = obj.source;
      t = obj.target;
    } else {
      t = obj.source;
      p = obj.target;
    }

    const offset = this.places[p].offset;
    this.transitions[t].delta[offset] = 0;
    delete this.transitions[t].guards[p];
  }

  placeAltClick(oid) {
    let updated = false;
    switch (this.mode) {
      case 'token': {
        const p = this.getObj(oid);
        if (p.initial > 0) {
          p.initial--;
          updated = true;
        }
        break;
      }
      default: {}
    }
    if (updated) {
      this.update();
    }
  }

  placeClick(oid) {
    this.onObjSelect({target: oid}, () => {
      switch (this.mode) {
        case 'token': {
          this.getObj(oid).initial++;
          break;
        }
        case 'delete': {
          this.delPlace(oid);
          break;
        }
        default: {
          this.selectObj(oid);
        }
      }
    });
  }

  transitionClick(oid) {
    this.onObjSelect({target: oid}, () => {
      switch (this.mode) {
        case 'execute': {
          this.fire(oid);
          break;
        }
        case 'delete': {
          delete this.transitions[oid];
          this.currentSelection = null;
          break;
        }
        case 'arc': {
          this.selectObj(oid);
          break;
        }
        default: {
          this.currentSelection = {target: oid};
        }
      }
    });
  }

  // { source: <str>, target: <str> }
  isSelected(obj) {
    if (! this.currentSelection) {
      return false;
    }

    switch (this.mode) {
      case 'execute': {
        return false;
      }
      case 'arc': {
        if (this.lastSelected === obj.target) {
          return true;
        }
        break;
      }
      default: {
        if ('source' in obj) {
          return this.currentSelection['source'] === obj.source && this.currentSelection['target'] === obj.target;
        }

        return this.currentSelection['source'] === obj.target || this.currentSelection['target'] === obj.target;
      }
    }
  }

  toggleInhibitor(arc) {
    if (arc.source in this.transitions) {
      return false;
    }

    const label = arc.source;
    const p = this.getObj(arc.source);
    const t = this.getObj(arc.target);

    if (t.delta[p.offset] !== 0) {
      const delta = this.emptyVector();
      delta[p.offset] = t.delta[p.offset];
      t.delta[p.offset] = 0; // remove transition
      t.guards[label] = {delta, label};
    } else {
      t.delta[p.offset] = t.guards[label]['delta'][p.offset];
      delete t.guards[label];
    }
    return true;
  }

  addGuardToken(t, pid, offset, delta) {
    let v = t.guards[pid]['delta'][offset];

    if (v > 0) {
      v += delta;
    }
    if (v < 0) {
      v -= delta;
    }

    if (v === 0) {
      return false;
    }

    t.guards[pid]['delta'][offset] = v;
    return true;
  }

  addArcToken(obj, delta) {
    let t;
    let p;
    let pid;
    if (obj.source in this.transitions) {
      t = this.getObj(obj.source);
      p = this.getObj(obj.target);
      pid = obj.target;
    } else {
      t = this.getObj(obj.target);
      p = this.getObj(obj.source);
      pid = obj.source;
    }

    if (t.delta[p.offset] === 0) { // if arc doesn't exist
      return this.addGuardToken(t, pid, p.offset, delta);
    }

    let v = t.delta[p.offset];

    if (v > 0) {
      v += delta;
    }
    if (v < 0) {
      v -= delta;
    }

    if (v === 0) {
      return false;
    }

    t.delta[p.offset] = v;
    return true;
  }

  arcClick(obj) {
    this.onObjSelect(obj, () => {
      switch (this.mode) {
        case 'token': {
          this.addArcToken(obj, 1);
          break;
        }
        case 'delete': {
          if (obj.source in this.transitions) {
            this.delArc(obj);
          } else {
            this.delArc(obj);
          }
          break;
        }
        default: {
        }
      }
    });
  }

  arcAltClick(obj) {
    this.onObjSelect(obj, () => {
      switch (this.mode) {
        case 'arc': {
          this.toggleInhibitor(obj);
          break;
        }
        case 'token': {
          this.addArcToken(obj, -1);
          break;
        }
        default: {
        }
      }
      this.update();
    });
  }


  functionName() {
    return this.schema.replace(/ /g, '_');
  }

  /**
     * Output metamodel-bash source code
     * @return {string}
     */
  toSource(language) {
    let places = '';
    const roleDefs = {};
    let roles = '';
    let transitions = '';
    let arcs = '';
    const placeIds = [];
    let guards = '';

    let indent = '';
    let shebang = '';
    if (language === 'bash') {
      indent = '    ';
      shebang = '#!/usr/bin/env bash';
    }

    for (const i in this.places) {
      const p = this.places[i];
      places += `${indent}cell ${p.label} ${p.initial} ${p.capacity} ${p.position.x} ${p.position.y}\n`;
      placeIds[p.offset] = p.label;
    }

    for (const i in this.transitions) {
      const t = this.transitions[i];
      roleDefs[t.role.label] = t.role.label;
      transitions += `${indent}fn ${t.label} ${t.role.label} ${t.position.x} ${t.position.y}\n`;

      for (const i in t.delta) {
        const token = t.delta[i];
        if (token > 0) {
          // lookup place by id and define an arc
          arcs += `${indent}tx ${t.label} ${placeIds[i]} ${token}\n`;
        }
        if (token < 0) {
          arcs += `${indent}tx ${placeIds[i]} ${t.label} ${0-token}\n`;
        }
      }

      for (const i in t.guards) {
        const g = t.guards[i];
        let token = undefined;
        for (const i in g.delta) {
          if (g.delta[i] !== 0) {
            token = 0-g.delta[i];
            break;
          }
        }
        guards += `${indent}guard ${i} ${t.label} ${token}\n`;
      }
    }

    for (const d in roleDefs) {
      roles += `${indent}role ${d}\n`;
    }

    return `${shebang}\n\nfunction ${this.functionName()}() {\n\n${roles}\n${places}\n${transitions}\n${arcs}\n${guards}}`;
  }
}
