import React from "react";
import {Box} from "@mui/material";
import CodeEditor from "@uiw/react-textarea-code-editor";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {MetaModel} from "../pflow";
import SubMenu from "./SubMenu";

interface TabPanelProps {
    metaModel?: MetaModel;
    children?: React.ReactNode;
    index: number;
    value: number;
    other?: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>{children}</Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

interface SouceViewProps {
    metaModel: MetaModel;
}

export default function Source(props: SouceViewProps) {
    const {metaModel} = props;
    const [value, setValue] = React.useState(0);
    const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
        setValue(newValue);
    };

    return <React.Fragment>
        <Box sx={{width: "100%"}}>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Model" {...a11yProps(0)} />
                    <Tab label={"Source"} {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <SubMenu metaModel={metaModel}></SubMenu>
                <pre>
                    <select value={metaModel.m.def.type} onChange={(e) => {
                        metaModel.m.def.type = e.target.value as any;
                        metaModel.commit({ action: `change model type: ${e.target.value}`});
                    }}>
                        <option value="petriNet">PetriNet</option>
                        <option value="workflow">Workflow</option>
                        <option value="elementary">Elementary</option>
                    </select>
                    &nbsp;<button style={{border: "none"}} onClick={() => metaModel.revert(metaModel.revision - 1)}>{"<"}</button>
                    <button style={{border: "none"}}> rev. {metaModel.revision}</button>
                    <button style={{border: "none"}} onClick={() => metaModel.revert(metaModel.revision + 1)}>{">"}</button>
                </pre>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SubMenu metaModel={metaModel}></SubMenu>
                <CodeEditor
                    value={metaModel.toJson()}
                    data-color-mode="light"
                    language="js"
                    placeholder="Please enter JS code."
                    padding={15}
                    style={{
                        fontSize: 12,
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E0E0E0",
                        fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                    }}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                />
            </TabPanel>
        </Box>
    </React.Fragment>;
}
