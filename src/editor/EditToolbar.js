import React from 'react';
import PropTypes from "prop-types";
import {DialogTitle, Select, MenuItem} from "@mui/material";


export default function EditToolbar(props) {
  let source = props.metaModel.getSource() || { path: ""}

    const handleChange = (e) => {
        props.metaModel.setModel(e.target.value);
    };
  return <React.Fragment>
      <div sx={{ height: "1em", padding: "5px" }}>
          &nbsp; <Select labelId="models" id="selected-model" value={props.metaModel.schema} onChange={handleChange} >
              {props.metaModel.getModelList().map((val) =>
                  <MenuItem value={val} key={val}>{val}</MenuItem>,
              )}
          </Select>
         &nbsp; <u>{source.path}</u>
      </div>
  </React.Fragment>
}

EditToolbar.propTypes = {
  metaModel: PropTypes.object,
}
