import React, {Component} from 'react';
import Graph from '../designer/Graph';
import '../App.css'
import Editor from "../editor/Editor";
import NewMetaModel from "../pflow/MetaModel";
import {
    domodel,
    getDeclaration,
    listCollections,
    listModels,
} from "../pflow";
import PropTypes from "prop-types";


class PflowEditor extends Component {


    constructor(props) {
        super(props);
        this.setModel = this.setModel.bind(this);
        this.collection = props.collection;
        this.readModels = this.readModels.bind(this);
        this.pollModels = this.pollModels.bind(this);
        this.loadModelFromResponse = this.loadModelFromResponse.bind(this);
        this.source = null

        this.componentDidMount = () => {
            this.readModels().then(this.pollModels)
            this.setModel(props.collection, props.selected)
        }
    }

    loadModel(path, source) {
        this.source = { model: source, path: path }
        let m = this.source.model
        domodel(this.collection, m.schema, m) // REVIEW: should this be
        this.setModel(this.collection, m.schema)
    }

    loadModelFromResponse(response) {
        const reader = response.body.getReader();
        return reader.read().then((res) => {
            let decoder = new TextDecoder()
            let source = decoder.decode(res.value)
            let models = JSON.parse(source)
            for (let path of Object.keys(models)) {
                //console.log({path, model: models[path]})
                this.loadModel(path, models[path])
                window.history.replaceState(null, null, window.location.pathname+"#"+models[path].cid);
                break; // TODO: support reloading models
            }
            return models
        })
    }

    readModels() {
        return fetch('/models.json')
            .then(this.loadModelFromResponse)
            .catch(err => {
                console.error({ err }, "model list error")
            })
    }

    async pollModels() {
        let source = new EventSource("/sse?stream=models", {withCredentials: true})
        let last = ""
        source.addEventListener("message", (evt) => {
            let e = JSON.parse(evt.data)
            if (last != e.cid) {
                //console.log({e}, 'modified')
                last = e.cid
                this.readModels()
            } else {
                //console.log({e}, 'nochange')
            }
        })
    }

    setModel(collection, selected) {
        this.metaModel = NewMetaModel({
            declaration: () => getDeclaration(this.collection, selected),
            setModel: (model) => this.setModel(this.collection, model),
            onUpdate: () => {
                //setTimeout(writeLocalStorage, 5)
                this.setState({ selected })
            },
            getCollectionList:  listCollections,
            getModelList: () => listModels(this.collection),
            getSource: () => this.source,
        })
        this.setState({ selected })
    }

    render() {
        if (! this.state) {
            return <React.Fragment />
        }

        return <React.Fragment>
            <Graph metaModel={this.metaModel} />
            <Editor metaModel={this.metaModel} />
        </React.Fragment>
    }
}

export default PflowEditor;

PflowEditor.propTypes = {
    collection: PropTypes.string,
    selected: PropTypes.string,
}
