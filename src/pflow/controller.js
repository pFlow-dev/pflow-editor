import {Repo} from "./index";

function pushUrlState(m, params) {
    console.log({m, params}, 'pushState');
    return; // FIXME consider re-implementing
    const url = new URL(window.location);
    if (!!params.run) {
        url.searchParams.set('cid', m.source.cid);
        url.searchParams.set('run', m.cid);
        //location.replace(url)
        window.history.pushState({}, '', url);
    } else if (!!params.view) {
        url.searchParams.set('cid', m.source.cid);
        url.searchParams.set('view', m.cid);
        window.history.pushState({}, '', url);
    }
}

function onImport(m, params, callback) {
    if (m.source.cid !== params.cid) {
        return;
    }
    if (m.cid === params.view || m.cid === params.run) {
        pushUrlState(m, params);
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
    return reader.read().then((res) => {
        let decoder = new TextDecoder();
        let source = decoder.decode(res.value);
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
            pushUrlState(m, params);
        }
        return models;
    });
}

async function pollModels(setModel) {
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