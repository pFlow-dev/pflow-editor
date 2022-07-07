import React from 'react';
import {Component} from 'react'
import {Repo } from "../pflow";
import NewMetaModel from "../pflow/MetaModel";
import RunPage from "../pages/RunPage";
import ViewPage from "./ViewPage";
import CollectionPage from "./CollectionPage";
import SupportPage from "./SupportPage";

export default class IndexPage extends Component {

    constructor(props) {
        super(props);
        this.setModel = this.setModel.bind(this);
        this.readModels = this.readModels.bind(this);
        //this.pollModels = this.pollModels.bind(this);
        this.loadModelFromResponse = this.loadModelFromResponse.bind(this);

        this.componentDidMount = () => {
            this.readModels() //.then(this.pollModels)
            //this.setModel(props.metaModel)
        }
    }

    loadModel(model, config) {
        Repo.import(model.schema, model, config)
        this.setModel(model.schema)
    }

    loadModelFromResponse(response) {
        const reader = response.body.getReader();
        return reader.read().then((res) => {
            let decoder = new TextDecoder()
            let source = decoder.decode(res.value)
            let models = JSON.parse(source)
            let config = {}
            if (models.version  == '0.1.0') {
                config = models.config
                models = models.models // unpack new models.json format
            }
            for (let path of Object.keys(models)) {
                this.loadModel(models[path], config[path])
                break; // TODO: support reloading models
            }
            return models
        })
    }

    readModels() {
        return fetch('../models.json')
            .then(this.loadModelFromResponse)
            .catch(err => {
                console.error({err}, "model list error")
            })
    }

    // async pollModels() {
    //     let source = new EventSource("/sse?stream=models", {withCredentials: true})
    //     let last = ""
    //     source.addEventListener("message", (evt) => {
    //         let e = JSON.parse(evt.data)
    //         if (last != e.cid) {
    //             //console.log({e}, 'modified')
    //             last = e.cid
    //             this.readModels()
    //         } else {
    //             //console.log({e}, 'nochange')
    //         }
    //     })
    // }

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
        const params = new URLSearchParams(location.search);
        const run = params.get("run");
        const view = params.get("view");
        const stateVal = params.get("state");
        const help = params.get("help");
        let state = []

        if (stateVal) {
            state = JSON.parse(stateVal)
        }

        if (view) {
            return <ViewPage model={view} state={state} metaModel={this.metaModel}/>
        } else if (run) {
            return <RunPage model={run} state={state} metaModel={this.metaModel} />
        } else if (help) {
            return <SupportPage/>
        } else {
            return <CollectionPage metaModel={this.metaModel}/>
        }
    }
}

IndexPage.propTypes = {
}
