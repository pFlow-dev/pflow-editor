import * as mm from "@pflow-dev/metamodel";
import JSZip from "jszip";

function getQueryParams(str = window?.location?.search, separator = '&'): Record<string, any> {
    const obj: Record<string, any> = {};
    if (str.length === 0) return obj;
    const c = str.substring(0, 1);
    const s = c === '?' || c === '#' ? str.substring(1) : str;

    const a = s.split(separator);
    for (let i = 0; i < a.length; i++) {
        const p = a[i].indexOf('=');
        if (p < 0) {
            obj[a[i]] = '';
            continue;
        }
        let k = decodeURIComponent(a[i].substring(0, p)),
            v = decodeURIComponent(a[i].substring(p + 1));

        const bps = k.indexOf('[');
        if (bps < 0) {
            obj[k] = v;
            continue;
        }

        const bpe = k.substring(bps + 1).indexOf(']');
        if (bpe < 0) {
            obj[k] = v;
            continue;
        }

        const bpv = k.substring(bps + 1, bps + bpe - 1);
        k = k.substring(0, bps);
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


export async function loadModelFromPermLink(): Promise<mm.Model> {
    let zippedJson = getQueryParams()['z']
    if (!zippedJson) {
        const cid = sessionStorage.getItem('cid')
        if (cid) {
            zippedJson = sessionStorage.getItem('data');
        }
    }
    if (zippedJson) {
        return unzip(zippedJson, 'model.json').then((json) => {
            const m = JSON.parse(json) as mm.ModelDeclaration;
            if (m.version !== 'v0') {
                console.warn("model version mismatch, expected: v0 got: " + m.version);
                m.version = 'v0';
            }
            return mm.newModel({
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

export async function unzip(data: string, filename: string): Promise<string> {
    return JSZip.loadAsync(data, { base64: true })
        .then((z)=> {
            const f =  z.file(filename);
            if (f) {
                return f.async("string").then((json) => {
                    return json;
                });
            }
            return "";
        }).catch((e) => {
            console.error(e);
            return Promise.reject(e);
        });
}
