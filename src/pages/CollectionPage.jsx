import React from 'react';
import PropTypes from "prop-types";
import {Container, Grid, Link, Paper, Tooltip} from "@mui/material";
import ModelList from "../editor/ModelList";
import TitleLink from "./TitleLink";

export default function CollectionPage(props) {
    return <React.Fragment>
        <Grid container  sx={{ }}>
            <Grid item position="absolute">
                <Container>
                    <TitleLink title={"Pflow Petri-Net Viewer"} />
                </Container>
            </Grid>
        </Grid>
        <Paper sx={{marginTop: "30px"}}>
            <ModelList metaModel={props.metaModel} />
        </Paper>
    </React.Fragment>;
}

CollectionPage.propTypes = {
    metaModel: PropTypes.object
};
