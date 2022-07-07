import React from 'react';
import {CardMedia, Container, Grid, Link, Tooltip} from "@mui/material";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import TitleLink from "./TitleLink";

export default function ViewPage(props) {
    if (!props.metaModel) {
        return <React.Fragment/>
    }
    let urlParams = ""
    const m = props.metaModel.model()
    if (m && m.cid) {
        if (props.state) {
            urlParams = "../"+m.cid + "/image.svg?state=[" + props.state.join(',') + "]"
        } else {
            urlParams = "../"+m.cid+"/image.svg"
        }
    }

    return <React.Fragment>
        <Container sx={{ position: "absolute"}}>
            <TitleLink title={props.metaModel?.schema}/>
        </Container>
        <Grid container>
            <Grid item>
                <Card >
                    <a href={"?run="+m.cid}>
                        <CardMedia>
                            <img src={urlParams} />
                        </CardMedia>
                    </a>
                </Card>
            </Grid>
        </Grid>
</React.Fragment>;
}

ViewPage.propTypes = {
    metaModel: PropTypes.object,
    model: PropTypes.string,
    state: PropTypes.array
}
