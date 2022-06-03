import React from 'react';
import Model from './Model';
import PropTypes from "prop-types";
import DesignToolbar from "./DesignToolbar";
import {Paper} from "@mui/material";

/**
 * Graph renders the model as an SVG
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Graph(props) {
  const onClick = (evt) => {
    props.metaModel.editorClick(evt);
  };

 const [svgWidth, setSvgWidth] = React.useState(window.screen.width);

 window.addEventListener('orientationchange',(evt) => {
     setSvgWidth(window.screen.width)
 });

  return (
      <React.Fragment>
        <Paper sx={{marginBottom: "5px"}}>
          <DesignToolbar metaModel={props.metaModel}/>
        </Paper>
        <Paper sx={{marginBottom: "5px"}}>
          <svg id={props.metaModel.schema}
            width={svgWidth}
            height={600}
            onContextMenu={(evt) => evt.preventDefault() }
            onClick={onClick}
          >
            <defs>
              <marker id="markerArrow1" markerWidth="23" markerHeight="13" refX="31" refY="6" orient="auto">
                <rect className="transition" width="28" height="3" fill="#ffffff" stroke="#ffffff" x="3" y="5" />
                <path d="M2,2 L2,11 L10,6 L2,2" />
              </marker>
              <marker id="markerInhibit1" markerWidth="23" markerHeight="13" refX="31" refY="6" orient="auto">
                <rect className="transition" width="28" height="3" fill="#ffffff" stroke="#ffffff" x="3" y="5" />
                <circle cx="5" cy="6.5" r={4} />
              </marker>
            </defs>
            <Model metaModel={props.metaModel} />
          </svg>
          </Paper>
      </React.Fragment>
  );
}

Graph.propTypes = {
    metaModel: PropTypes.object
}
