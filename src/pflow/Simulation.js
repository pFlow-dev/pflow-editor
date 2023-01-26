export default function NewSimulation(net) {
  return new Simulation(net.places, net.transitions);
}

class Simulation {
  constructor(places, transitions) {
    this.history = [];
    this.state = [];
    this.capacity = [];
    this.transitions = transitions;
    this.places = places;

    for (const i in places) {
      this.capacity[places[i].offset] = places[i].capacity;
      this.state[places[i].offset] = places[i].initial;
    }
  }

  vectorAdd(state, delta, multiple) {
    const out = [];
    let valid = true;
    for ( const i in state) {
      out[i] = state[i] + delta[i] * multiple;

      if (out[i] < 0 ) {
        valid = false;
      } else if (this.capacity[i] > 0 && this.capacity[i] - out[i] < 0) {
        valid = false;
      }
    }

    return [out, valid];
  }

  /**
   * guard logic is inverse of a transition
   * vadd failure signals that inhibitor deactivated
   *
   * @param oid
   * @param multiple
   * @returns {boolean}
   */
  guardsFail(oid, multiple) {
    let res = null;
    const t = this.transitions[oid];
    for (const place in t.guards) {
      res = this.vectorAdd(this.state, t.guards[place]['delta'], multiple);
      if (res[1]) {
        return true;
      }
    }
    return false;
  }

  transitionFails(oid, multiple) {
    const t = this.transitions[oid];
    const res = this.vectorAdd(this.state, t.delta, multiple || 1);
    return !res[1];
  }

  canFire(oid, multiple) {
    if (multiple != null && multiple < 0) {
      console.error('multiple must be positive value got: ' +multiple);
      return [this.state, false];
    }
    const t = this.transitions[oid];

    if (this.guardsFail(oid, multiple || 1)) {
      return [this.state, false];
    }

    return this.vectorAdd(this.state, t.delta, multiple || 1);
  }

  fire(oid, multiple, callback) {
    const [out, ok] = this.canFire(oid, multiple);
    if (ok) {
      this.history.push({ action: oid, multiple, seq: this.history.length+1, state: out });
      this.state = out;
      if (callback) {
        callback();
      }
    }
  }
}
