import React from 'react';
import './App.css';
import {getModel} from "./pflow";
import Designer from "./designer/Designer";
import {Paper} from "@mui/material";
import DesignToolbar from "./designer/DesignToolbar";
import Editor from "./editor/Editor";

function App(): React.ReactElement {
    // REVIEW: why is this needed if we never call the update hook?
    const [metaModel,] = React.useState(getModel()); // <- this works
    // const metaModel = getModel(); // <- this doesn't work

    const [modelVersion, modelUpdated] = React.useState(0);
    metaModel.onUpdate(() => modelUpdated(modelVersion ? 0 : 1));

    return (<React.Fragment>
        <Paper sx={{marginBottom: "5px"}}>
            <Designer metaModel={metaModel}/>
            <DesignToolbar metaModel={metaModel}/>
        </Paper>
        <Editor metaModel={metaModel}/>
    </React.Fragment>)
}

export default App;
