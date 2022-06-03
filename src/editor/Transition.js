import React from 'react';
import {TextField} from '@mui/material';
import PropTypes from "prop-types";

function valToInt(value) {
  const val = parseInt(value);
  if (!!val && val >= 0) {
    return val;
  }
  return 0;
}

export default function Transition(props) {

  const transition = props.metaModel.getTransition(props.selectedObj.target);

  function handleChange(evt) {

    // construct a new label and avoid collision with existing objects
    function newLabel() {
      if  (!props.metaModel.getObj(evt.target.value)) {
        return  evt.target.value
      }
      return false
    }

    switch (evt.target.id) {
      case ('role'): {
        transition.role = { label: evt.target.value };
        break;
      }
      case ('label'): {
        let newIndex = newLabel()
        if (newIndex !== false) { // REVIEW: this keeps app from crashing but is inelegant
          props.metaModel.transitions[newIndex] = props.metaModel.transitions[transition.label];
          delete props.metaModel.transitions[transition.label];
          props.metaModel.transitions[newIndex].label = newIndex;
          props.metaModel.currentSelection.target = newIndex;
        } else {
          console.warn(`name collision: ${evt.target.value}`)
        }
        break;
      }
      case ('x'): {
        props.metaModel.transitions[transition.label].position.x = valToInt(evt.target.value);
        break;
      }
      case ('y'): {
        props.metaModel.transitions[transition.label].position.y = valToInt(evt.target.value);
        break;
      }
      default: {

      }
    }
    props.metaModel.onUpdate();
    return true;
  }

  const marginTop = "5px"
  const width = "5em"

  return <React.Fragment>
    <form noValidate autoComplete="off">
      <TextField sx={{ marginTop, width: "19em" }} id="label" label="Label" variant="outlined" onChange={handleChange} value={transition.label}/>
      <br />
      <TextField sx={{ marginTop, width: "19em" }} id="role" label="Role" variant="outlined" onChange={handleChange} value={transition.role.label}/>
      <TextField sx={{ marginTop, width: "9em" }} id="type" variant="outlined" disabled={true} onChange={handleChange} value="Transition"/>
      <TextField sx={{ marginTop, width }} type="number" id="x" label="x" variant="outlined" onChange={handleChange} value={transition.position.x}/>
      <TextField sx={{ marginTop, width }} type="number" id="y" label="y" variant="outlined" onChange={handleChange} value={transition.position.y}/>
    </form>
  </React.Fragment>;
}

Transition.propTypes = {
  selectedObj: PropTypes.object,
  metaModel: PropTypes.object
}
