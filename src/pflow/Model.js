import {Dsl} from './Dsl';

const ErrorInvalidPlace = new Error('invalid place');
const ErrorInvalidAction = new Error('invalid action');
const ErrorInvalidOutput = new Error('output cannot be negative');
const ErrorExceedsCapacity = new Error('output exceeds capacity');
const ErrorGuardCheckFailure = new Error('guard condition failure');

export class Model extends Dsl {
  constructor(schema, declaration) {
    super();
    this.schema = schema;

    if (declaration instanceof Function) { // provided a function DSL
      declaration(
          this.fn.bind(this),
          this.cell.bind(this),
          this.role.bind(this),
      );
      this.reindex();
    } else if (!!declaration) { // pre-indexed model
      this.places = declaration.places;
      this.transitions = declaration.transitions;
      this.frozen = true;
    }
  }

  toIndexedModel() {
    return {
      schema: this.schema,
      places: this.places,
      transitions: this.transitions,
    };
  }

  /**
     * Perform vector addition, asserting that bounds are not exceeded
     * @param state
     * @param delta
     * @param multiplier
     * @param capacity
     * @private
     */
  add(state, delta, multiplier, capacity) {
    let err = null;
    const out = this.emptyVector();
    for (const index in state) {
      const sum = state[index] + delta[index] * multiplier;
      if (sum < 0) {
        err = ErrorInvalidOutput;
      }
      if ((capacity && (capacity[index] > 0 && sum > capacity[index]))) {
        err = ErrorExceedsCapacity;
      }
      out[index] = sum;
    };

    return [err, out];
  }

  /**
     * List available actions
     */
  actions() {
    return this.transitions.keys();
  }

  /**
     * Return defined transition by label
     * @param transitionLabel
     */
  action(transitionLabel) {
    try {
      const tx = this.transitions[transitionLabel];
      return [tx.delta, tx.role, tx.guards];
    } catch {
      throw ErrorInvalidAction;
    }
  }

  /**
     * Perform state transformation returning an error if it is invalid
     * @param inputState - starting state vector
     * @param transaction - label of transaction to apply
     * @param multiplier - number of iterations to apply
     */
  transform(inputState, transaction, multiplier) {
    const [delta, role, guards] = this.action(transaction);
    for ( const label in guards) {
      const guard = guards[label];
      const [check, out] = this.add(inputState, guard.delta, multiplier, this.emptyVector());
      if (check == null) {
        return [ErrorGuardCheckFailure, out, role];
      }
    }
    const [err, out] = this.add(inputState, delta, multiplier, this.stateCapacity());
    return [err, out, role];
  }

  /**
     * Get offset of place by label
     * @param placeLabel
     */
  offset(placeLabel) {
    const pl = this.places.get(placeLabel);
    if (! pl) {
      throw ErrorInvalidPlace;
    }
    return pl.offset;
  }

  /**
     * Get offset of place by label
     * @param transitionLabel
     */
  actionId(transitionLabel) {
    const act = this.transitions.get(transitionLabel);
    if (! act) {
      throw ErrorInvalidAction;
    }
    return act.offset;
  }
}
