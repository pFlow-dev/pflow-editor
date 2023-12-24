import React from 'react';
import {MetaModel} from "../pflow";

interface PlaceProps {
    id: string;
    metaModel: MetaModel;
}

interface NodeState {
    dragging: boolean;
}

// export default class Place extends React.Component<PlaceProps, NodeState> {
export default function Place(props: PlaceProps) {

    const [nodeState, setState] = React.useState<NodeState>({dragging: false})
    const {metaModel} = props;

    function renderTokens(p: { x: number; y: number; }) {
        let tokens = metaModel.getTokenCount(props.id);

        if (tokens === 0) {
            return; // don't show zeros
        }
        if (tokens === 1) {
            return (<circle cx={p.x} cy={p.y} r="2" id={props.id + "_tokens"} fill="#000000" stroke="#000000"
                            orient="0" className="tokens"/>);
        }
        if (tokens < 10) {
            return (<text id={props.id + "_tokens"} x={p.x - 4} y={p.y + 5} className="large">{tokens}</text>);
        }
        if (tokens >= 10) {
            return (<text id={props.id + "_tokens"} x={p.x - 7} y={p.y + 5} className="small">{tokens}</text>);
        }
    }

    // Keeps a user from mousing-out of the svg if dragging too quickly
    function getHandleWidth() {
        if (nodeState.dragging) {
            return window.innerWidth * 2;
        } else {
            return 36;
        }
    }

    function getStroke() {
        if (metaModel.isSelected(props.id)) {
            return "#8140ff";
        } else {
            return "#000000";
        }
    }

    function startDrag(evt: React.MouseEvent) {
        setState({dragging: true});
        evt.stopPropagation();
    }

    function endDrag(evt: React.MouseEvent) {
        setState({dragging: false});
        metaModel.commit({ action: "move place" });
        evt.stopPropagation();
    }

    function dragging(evt: React.MouseEvent) {
        if (nodeState.dragging) {

            if (['execute', 'delete'].includes(metaModel.mode)) {
                return;
            }

            const obj = metaModel.getObj(props.id);
            if (!obj || obj.metaType !== "place") {
                throw new Error('Place.dragging: invalid obj');
            }
            obj.position.x = obj.position.x + evt.movementX;
            obj.position.y = obj.position.y + evt.movementY;
            metaModel.selectedObject = obj;
            metaModel.update();
        }
        evt.stopPropagation();
    }

    function onClick(evt: React.MouseEvent) {
        metaModel.placeClick(props.id);
        evt.stopPropagation();
    }

    function onAltClick(evt: React.MouseEvent) {
        metaModel.placeAltClick(props.id);
        evt.preventDefault();
        evt.stopPropagation();
    }

    const p = metaModel.getPlace(props.id).position;

    return (
        <g
            onMouseDown={(evt) => startDrag(evt)}
            onMouseUp={(evt) => endDrag(evt)}
            onMouseMove={(evt) => dragging(evt)}
            onClick={onClick}
            onContextMenu={onAltClick}>

            <circle id={props.id + '_handle'} cx={p.x} cy={p.y} r={getHandleWidth()} fill="transparent"
                    stroke="transparent"/>
            <circle cx={p.x} cy={p.y} r="16" id={props.id}
                    strokeWidth="1.5" fill="#FFFFFF" stroke={getStroke()} orient="0"
                    className="place"
                    shapeRendering="auto"
            />
            {renderTokens(p)}
            <text id={props.id + '[label]'} x={p.x - 18} y={p.y - 20}>{props.id}</text>
        </g>
    );
};
