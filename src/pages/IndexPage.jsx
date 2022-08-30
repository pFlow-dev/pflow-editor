import React from 'react';
import {Component} from 'react'
import {Repo} from "../pflow";
import NewMetaModel from "../pflow/MetaModel";
import RunPage from "../pages/RunPage";
import CollectionPage from "./CollectionPage";
import SupportPage from "./SupportPage";
import ViewPage from "./ViewPage";
import {getParams} from "../pflow/controller";

export default class IndexPage extends Component {

    constructor(props) {
        super(props);

        // refactor to use hooks?
        this.componentDidMount = () => {
            Repo.loadModels(this.setModel.bind(this))//.then(this.pollModels)
        }
    }

    setModel(selected) {
        this.metaModel = NewMetaModel({
            model: () => Repo.getModel(selected),
            declaration: () => Repo.getDeclaration(selected),
            setModel: (schema) => this.setModel(schema),
            onUpdate: () => {
                //setTimeout(writeLocalStorage, 5)
                this.setState({selected})
            }
        })
        this.setState({selected})
    }


    render() {
        const { run, view, state, help } = getParams()
        if (view) {
            return <ViewPage state={state} metaModel={this.metaModel}/>
        } else if (run) {
            return <RunPage state={state} metaModel={this.metaModel} />
        } else if (help) {
            return <SupportPage/>
        } else {
            return <CollectionPage metaModel={this.metaModel}/>
        }
    }
}

IndexPage.propTypes = {
}
