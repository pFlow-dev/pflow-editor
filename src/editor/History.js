import React from "react";
import PropTypes from "prop-types";
import {FormGroup, Grid, TextField} from "@mui/material";

export default function History(props) {

    const history = props.metaModel.simulation.history;
    const entries = []

    for (const i in history) {
        const val = history[i]
        entries.unshift(
            <FormGroup row key={"history"+val.seq}>
                <TextField sx={{ marginTop: "5px", width: "20em" }} label={val.seq} key={"histfield"+val.seq} value={val.action} />
            </FormGroup>
        )

    }

    return <React.Fragment>
        <Grid container spacing={2}>
            <Grid item xs={12} md={12}>{entries}</Grid>
        </Grid>

    </React.Fragment>
}

History.propTypes = {
    metaModel: PropTypes.object
}
