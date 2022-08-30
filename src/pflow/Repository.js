import {loadModelFromResponse} from "./controller";
import {Model} from "./Model";

export class Repository {

    constructor() {
        this.models = new Map()
    }

    loadModels(callback) {
        // TODO: decide to load Tutorial instead
        // getParams()
        return fetch('../models.json')
            .then(async (r) => loadModelFromResponse(r, callback))
        //.catch(err => {
        //    console.error({err}, "model list error")
        //})
    }

    import(row) {
        this.models[row.model.schema] = {
            source: row.source,
            image: "../" + row.source.cid + "/" + row.model.cid + "/image.svg",
            ...row.model
        }
        return this.models[row.model.schema]
    }

    listModels() {
        const out = []
        for (const m in this.models) {
            out.push(this.getModel(m))
        }
        return out;
    }

    getModel(schema) {
        return this.models[schema]
    }

    getDeclaration(schema) {
        return new Model(schema, this.models[schema]);
    }

}