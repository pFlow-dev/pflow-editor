import React, {Component} from "react";
import PropTypes from "prop-types";

export default class Node extends Component {

    renderTokens(p) {
        let tokens = this.props.metaModel.getTokenCount(this.props.id);

        if (tokens === 0) {
            return // don't show zeros
        }
        if (tokens === 1) {
            return (<circle cx={p.x} cy={p.y} r="2" id={this.props.id+"_tokens"} fill="#000000" stroke="#000000" orient="0" className="tokens"/>)
        }
        if (tokens < 10) {
            return (<text id={this.props.id+"_tokens"} x={p.x-4} y={p.y+5} className="large">{tokens}</text>)
        }
        if (tokens >= 10) {
            return (<text id={this.props.id+"_tokens"} x={p.x-7} y={p.y+5} className="small">{tokens}</text>)
        }
    }

    // Keeps a user from mousing-out of the svg if dragging too quickly
    getHandleWidth() {
        if (this.state.dragging) {
            return window.innerWidth*2
        } else {
            return 36
        }
    }

    getStroke() {
        if (this.props.metaModel.isSelected({ target: this.props.id })) {
            return "#8140ff"
        }  else {
            return "#000000"
        }
    }

    componentDidMount() {
        this.setState({ dragging: false, })
    }

    startDrag(evt) {
        this.setState({ dragging: true });
        evt.stopPropagation();
    }

    endDrag(evt) {
        this.setState({ dragging: false });
        evt.stopPropagation();
    }

    dragging(evt) {
        if (this.state.dragging) {
            this.props.metaModel.positionUpdated(this, evt);
        }
        evt.stopPropagation();
    };

}

Node.propTypes = {
    id: PropTypes.string,
    metaModel: PropTypes.object
}
