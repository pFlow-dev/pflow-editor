import React from 'react';
import Designer from '../designer/Designer';
import '../App.css'
import Editor from "../editor/Editor";
import PropTypes from "prop-types";
import {Container, Paper} from "@mui/material";
import DesignToolbar from "../designer/DesignToolbar";
import TitleLink from "./TitleLink";

export default function RunPage(props) {
    if (! props.metaModel) {
        return <React.Fragment />
    }

    return <React.Fragment>
        <Paper sx={{marginBottom: "5px"}}>
            <Container sx={{ position: "absolute"}}>
                <TitleLink title={props.metaModel?.schema} />
            </Container>
            <Designer metaModel={props.metaModel} />
            <DesignToolbar metaModel={props.metaModel} />
        </Paper>
        <Editor metaModel={props.metaModel} />
    </React.Fragment>
}

RunPage.propTypes = {
    metaModel: PropTypes.object,
    state: PropTypes.array,
}
