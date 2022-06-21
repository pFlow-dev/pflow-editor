import React from 'react';
import PropTypes from "prop-types";
import {DialogTitle, Select, MenuItem, Tooltip, IconButton} from "@mui/material";
import CameraIcon from '@mui/icons-material/Camera';
import {ControlCamera} from "@mui/icons-material";



export default function EditToolbar(props) {
    let source = props.metaModel.getSource() || { path: ""}
    console.log(source, 'source')
    let imageUrl = "#"
    if (source.model && source.model.cid) {
        const state = props.metaModel.getState()
        if (state) {
            imageUrl = "/image.svg?cid=" + source.model.cid + "&state=[" + state.join(',') + "]"
        } else {
            imageUrl = "/image.svg?cid=" + source.model.cid
        }

    }
    const handleChange = (e) => {
        props.metaModel.setModel(e.target.value);
    };
  return <React.Fragment>
      <Tooltip title="snapshot">
          <a href={imageUrl} target="_blank" rel="noreferrer" >
          <IconButton  href="">
              <CameraIcon />
          </IconButton>
              {source?.model?.schema} </a>
      </Tooltip>
  </React.Fragment>
}

EditToolbar.propTypes = {
  metaModel: PropTypes.object,
}
