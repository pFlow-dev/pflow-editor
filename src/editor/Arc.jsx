import React from 'react';
import {MenuItem, Select, TextField} from '@mui/material';
import PropTypes from "prop-types";

export default function Arc(props) {

  const target = props.metaModel.getObj(props.selectedObj.target);
  const source = props.metaModel.getObj(props.selectedObj.source);
  let weight;
  let subtype = 'Arc';
  if (target.role) {
    weight = 0-target.delta[source.offset];
  } else {
    weight = source.delta[target.offset];
  }
  if (weight === 0) {
    subtype = 'Inhibitor';
    if (target.role) {
      if (target.guards.hasOwnProperty(source.label)) {
        weight = 0-target.guards[source.label].delta[source.offset];
      }
    }
  }

  function handleTypeChange() {
    if (props.metaModel.toggleInhibitor(props.selectedObj)) {
      props.metaModel.onUpdate();
    }
  }

  function handleChange(evt) {
    if (evt.target.value <= 0) {
      evt.stopPropagation();
      return
    }
    if (subtype === 'Inhibitor') {
      if (target.role) {
        target.guards[source.label].delta[source.offset] = 0 - evt.target.value;
      } else {
        console.error("invalid inhibitor")
      }
    } else {
      if (target.role) {
        target.delta[source.offset] = 0-evt.target.value;
      } else {
        source.delta[target.offset] = evt.target.value;
      }
    }
    props.metaModel.onUpdate();
    evt.stopPropagation();
  }

  const marginTop = "5px"
  const width = "19em"

  const SelectType = () => {
    if (target.role) {
      return <Select sx={{ marginTop, width: "14em" }} label="Type" id="selected-arc" value={subtype} onChange={handleTypeChange} >
        <MenuItem value="Arc" key="selected-Arc">Arc</MenuItem>,
        <MenuItem value="Inhibitor" key="selected-Inhibitor">Inhibitor</MenuItem>,
      </Select>
    } else {
      return <TextField sx={{ width: "14em", marginTop }} id="selected-arc-type" label="Type" variant="outlined" aria-readonly={true} disabled={true} value={"Arc"}/>
    }
  }

  return <React.Fragment>
    <form noValidate autoComplete="off">
      <TextField sx={{ width: "5em", marginTop }} type="number" min={1} id="weight" label="Weight" variant="outlined" onChange={handleChange} value={weight}/>
      <SelectType />
      <br />
      <TextField sx={{ width, marginTop }} id="source" label="Source" variant="outlined" aria-readonly={true} disabled={true} value={source.label}/>
      <TextField sx={{ width, marginTop }} id="target" label="Target" variant="outlined" aria-readonly={true} disabled={true} value={target.label}/>
    </form>
  </React.Fragment>;
}

Arc.propTypes = {
  selectedObj: PropTypes.object,
  metaModel: PropTypes.object
}
