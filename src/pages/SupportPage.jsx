import React from 'react';
import {Grid, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {GitHub} from "@mui/icons-material";
import TitleLink from "./TitleLink";

export default function SupportPage(props) {

    return <React.Fragment>
        <Grid container justifyContent="center">
            <Grid item>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <TitleLink title={"Pflow & Petri-Nets"}/>
                    </CardContent>
                </Card>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            What
                        </Typography>
                        <Typography variant="body2">
                            <p>
                                Each Petri-net is a recipe that describes a set of rules and pre-conditions necessary to <i>execute</i> a process.
                            </p>
                            <p>
                                These structures provide a built-in concept of resource management i.e. <b>Tokens</b>.
                            </p>
                            <p>
                                Complex behavior can be programmed by composing multiple Petri-net models in the same application.
                            </p>
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">
                            <a href="https://pflow.dev/" target="_blank" rel="noreferrer">
                                <svg viewBox="0 0 60 60" height="30">
                                    <g transform="translate(0,16)">
                                        <path fill="black" d="M24.231 4.526A19.931 19.487 0 0 0 4.3 24.014a19.931 19.487 0 0 0 8.838 16.181l-.714-27.836 4.52-.076.058 2.394c.42-.358.329-.673 2.614-1.88 1.432-.709 3.742-.967 5.745-1.001 3.323-.058 6.362.767 8.49 3.039 2.144 2.272 3.264 5.287 3.36 9.048.097 3.76-.868 6.813-2.894 9.157-2.009 2.343-4.673 3.545-7.996 3.602-2.004.035-3.742-.286-5.21-.96-1.45-.658-3.707-2.113-3.645-2.695l.102 9.367a19.931 19.487 0 0 0 6.663 1.147 19.931 19.487 0 0 0 19.93-19.487 19.931 19.487 0 0 0-19.93-19.488Zm.427 10.295c-2.378.04-4.228.893-5.554 2.555-1.31 1.676-1.925 3.957-1.851 6.849.074 2.892.98 5.148 2.374 6.763.64.583 1.281 1.06 1.935 1.452v-7.312H19.53v-1.392h2.03v-.758c0-1.214.333-2.097 1.003-2.648.669-.558 1.732-.839 3.185-.839h2.006v1.491h-2.03c-.762 0-1.292.13-1.592.39-.292.26-.44.726-.44 1.4v.964h3.496v1.392h-3.495v8.224a7.613 7.613 0 0 0 2.486.217c1.856-.07 3.841-.9 5.15-2.576 1.327-1.662 2.02-4.165 1.946-7.057-.074-2.892-.92-5.267-2.331-6.896-1.394-1.615-3.908-2.26-6.287-2.219zm.447 11.137h.378v3.072h-.378zm2.06.806c.328 0 .586.102.774.307.187.206.28.49.28.855 0 .362-.093.647-.28.854-.188.205-.446.308-.775.308-.33 0-.588-.103-.776-.308-.186-.207-.277-.492-.277-.854 0-.364.091-.65.277-.855.188-.205.447-.307.776-.307zm1.459.055H29l.474 1.726.47-1.726h.446l.47 1.726.47-1.726h.379l-.602 2.211h-.445l-.494-1.813-.499 1.813h-.443zm-1.46.252a.575.575 0 0 0-.48.23c-.118.152-.178.36-.178.625 0 .264.058.473.174.626.118.151.28.228.484.228a.573.573 0 0 0 .48-.23c.117-.153.174-.361.174-.624s-.057-.469-.175-.621a.573.573 0 0 0-.479-.234z"/>
                                    </g>
                                </svg>
                                Browse the model library.
                            </a>
                        </Button>
                    </CardActions>
                </Card>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Why
                        </Typography>
                        <Typography variant="body2">
                            <p>
                                There is a gap between low code design tools, and the complexity of the problems we are solving.
                            </p>
                            <p>
                                Petri-net models bridge this gap -- serving as a <u>lossless abstraction built upon mathematical primitives</u>.
                            </p>
                            <p>
                                This approach handles complexity without suffering from the state-explosion that comes with real-world problems.
                            </p>
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            How
                        </Typography>
                        <Typography variant="body2">
                            <p>
                                Visit our github page for installation instructions and support.
                            </p>
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <GitHub/>
                        <Button size="small">
                            <a href="https://github.com/pFlow-dev/pflow#readme" target="_blank" rel="noreferrer">
                                Visit Github Repo
                            </a>
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
</React.Fragment>;
}

SupportPage.propTypes = {
}
