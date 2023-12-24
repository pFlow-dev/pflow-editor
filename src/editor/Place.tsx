import React from 'react';
import {TextField} from '@mui/material';
import {MetaModel} from "../pflow";
import {Arc} from "./Arc";

interface PlaceProps {
    selectedObj: any;
    metaModel: MetaModel;
}

export default function Place(props: PlaceProps) {
    const place = props.selectedObj;
    const metaModel = props.metaModel;

    const onFocus = (evt: React.FocusEvent<HTMLInputElement>) => metaModel.beginEdit();
    const onBlur = (evt: React.FocusEvent<HTMLInputElement>) => metaModel.endEdit();

    function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const attribute = evt.target.id;
        const value = metaModel.m.newLabel(evt.target.value);

        switch (attribute) {
            case ('label'): {
                metaModel.m.renamePlace(place.label, value);
                break;
            }
            case ('initial'): {
                const initial = parseInt(value);
                if (initial >= 0) {
                    place.initial = initial;
                }
                break;
            }
            case ('capacity'): {
                const capacity = parseInt(value);
                if (capacity >= 0) {
                    place.capacity = capacity;
                }
                break;
            }
            case ('x'): {
                const x = parseInt(value);
                if (x >= 0) {
                    place.position.x = x;
                }
                break;
            }
            case ('y'): {
                const y = parseInt(value);
                if (y >= 0) {
                    place.position.y = y;
                }
                break;
            }
            default: {
            }
        }
        props.metaModel.commit({ action: `place change ${attribute}: ${value}` });
    }

    const marginTop = "5px";
    const width = "9.5em";

    const arcs = metaModel.m.def.arcs.map((arc) => {
        if (arc.source.place !== place && arc.target.place !== place) {
            return null;
        }
        return <Arc key={"arc_" + arc.offset} metaModel={metaModel} arc={arc}/>
    });

    return <React.Fragment>
        <form noValidate autoComplete="off">
            <TextField sx={{marginTop, width: "9em"}} id="type" label="Type" disabled={true} variant="outlined"
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={handleChange} value="Place"/>
            <TextField sx={{marginTop, width: "19em"}} id="label" label="Label" variant="outlined"
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={handleChange} value={place.label}/>
            <TextField sx={{marginTop, width}} type="number" id="initial" label="Initial" variant="outlined"
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={handleChange} value={place.initial}/>
            <TextField sx={{marginTop, width}} type="number" id="capacity" label="Capacity" variant="outlined"
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={handleChange} value={place.capacity}/>
            <TextField sx={{marginTop, width: "5em"}} type="number" id="x" label="x" variant="outlined"
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={handleChange} value={place.position.x}/>
            <TextField sx={{marginTop, width: "5em"}} type="number" id="y" label="y" variant="outlined"
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={handleChange} value={place.position.y}/>
        </form>
        <br/>
        {arcs}
        <br/>
    </React.Fragment>;
}
