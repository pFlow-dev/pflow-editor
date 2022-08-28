/**
 * Load Petri-net declaration as an executable model.
 * @param collection - name of collection
 * @param schema - name of this model
 * @param modelDef - function making use of DSL or pre-indexed model
 */
import {Model} from './Model';


export const Repo = new class {

    constructor() {
        this.models = new Map()
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

}();