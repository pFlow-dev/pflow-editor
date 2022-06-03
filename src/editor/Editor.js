import React from 'react';
import EditToolbar from './EditToolbar';
import Place from './Place';
import Arc from './Arc';
import {Box} from '@mui/material';
import PropTypes from "prop-types";
import History from "./History";
import Transition from "./Transition";

export default function Editor(props) {
  const selectedObj = props.metaModel.getCurrentObj();
  const marginTop = '1em'
  const marginLeft = '1em'

  switch (selectedObj.type) {
    case 'Place': {
      return <React.Fragment>
        <EditToolbar metaModel={props.metaModel}/>
        <Box sx={{marginTop, marginLeft }}>
          <Place selectedObj={selectedObj} metaModel={props.metaModel}/>
        </Box>
      </React.Fragment>;
    }
    case 'Transition': {
      return <React.Fragment>
        <EditToolbar metaModel={props.metaModel}/>
        <Box sx={{marginTop, marginLeft }}>
          <Transition selectedObj={selectedObj} metaModel={props.metaModel}/>
        </Box>
      </React.Fragment>;
    }
    case 'Arc': {
      return <React.Fragment>
        <EditToolbar metaModel={props.metaModel}/>
        <Box sx={{marginTop, marginLeft }}>
          <Arc selectedObj={selectedObj} metaModel={props.metaModel}/>
        </Box>
      </React.Fragment>;
    }
    case 'History': {
      return <React.Fragment>
        <EditToolbar metaModel={props.metaModel}/>
        <Box sx={{marginTop, marginLeft }}>
          <History metaModel={props.metaModel}/>
        </Box>
      </React.Fragment>;
    }
    default: {
      return <React.Fragment>
        <EditToolbar metaModel={props.metaModel}/>
      </React.Fragment>;
    }
  }
}

Editor.propTypes = {
  metaModel: PropTypes.object
}
