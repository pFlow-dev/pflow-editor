/**
 * Indexed Petri-Net data structure
 */
export class PetriNet {
  constructor() {
    this.placeCount = 0;
    this.places = {};
    this.transitions = {};
  }

  /**
     * Builds a properly sized [0]*n vector for this model.
     */
  emptyVector() {
    const out = [];
    for (let i=0; i < this.placeCount; i++) {
      out.push(0);
    }
    return out;
  }

  /**
     * Collect initial place conditions into a vector.
     * Used to initialize state machine when transacting with a Model.
     */
  initialState() {
    const out = [];
    for ( const label in this.places) {
      const p = this.places[label];
      out[p.offset] = p.initial || 0;
    }
    return out;
  }

  /**
     * Collect capacity limits into a vector
     */
  stateCapacity() {
    const out = [];
    for ( const label in this.places) {
      const p = this.places[label];
      out[p.offset] = p.capacity || 0;
    }
    return out;
  }
}
