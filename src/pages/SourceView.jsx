import React from 'react';
import {Box, CardMedia, Container, Grid, Link, Tooltip} from "@mui/material";
import CodeEditor from '@uiw/react-textarea-code-editor';
import ReactMarkdown from 'react-markdown'

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>{children}</Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function SourceView(props) {
    if (!props.metaModel) {
        return <React.Fragment/>
    }

    const m = props.metaModel.model()
    if (!m) {
        return <React.Fragment/>
    }
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [code, setCode] = React.useState(m.source.code);

    return <React.Fragment>
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Model" {...a11yProps(0)} />
                    <Tab label={m.path.split('.')[1]} {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <ReactMarkdown>{m.source.markdown}</ReactMarkdown>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <CodeEditor
                    value={code}
                    language="js"
                    placeholder="Please enter JS code."
                    onChange={(evn) => setCode(evn.target.value)}
                    padding={15}
                    style={{
                        fontSize: 12,
                        backgroundColor: "#f5f5f5",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                />
            </TabPanel>
        </Box>
</React.Fragment>;
}

SourceView.propTypes = {
    metaModel: PropTypes.object,
    model: PropTypes.string,
    state: PropTypes.array
}
