import React from 'react';
import Node from './Node';

export default class Transition extends Node {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  getFill() {
    if (this.props.metaModel.isRunning()) {
      if (this.props.metaModel.canFire(this.props.id)) {
        return '#62fa75';
      } else if (!this.props.metaModel.transitionFails(this.props.id)) {
        return '#fab5b0';
      }
    }
    return '#ffffff';
  }

  onClick(evt) {
    this.props.metaModel.transitionClick(this.props.id);
    evt.stopPropagation();
  }

  render() {
    const t = this.props.metaModel.getTransition(this.props.id);

    if (!this.state || !t) {
      return ( <g />);
    }

    return (
      <g
        onClick={this.onClick}
        onMouseDown={ (evt) => this.startDrag(evt) }
        onMouseUp={ (evt) => this.endDrag(evt) }
        onMouseMove={ (evt) => this.dragging(evt) }
        onDoubleClick={(evt) => evt.preventDefault() }
        onContextMenu={(evt) => {
          evt.preventDefault();
          evt.stopPropagation();
        }} >
        <circle id={this.props.id + '_handle'} cx={t.position.x } cy={t.position.y } r={this.getHandleWidth()} fill="transparent" stroke="transparent"/>
        <rect
          className="transition" width="34" height="34" fill={this.getFill()} stroke={this.getStroke()}
          id={this.props.id} x={t.position.x-17} y={t.position.y-17}
        />
        <text id={this.props.id+'[label]'} x={t.position.x-17} y={t.position.y-23} className="small">{this.props.id}</text>
      </g>
    );
  }
};

