import React from 'react';
import {MetaModel} from "../pflow";

interface TransitionProps {
    id: string;
    metaModel: MetaModel;
}

interface NodeState {
    dragging: boolean;
    modified?: boolean;
}

export default function Transition(props: TransitionProps) {
    const {metaModel} = props;

    const [nodeState, setState] = React.useState<NodeState>({
        dragging: false,
    })

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
        if (!metaModel.isRunning() && nodeState.modified) {
            metaModel.commit({ action: "move transition" });
        }
        setState({dragging: false});
        evt.stopPropagation();
    }

    function dragging(evt: React.MouseEvent) {
        if (nodeState.dragging) {
            setState({dragging: true, modified: true });
            if (['execute', 'delete'].includes(metaModel.mode)) {
                return;
            }

            const obj = metaModel.getObj(props.id);
            if (!obj || obj.metaType !== "transition") {
                throw new Error('Transition.dragging: invalid obj');
            }
            obj.position.x = obj.position.x + evt.movementX;
            obj.position.y = obj.position.y + evt.movementY;
            metaModel.update();
        }
        evt.stopPropagation();
    }

    function getFill() {
        if (metaModel.isRunning()) {
            const res = metaModel.testFire(props.id)
            if (res.ok) {
                return '#62fa75';
            }
            if (res.inhibited) {
                return '#fab5b0';
            }
        }
        return '#ffffff';
    }

    function onClick(evt: React.MouseEvent) {
        metaModel.transitionClick(props.id);
        evt.stopPropagation();
    }

    const t = metaModel.getTransition(props.id);

    return (
        <g
            onClick={onClick}
            onMouseDown={(evt) => startDrag(evt)}
            onMouseUp={(evt) => endDrag(evt)}
            onMouseMove={(evt) => dragging(evt)}
            onDoubleClick={(evt) => evt.preventDefault()}
            onContextMenu={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
            }}>
            <circle id={props.id + '_handle'} cx={t.position.x} cy={t.position.y} r={getHandleWidth()}
                    fill="transparent" stroke="transparent"/>
            <rect
                className="transition" width="30" height="30" rx={4} fill={getFill()} stroke={getStroke()}
                id={props.id} x={t.position.x - 15} y={t.position.y - 15}
            />
            <text id={props.id + '[label]'} x={t.position.x - 15} y={t.position.y - 20}>{props.id}</text>
        </g>
    );
};

