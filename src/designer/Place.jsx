import React from 'react';
import Node from './Node';

export default class Place extends Node {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onAltClick = this.onAltClick.bind(this);
  }

  onClick(evt) {
    this.props.metaModel.placeClick(this.props.id);
    evt.stopPropagation();
  }

  onAltClick(evt) {
    this.props.metaModel.placeAltClick(this.props.id);
    evt.preventDefault();
    evt.stopPropagation();
  }

  render() {
    if (! this.state ) {
      return (<g/>);
    }
    const p = this.props.metaModel.getPlace(this.props.id).position;

    return (
      <g
        onMouseDown={ (evt) => this.startDrag(evt) }
        onMouseUp={ (evt) => this.endDrag(evt) }
        onMouseMove={ (evt) => this.dragging(evt) }
        onClick={this.onClick}
        onContextMenu={this.onAltClick} >

        <circle id={this.props.id+'_handle'} cx={p.x} cy={p.y} r={this.getHandleWidth()} fill="transparent" stroke="transparent"/>
        <circle cx={p.x} cy={p.y} r="20" id={this.props.id}
          strokeWidth="1.5" fill="#FFFFFF" stroke={this.getStroke()} orient="0"
          className="place"
          shapeRendering="auto"
        />
        {this.renderTokens(p)}
        <text id={this.props.id+'[label]'} x={p.x-20} y={p.y-25} className="small">{this.props.id}</text>
      </g>
    );
  }
};
