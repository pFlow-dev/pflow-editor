import React, {Component} from 'react';
import {IconButton, Tooltip} from '@mui/material';
import {
  Adjust,
  ArrowRightAlt,
  CheckBoxOutlineBlank, ControlCamera, Delete,
  PlayCircleOutlined,
  RadioButtonUnchecked, StopCircleOutlined,
} from '@mui/icons-material';
import PropTypes from "prop-types";

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

    const ExecuteBtn = () => {
      if (this.props.metaModel.mode === "execute") {
        return <Tooltip title="Running">
          <IconButton aria-label="execute" color={this.getColor("execute")} onClick={() => this.menuAction('execute')}>
            <StopCircleOutlined />
          </IconButton>
        </Tooltip>
      } else {
        return <Tooltip title="Run">
          <IconButton aria-label="execute" color={this.getColor("execute")} onClick={() => this.menuAction('execute')}>
            <PlayCircleOutlined />
          </IconButton>
        </Tooltip>
      }
    }

    return <React.Fragment>
      <Tooltip title="Select">
        <IconButton aria-label="select" target="select" color={this.getColor("select")} onClick={() => this.menuAction('select')}  href="">
          <ControlCamera />
        </IconButton>
      </Tooltip>
      <ExecuteBtn />
      <Tooltip title="Place">
        <IconButton aria-label="place" color={this.getColor("place")} onClick={() => this.menuAction('place')}>
          <RadioButtonUnchecked/>
        </IconButton>
      </Tooltip>
      <Tooltip title="Transition">
        <IconButton aria-label="transition" color={this.getColor("transition")} onClick={() => this.menuAction('transition')}>
          <CheckBoxOutlineBlank/>
        </IconButton>
      </Tooltip>
      <Tooltip title="Arc">
        <IconButton aria-label="arc" color={this.getColor("arc")} onClick={() => this.menuAction('arc')}>
          <ArrowRightAlt />
        </IconButton>
      </Tooltip>
      <Tooltip title="Token">
        <IconButton aria-label="token" color={this.getColor("token")} onClick={() => this.menuAction('token')}>
          <Adjust />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton aria-label="delete" color={this.getColor("delete")} onClick={() => this.menuAction('delete')}>
          <Delete/>
        </IconButton>
      </Tooltip>
    </React.Fragment>;
  }
}

DesignToolbar.propTypes = {
  metaModel: PropTypes.object
}
