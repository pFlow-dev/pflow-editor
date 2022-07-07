import React, {Component} from 'react';
import {Grid, IconButton, Tooltip} from '@mui/material';
import {
  Adjust,
  ArrowRightAlt,
  CheckBoxOutlineBlank, ControlCamera, Delete, HelpOutline,
  PlayCircleOutlined,
  RadioButtonUnchecked, StopCircleOutlined,
} from '@mui/icons-material';
import PropTypes from "prop-types";

import CameraIcon from "@mui/icons-material/Camera";

const colors = {
  primary: "primary",
  default: "default"
}

export default class DesignToolbar extends Component {
  constructor(props) {
    super(props);
    this.menuAction = this.menuAction.bind(this);
  }


  menuAction(action) {
    this.props.metaModel.menuAction(action, (mode) => {
      this.props.metaModel.unsetCurrentObj();
      this.setState({mode: mode});
    });
  }

  componentDidMount() {
    this.setState({mode: this.props.metaModel.getMode()});
  }

  getColor(mode) {
    if (mode === this.props.metaModel.mode) {
      return colors.primary
    } else {
      return colors.default
    }
  }

  render() {
    if (! this.state) {
      return (<React.Fragment/>);
    }

    let imageUrl = "#"
    const state = this.props.metaModel.getState()
    const m = this.props.metaModel.model()
    if (state) {
      imageUrl = "./?view=" + m.cid + "&state=[" + state.join(',') + "]"
    } else {
      imageUrl = "./?view=" + m.cid
    }


    const ExecuteBtn = () => {
      if (this.props.metaModel.mode === "execute") {
        return <Tooltip title="Running">
          <a>
            <IconButton aria-label="execute" color={this.getColor("execute")} onClick={() => this.menuAction('execute')}>
              <StopCircleOutlined />
            </IconButton>
          </a>
        </Tooltip>
      } else {
        return <Tooltip title="Run">
          <a>
            <IconButton aria-label="execute" color={this.getColor("execute")} onClick={() => this.menuAction('execute')}>
              <PlayCircleOutlined />
            </IconButton>
          </a>
        </Tooltip>
      }
    }

    return <React.Fragment>
      <Grid container justifyContent="center">
        <Tooltip title="Select">
          <a>
              <IconButton aria-label="select" target="select" color={this.getColor("select")} onClick={() => this.menuAction('select')}  href="">
                <ControlCamera />
              </IconButton>
          </a>
            </Tooltip>
            <Tooltip title="Snapshot">
              <a href={imageUrl} target="_blank" rel="noreferrer" >
                <IconButton  href="" sx={{ marginBottom: "-6px"}}>
                  <CameraIcon  />
                </IconButton>
              </a>
            </Tooltip>
            <ExecuteBtn />
            <Tooltip title="Place">
              <a>
                <IconButton aria-label="place" color={this.getColor("place")} onClick={() => this.menuAction('place')}>
                  <RadioButtonUnchecked/>
                </IconButton>
              </a>
            </Tooltip>
            <Tooltip title="Transition">
              <a>
                <IconButton aria-label="transition" color={this.getColor("transition")} onClick={() => this.menuAction('transition')}>
                  <CheckBoxOutlineBlank/>
                </IconButton>
              </a>
            </Tooltip>
            <Tooltip title="Arc">
              <a>
                <IconButton aria-label="arc" color={this.getColor("arc")} onClick={() => this.menuAction('arc')}>
                  <ArrowRightAlt />
                </IconButton>
              </a>
            </Tooltip>
            <Tooltip title="Token">
              <a>
                <IconButton aria-label="token" color={this.getColor("token")} onClick={() => this.menuAction('token')}>
                  <Adjust />
                </IconButton>
              </a>
            </Tooltip>
            <Tooltip title="Delete">
              <a>
                <IconButton aria-label="delete" color={this.getColor("delete")} onClick={() => this.menuAction('delete')}>
                  <Delete/>
                </IconButton>
              </a>
            </Tooltip>
            <Tooltip title="Help & Info">
              <a href={"?help=info"}>
                <IconButton>
                    <HelpOutline/>
                </IconButton>
              </a>
            </Tooltip>
      </Grid>
    </React.Fragment>;
  }
}

DesignToolbar.propTypes = {
  metaModel: PropTypes.object
}
