import {PetriNet} from './PetriNet';

const ErrorFrozenModel = new Error('model cannot be updated after it is frozen');
const ErrorBadInhibitorSource = new Error('inhibitor source must be a place');
const ErrorBadInhibitorTarget = new Error('inhibitor target must be a transitions');
const ErrorBadArcWeight = new Error('arc weight must be positive int');
const ErrorBadArcTransition = new Error('source and target are both transitions');
const ErrorBadArcPlace = new Error('source and target are both places');

export const NodeType = {
  Place: 0,
  Transition: 1,
};

/**
 * Dsl - converts DSL structures into a vector addition system.
 * https://en.wikipedia.org/wiki/Vector_addition_system
 */
export class Dsl extends PetriNet {
  constructor() {
    super();
    this.frozen = false;
    this.arcs = [];
    this.roles = [];
  };

  assertNotFrozen() {
    if (this.frozen) {
      throw ErrorFrozenModel;
    }
  }

  /**
   * Traverse the syntax tree of the DSL
   * Operations are validated, indexed and vectorized
   */
  reindex() {
    this.frozen = true;
    for (const label in this.transitions) {
      this.transitions[label].delta = this.emptyVector(); // right-size all vectors
    }

    for (const id in this.arcs) {
      const arc = this.arcs[id];
      if (arc.inhibitor) {
        const g = {
          label: arc.source.place.label,
          delta: this.emptyVector(),
        };
        g.delta[arc.source.place.offset] = 0-arc.weight;
        arc.target.transition.guards[arc.source.place.label] = g;
      } else {
        if (!arc.source || !arc.target) {
          throw Error('incomplete arc definition');
        }

        if (arc.source.isPlace()) {
          arc.target.transition.delta[arc.source.place.offset] = 0-arc.weight;
        } else {
          arc.source.transition.delta[arc.target.place.offset] = arc.weight;
        }
      }
    };
  }

  /**
     * Roles are used to map access control rules onto the Petri-Net model.
     * @param def - unique name for this role
     */
  role(def ) {
    this.assertNotFrozen();
    const r = {label: def};
    this.roles[def] = r;
    return r;
  }

  /**
     * Cells - containers that hold tokens.
     *
     * In PetriNet terms a Cell is identical to a Place.
     * Used as either the target or source of a transition declaration.
     * @param label - name of the cell
     * @param initial - initial token value
     * @param capacity - max token capacity
     * @param position
     */
  cell(label, initial, capacity, position) {
    this.assertNotFrozen();
    const offset = this.placeCount;
    this.placeCount += 1;
    const n = new Node(this, label, NodeType.Place, position);
    n.place = {label, offset, initial, capacity, position};
    this.places[label]= n.place;
    return n;
  }

  /**
     * fn - 'Partial Functions' declaration
     *
     * Used as either the target or source of a transition declaration.
     * @param label - name of this transition
     * @param role - pre-defined role required to execute function
     * @param position
     */
  fn(label, role, position) {
    this.assertNotFrozen();
    const guards = {};
    const delta = [];
    const n = new Node(this, label, NodeType.Transition, position);
    const offset = this.transitions.size;
    n.transition = {label, role: role, delta, guards, offset, position};
    this.transitions[label] = n.transition;
    return n;
  }
}

/**
 * Nodes serve as syntactic sugar to bridge elements of the DSL
 */
class Node {
  constructor(metaModel, label, nodeType, position) {
    if (!position) {
      throw new Error(`Position is required in ${label} declaration`);
    }
    this.metaModel = metaModel;
    this.label = label;
    this.nodeType = nodeType;
    this.position = position;
  }

  isPlace() {
    return this.nodeType === NodeType.Place;
  }

  isTransition() {
    return this.nodeType === NodeType.Transition;
  }

  /**
     * create a guard definition
     * @param weight - conditional check, a transaction is fire-able if a place's token state is below this threshold.
     * @param target - DesignToolbar node to target for this rule.
     */
  guard(weight, target) {
    if (!this.isPlace()) {
      throw ErrorBadInhibitorSource;
    }
    if (!target.isTransition()) {
      throw ErrorBadInhibitorTarget;
    }
    this.metaModel.arcs.push({
      source: this,
      target: target,
      weight: weight,
      inhibitor: true,
    });
    return this;
  }

  /**
     * Define an Arc to transmit between two Nodes
     * @param weight - tokens required to activate transition
     * @param target - target node to receive transmitted tokens
     */
  tx(weight, target) {
    if (weight <= 0) {
      throw ErrorBadArcWeight;
    }
    if (this.isPlace() && target.isPlace()) {
      throw ErrorBadArcPlace;
    }
    if (this.isTransition() && target.isTransition()) {
      throw ErrorBadArcTransition;
    }
    this.metaModel.arcs.push({
      source: this,
      target: target,
      weight: weight,
    });
    return this;
  }
}

