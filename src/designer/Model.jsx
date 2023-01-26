import React, {Component} from 'react';
import Place from './Place';
import Arc from './Arc';
import Transition from './Transition';
import PropTypes from "prop-types";

class Model extends Component {

  render() {
    const p = this.props.metaModel.places;
    const t = this.props.metaModel.transitions;
    const place_index = [];

    for (const label in p) {
      place_index[p[label].offset] = label;
    }

    const places = Object.keys(p).map((label) =>
      <Place key={label} id={label} metaModel={this.props.metaModel} />,
    );

    const transitions = Object.keys(t).map((label) =>
      <Transition key={label} id={label} metaModel={this.props.metaModel} />,
    );

    const arcs = [];

    for (const txn in t) {
      for (const place in t[txn].guards) {
        const id = txn+'-o'+place;
        arcs.push(
            <Arc key={id} id={id} metaModel={this.props.metaModel} source={place} target={txn} inhibitor={true} transition={t} />,
        );
      }
    }

    for (const txn in t) {
      for (const i in t[txn].delta) {
        const v = t[txn].delta[i];
        if (v > 0) {
          const id = txn+'--'+place_index[i];
          arcs.push(
              <Arc key={id} id={id} metaModel={this.props.metaModel} source={txn} target={place_index[i]} transition={t}/>,
          );
        } else if (v < 0) {
          const id = place_index[i]+'-='+txn;
          arcs.push(
              <Arc key={id} id={id} metaModel={this.props.metaModel} source={place_index[i]} target={txn} transition={t}/>,
          );
        }
      }
    }

    return (
      <g id={this.props.schema}>
        { arcs }
        { places }
        { transitions }
      </g>
    );
  }
}

Model.propTypes = {
  schema: PropTypes.string,
  metaModel: PropTypes.object,
};

export default Model;
