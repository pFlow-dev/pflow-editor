import * as mm from "@pflow-dev/metamodel";
import JSZip from "jszip";

export function loadModelFromPermLink(): Promise<mm.Model> {
    const params = new URLSearchParams(window.location.search);
    const zippedJson = params.get('z');
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
        });
}