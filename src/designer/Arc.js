import React, {Component} from 'react';
import PropTypes from 'prop-types'

/**
 * Arcs connect places and transition
 * providing either a conduit to transfer tokens
 * Or act as an inhibitor to prevent actions if a token threshold is breached
 */
export default class Arc extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onAltClick = this.onAltClick.bind(this);
    this.getMarker = this.getMarker.bind(this);
    this.getStroke = this.getStroke.bind(this);
  }

  getArcDef() {
    return {source: this.props.source, target: this.props.target};
  }

  onClick(evt) {
    evt.stopPropagation();
    this.props.metaModel.arcClick(this.getArcDef());
  }

  onAltClick(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    this.props.metaModel.arcAltClick(this.getArcDef());
  }

  getMarker() {
    if (this.props['inhibitor']) {
      return 'url(#markerInhibit1)';
    } else {
      return 'url(#markerArrow1)';
    }
  }

  getStroke() {
    const obj = {target: this.props.target, source: this.props.source};
    if (this.props.metaModel.isSelected(obj)) {
      return '#8140ff';
    } else {
      return '#000000';
    }
  }

  render() {
    const source = this.props.metaModel.getObj(this.props.source);
    const target = this.props.metaModel.getObj(this.props.target);
    if (! source || ! target) {
      return (< g/>);
    }

    const x1=source.position.x;
    const y1=source.position.y;
    const x2=target.position.x;
    const y2=target.position.y;

    const midX = (x2+x1)/2;
    const midY = (y2+y1)/2 - 8;
    let offsetX=4;
    let offsetY=4;

    if (Math.abs(x2-midX) < 8) {
      offsetX=8;
    }

    if (Math.abs(y2-midY) < 8) {
      offsetY=0;
    }

    let weight;
    if (this.props.inhibitor) {
      if ('delta' in source) {
        // FIXME: js model differs from metamodel here
        weight = source.guards[target.label].delta[target.offset];
      } else {
        weight = target.guards[source.label].delta[source.offset];
      }
    } else {
      if ('delta' in source) {
        weight = source['delta'][target.offset];
      } else {
        weight = target['delta'][source.offset];
      }
    }

    return (
      <g onContextMenu={this.onAltClick} >
        <line
          stroke={this.getStroke()}
          strokeWidth={1}
          markerEnd={this.getMarker()}
          id={this.props.id}
          x1={x1} y1={y1}
          x2={x2} y2={y2}
        />
        <text id={this.props.id+'[label]'} x={midX-offsetX} y={midY+offsetY} className="small">{Math.abs(weight)}</text>
        <circle id={this.props.id+'[handle]'}
          r={13} cx={midX} cy={midY} fill="transparent" stroke="transparent"
          onClick={this.onClick}
        />
      </g>
    );
  }
};


Arc.propTypes = {
  source: PropTypes.string,
  target: PropTypes.string,
  inhibitor: PropTypes.bool,
  id: PropTypes.string,
  metaModel: PropTypes.object
}
