import React from 'react';
import {MenuItem, Select, TextField} from '@mui/material';
import {MetaModel} from "../pflow";
import * as mm from "@pflow-dev/metamodel";

export function Arc(props: { metaModel: MetaModel, arc: mm.Arc }) {

    const source = props.arc.source.place || props.arc.source.transition;
    const target = props.arc.target.place || props.arc.target.transition;

    const place = props.arc.source.place || props.arc.target.place;
    const transition = props.arc.source.transition || props.arc.target.transition;

    if (!place || !transition || !source || !target) {
        throw new Error("invalid arc");
    }
    const {arc, metaModel} = props;
    const subtype = arc.inhibit ? "Inhibitor" : "Arc";
    const onFocus = (evt: React.FocusEvent<HTMLInputElement>) => metaModel.beginEdit();
    const onBlur = (evt: React.FocusEvent<HTMLInputElement>) => metaModel.endEdit();

    function handleTypeChange() {
        const toggle = !arc.inhibit ? "Inhibitor" : "Arc";
        if (metaModel.m.toggleInhibitor(arc.offset)) {
            metaModel.commit({ action: "toggle arc type: "+toggle });
        }
    }

    function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
        if (!place || !transition || !source || !target) {
            throw new Error("invalid arc");
        }
        if (metaModel.m.setArcWeight(arc.offset, parseInt(evt.target.value))) {
            metaModel.commit({ action: "change arc weight: "+evt.target.value });
        }
    }

    const marginTop = "5px";
    const width = "19em";

    const SelectType = () => {
        return <Select sx={{marginTop, width: "14em"}} label="Type" id="selected-arc" value={subtype}
                       onChange={handleTypeChange}>
            <MenuItem value="Arc" key="selected-Arc">Arc</MenuItem>,
            <MenuItem value="Inhibitor" key="selected-Inhibitor">Inhibitor</MenuItem>,
        </Select>;
    };

    return <React.Fragment>
        <form noValidate autoComplete="off">
            <SelectType/>
            <TextField sx={{width: "5em", marginTop}} type="number" id="weight" label="Weight"
                       onFocus={onFocus}
                       onBlur={onBlur}
                       variant="outlined" onChange={handleChange} value={arc.weight}/>
            <TextField sx={{width, marginTop}} id="source" label="Source" variant="outlined" aria-readonly={true}
                       disabled={true} value={source?.label}/>
            <TextField sx={{width, marginTop}} id="target" label="Target" variant="outlined" aria-readonly={true}
                       disabled={true} value={target?.label}/>
        </form>
    </React.Fragment>;
}
