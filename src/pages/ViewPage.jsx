import React from 'react';
import {CardMedia, Container} from "@mui/material";
import Card from "@mui/material/Card";
import TitleLink from "./TitleLink";

import PropTypes from 'prop-types';
import SourceView from "./SourceView";


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
        <Card >
            <CardMedia>
                <a href={"?run="+m.cid}>
                    <img src={urlParams} />
                </a>
            </CardMedia>
        </Card>
        <SourceView metaModel={props.metaModel}/>
</React.Fragment>;
}

ViewPage.propTypes = {
    metaModel: PropTypes.object,
    state: PropTypes.array
}
