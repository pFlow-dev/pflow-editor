import {Repo} from "./index";

function onImport(m, params, callback) {
    if (m.source.cid !== params.cid) {
        return;
    }
    if (m.cid === params.view || m.cid === params.run) {
        callback(m.schema);
        return true;
    }
}

export function getParams() {
    const params = new URLSearchParams(location.search);
    const cid = params.get("cid");
    const run = params.get("run");
    const view = params.get("view");
    const stateVal = params.get("state");
    const help = params.get("help");
    const tutorial = params.get("tutorial");
    let state = [];

    if (stateVal) {
        state = JSON.parse(stateVal);
    }
    return {cid, run, view, state, help, tutorial};
}


export function loadModelFromResponse(response, callback) {
    const reader = response.body.getReader();
    return reader.read().then(async (res) => {
        let decoder = new TextDecoder();
        let source = decoder.decode(res.value);
        let done = res.done;
        while (!done) {
            const next = await reader.read();
            source += decoder.decode(next.value);
            done = next.done;
        }
        let models = JSON.parse(source);
        let params = getParams();
        let found = false;
        for (let m of models) {
            if (onImport(Repo.import(m), params, callback)) {
                found = true;
            }
        }
        if (!found && models.length > 0) {
            let m = Repo.getModel(models[0].model.schema);
            callback(m);
        }
        return models;
    });
}
async function pollModels(setModel) {
    // REVIEW: consider making polling configureable from the model json
    let source = new EventSource("/sse?stream=models", {withCredentials: true});
    let last = "";
    source.addEventListener("message", (evt) => {
        let e = JSON.parse(evt.data);
        if (last != e.cid) {
            console.log({e}, 'modified');
            last = e.cid;
            readModels(setModel);
        } else {
            console.log({e}, 'nochange');
        }
    });
}
