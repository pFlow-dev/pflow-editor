import React from "react";
import PropTypes from "prop-types";
import {FormGroup, Grid, TextField} from "@mui/material";

export default function History(props) {

    return <React.Fragment>
        <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
                {props.metaModel.simulation.history.reverse().map((val) =>
                    <FormGroup row key={"history"+val.seq}>
                        <TextField sx={{ marginTop: "5px", width: "7em" }} label={val.seq} key={"histfield"+val.seq} value={val.action} />
                    </FormGroup>,
                )}
            </Grid>
        </Grid>

    </React.Fragment>
}

History.propTypes = {
    metaModel: PropTypes.object
}
