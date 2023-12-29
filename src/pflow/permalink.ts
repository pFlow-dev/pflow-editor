import * as mm from "@pflow-dev/metamodel";
import JSZip from "jszip";

function getQueryParams(str = window?.location?.search, separator = '&'): Record<string, any> {
    const obj: Record<string, any> = {};
    if (str.length === 0) return obj;
    const c = str.substr(0, 1);
    const s = c === '?' || c === '#' ? str.substr(1) : str;

    const a = s.split(separator);
    for (let i = 0; i < a.length; i++) {
        const p = a[i].indexOf('=');
        if (p < 0) {
            obj[a[i]] = '';
            continue;
        }
        let k = decodeURIComponent(a[i].substr(0, p)),
            v = decodeURIComponent(a[i].substr(p + 1));

        const bps = k.indexOf('[');
        if (bps < 0) {
            obj[k] = v;
            continue;
        }

        const bpe = k.substr(bps + 1).indexOf(']');
        if (bpe < 0) {
            obj[k] = v;
            continue;
        }

        const bpv = k.substr(bps + 1, bps + bpe - 1);
        k = k.substr(0, bps);
        if (bpv.length <= 0) {
            if (typeof obj[k] != 'object') obj[k] = [];
            obj[k].push(v);
        } else {
            if (typeof obj[k] != 'object') obj[k] = {};
            obj[k][bpv] = v;
        }
    }
    return obj;
}


export function loadModelFromPermLink(): Promise<mm.Model> {
    const zippedJson = getQueryParams()['z']
    if (zippedJson) {
        return unzip(zippedJson).then((json) => {
            const m = JSON.parse(json) as mm.ModelDeclaration;
            if (m.version !== 'v0') {
                console.warn("model version mismatch, expected: v0 got: " + m.version);
                m.version = 'v0';
            }
            return mm.newModel({
                schema: window.location.hostname,
                declaration: m,
                type: m.modelType,
            });
        });
    }
    return Promise.reject('no model found');
}

// zip and base64 encode
export function zip(data: string): Promise<string> {
    const zip = new JSZip();
    zip.file("model.json", data);
    return zip.generateAsync({type: "base64"});
}

export function unzip(data: string): Promise<string> {
    return JSZip.loadAsync(data, { base64: true })
        .then((z)=> {
            const f =  z.file("model.json");
            if (f) {
                return f.async("string").then((json) => {
                    return json;
                });
            }
            return Promise.reject('no model.json found');
        }).catch((e) => {
            console.error(e);
            return Promise.reject(e);
        });
}
