import React from 'react';
import {Component} from 'react'
import {Repo } from "../pflow";
import NewMetaModel from "../pflow/MetaModel";
import RunPage from "../pages/RunPage";
import CollectionPage from "./CollectionPage";
import SupportPage from "./SupportPage";
import ViewPage from "./ViewPage";

export default class IndexPage extends Component {

    constructor(props) {
        super(props);
        this.setModel = this.setModel.bind(this);
        this.readModels = this.readModels.bind(this);
        this.pollModels = this.pollModels.bind(this);
        this.loadModelFromResponse = this.loadModelFromResponse.bind(this);

        this.componentDidMount = () => {
            this.readModels().then(this.pollModels)
        }
    }

    loadModelFromResponse(response) {
        const reader = response.body.getReader();
        const { run, view, state, help } = this.getParams()
        const cid = run || view

        return reader.read().then((res) => {
            let decoder = new TextDecoder()
            let source = decoder.decode(res.value)
            let models = JSON.parse(source)
            let config = {}
            if (models.version  == '0.1.0') {
                config = models.config
                models = models.models // unpack new models.json format
            }
            let currentSchema = ""
            const paths = Object.keys(models)

            for (let path of paths) {
                const m = models[path]
                Repo.import(m.schema, m, config[path])
                if (m.cid == cid || paths.length === 1) {
                    currentSchema = m.schema
                    // rewrite to load only model by default
                    const url = new URL(window.location);
                    if (!!run) {
                        url.searchParams.set('run', m.cid);
                        //location.replace(url)
                        window.history.pushState({}, '', url);
                    } else if (!!view) {
                        url.searchParams.set('view', m.cid);
                        //location.replace(url)
                        window.history.pushState({}, '', url);
                    }
                } // REVIEW: single collections have special behavior: autoreload -f
            }
            this.setModel(currentSchema)
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

    async pollModels() {
        let source = new EventSource("/sse?stream=models", {withCredentials: true})
        let last = ""
        source.addEventListener("message", (evt) => {
            let e = JSON.parse(evt.data)
            if (last != e.cid) {
                console.log({e}, 'modified')
                last = e.cid
                this.readModels()
            } else {
                console.log({e}, 'nochange')
            }
        })
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

    getParams() {
        const params = new URLSearchParams(location.search);
        const run = params.get("run");
        const view = params.get("view");
        const stateVal = params.get("state");
        const help = params.get("help");
        let state = []

        if (stateVal) {
            state = JSON.parse(stateVal)
        }
        return { run, view, state, help }
    }

    render() {
        const { run, view, state, help } = this.getParams()
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
