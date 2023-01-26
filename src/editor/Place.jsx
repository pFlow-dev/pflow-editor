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
export default function Place(props) {
  function handleChange(evt) {
    // construct a new label and avoid collision with existing objects
    function newLabel() {
      if  (!props.metaModel.getObj(evt.target.value)) {
        return  evt.target.value;
      }
      return false;
    }
    switch (evt.target.id) {
      case ('label'): {
        let newIndex = newLabel();
        if (newIndex !== false) { // REVIEW: this keeps app from crashing but is inelegant
          for (const txn in props.metaModel.transitions) {
            let guards = props.metaModel.transitions[txn].guards;
            if (place.label in guards) {
              props.metaModel.transitions[txn].guards[newIndex] = {
                label: newIndex,
                delta: guards[place.label].delta
              };
              delete props.metaModel.transitions[txn].guards[place.label];
            }
          }
          props.metaModel.places[newIndex] = props.metaModel.places[place.label];
          delete props.metaModel.places[place.label];
          props.metaModel.places[newIndex].label = newIndex;
          props.metaModel.currentSelection.target = newIndex;
        } else {
          console.warn(`name collision: ${evt.target.value}`);
        }
        break;
      }
      case ('initial'): {
        props.metaModel.places[place.label].initial = valToInt(evt.target.value);
        break;
      }
      case ('capacity'): {
        props.metaModel.places[place.label].capacity = valToInt(evt.target.value);
        break;
      }
      case ('x'): {
        props.metaModel.places[place.label].position.x = valToInt(evt.target.value);
        break;
      }
      case ('y'): {
        props.metaModel.places[place.label].position.y = valToInt(evt.target.value);
        break;
      }
      default: {

      }
    }
    props.metaModel.onUpdate();
  }

  const place = props.metaModel.getObj(props.selectedObj.target);
  const marginTop = "5px";
  const width = "9.5em";

  return <React.Fragment>
    <form noValidate autoComplete="off">
      <TextField sx={{ marginTop, width: "19em" }} id="label" label="Label" variant="outlined" onChange={handleChange} value={place.label}/>
      <br />
      <TextField sx={{ marginTop, width }} type="number" id="initial" label="Initial" variant="outlined" onChange={handleChange} value={place.initial}/>
      <TextField sx={{ marginTop, width }} type="number" id="capacity" label="Capacity" variant="outlined" onChange={handleChange} value={place.capacity}/>
      <TextField sx={{ marginTop, width: "9em" }} id="type" disabled={true} variant="outlined" onChange={handleChange} value="Place"/>
      <TextField sx={{ marginTop, width: "5em" }} type="number" id="x" label="x" variant="outlined" onChange={handleChange} value={place.position.x}/>
      <TextField sx={{ marginTop, width: "5em" }} type="number" id="y" label="y" variant="outlined" onChange={handleChange} value={place.position.y}/>
    </form>
  </React.Fragment>;
}

Place.propTypes = {
  selectedObj: PropTypes.object,
  metaModel: PropTypes.object,
};
