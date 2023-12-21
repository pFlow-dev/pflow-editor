import React from "react";
import * as mm from "@pflow-dev/metamodel";
import {defaultDeclaration} from "./model";
import {Action} from "./types";
import {hideCanvas, showCanvas, snapshotSvg} from "./snapshot";
import {loadModelFromPermLink} from "./permalink";

export const keyToAction: Record<string, Action> = Object.freeze({
    '1': 'select',
    '2': 'snapshot',
    '3': 'execute',
    '4': 'place',
    '5': 'transition',
    '6': 'arc',
    '7': 'token',
    '8': 'delete',
    '9': 'resize',
    '0': 'select',
    's': 'snapshot',
    'x': 'execute',
    'p': 'place',
    't': 'transition',
    'a': 'arc',
    'k': 'token',
    'd': 'delete',
});


interface Event {
    schema: string;
    action: string;
    multiple: number;
}

export function getModel(): MetaModel {
    return metaModelSingleton;
}


function newStream(m: mm.Model): mm.Stream<Event> {
    const stream = new mm.Stream<Event>({models: [m]});
    stream.dispatcher.onFail((s , evt) => {
        // this should never happen
        // because we only fire events that are enabled
        console.error({ s, evt }, 'onFail');
    })
    return stream;
}

const initialModel = mm.newModel({
    schema: window.location.hostname,
    declaration: defaultDeclaration,
    type: mm.ModelType.petriNet
});

export class MetaModel {
    m: mm.Model = initialModel;
    height: number = 600;
    selectedObject: mm.MetaObject | null = null;
    selectedId: string | null = null;
    mode: Action = 'select';
    stream: mm.Stream<Event> = newStream(initialModel);
    protected running: boolean = false;
    protected editing: boolean = false;
    protected sourceView: 'full' | 'sparse' = 'sparse';
    protected onHotkeyDown: (evt: KeyboardEvent) => void
    protected onHotkeyUp: (evt: KeyboardEvent) => void

    constructor(m?: mm.Model) {
        this.onHotkeyDown = (evt) => {
            this.editing || this.onKeyup(evt);
        };
        this.onHotkeyUp = (evt) => {
            this.editing || this.onKeydown(evt);
        };
        window.addEventListener('keyup', this.onHotkeyDown);
        window.addEventListener('keydown', this.onHotkeyUp);

        loadModelFromPermLink().then((urlModel) => {
            this.m = urlModel;
            this.stream = newStream(this.m);
            this.update();
        }).catch(() => {
            this.m = m || initialModel;
            this.stream = newStream(this.m);
            this.update();
        });
    }


    loadModel(m: mm.Model): void {
        this.m = m;
        this.restartStream(false);
        this.update();
    }

    loadJson(json: string): boolean {
        try {
            const data = JSON.parse(json) as mm.ModelDeclaration;
            if (data.version !== 'v0') {
                console.warn("model version mismatch, expected: v0 got: " + data.version);
                data.version = 'v0';
            }
            this.m = mm.newModel({
                schema: window.location.hostname,
                declaration: data,
                type: data.modelType,
            });
            this.restartStream(false);
        } catch (e) {
            return false;
        }
        return true;
    }

    clearAll(): void {
        this.m = mm.newModel({
            schema: window.location.hostname,
            declaration: defaultDeclaration,
            type: mm.ModelType.petriNet
        });
        this.restartStream(false);
        this.update();
    };

    stats() {
        const {places, transitions, arcs} = this.m.def;
        return `places: ${places.size} transitions: ${transitions.size} arcs: ${arcs.length}`;
    }

    toJson(): string {
        return JSON.stringify(this.m.toObject(this.sourceView), null, 1)
    }

    onArrow(button: 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown'): void {
        if (!this.selectedObject) {
            return;
        }
        if (this.selectedObject.metaType === 'arc') {
            return;
        }
        if (this.editing) {
            return;
        }

        const increment = 10;

        switch (button) {
            case 'ArrowRight':
                this.selectedObject.position.x += increment;
                break;
            case 'ArrowLeft':
                this.selectedObject.position.x -= increment;
                break;
            case 'ArrowUp':
                this.selectedObject.position.y -= increment;
                break;
            case 'ArrowDown':
                this.selectedObject.position.y += increment;
                break;
        }

    }

    onKeydown(evt: KeyboardEvent) {
        switch (evt.key) {
            case 'Delete':
            case 'Backspace':
            case 'Escape':
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
            case 'Tab':
                evt.preventDefault();
                evt.stopPropagation();
                break;
        }
    }

    onKeyup(evt: KeyboardEvent) {
        switch (evt.key) {
            case 'Tab':
                this.onTab();
                this.update();
                break;
            case 'Escape':
                this.unsetCurrentObj();
                this.menuAction(this.mode);
                this.update();
                break;
            case 'Delete':
                if (this.selectedObject && this.selectedObject.metaType !== 'arc') {
                    this.deleteObject(this.selectedObject.label);
                    this.unsetCurrentObj();
                    this.update();
                }
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
                this.onArrow(evt.key);
                this.update();
                break;
            case '1': // select
            case '2': // snapshot
            case '3': // execute
            case '4': // place
            case '5': // transition
            case '6': // arc
            case '7': // token
            case '8': // delete
            case '9': // help
            case '0': // select
            case 's': // snapshot
            case 'x': // execute
            case 'p': // place
            case 't': // transition
            case 'a': // arc
            case 'k': // token
            case 'd': // delete
            case '?': // help
                this.menuAction(keyToAction[evt.key]);
                this.update();
                break;
        }
        evt.preventDefault();
        evt.stopPropagation();
    }

    onTab() {
        if (this.running) {
            return;
        }
        const all = this.allSelectableObjects()
        let next = all[0];
        if (!next) {
            return;
        }
        if (this.selectedObject) {
            const index = all.indexOf(this.selectedObject);
            next = all[index + 1] || all[0];
        }
        if (next.metaType === 'place') {
            this.placeClick(next.label)
        }
        if (next.metaType === 'transition') {
            this.transitionClick(next.label)
        }
    }

    allSelectableObjects(): mm.MetaObject[] {
        const objects: mm.MetaObject[] = [];
        this.m.def.places.forEach((p) => objects.push(p));
        this.m.def.transitions.forEach((t) => objects.push(t));
        return objects
    }

    onUpdate(callback: () => void): void {
        const previous = this.updateHook;
        this.updateHook = () => {
            previous();
            callback();
        }
    }

    update(): void {
        this.updateHook();
    }

    editorClick(evt: React.MouseEvent): void {
        let updated = false;
        switch (this.mode) {
            case "place":
                updated = this.m.addPlace({x: evt.clientX, y: evt.clientY});
                break;
            case "transition":
                updated = this.m.addTransition({x: evt.clientX, y: evt.clientY});
                break;
        }
        if (updated) {
            this.update();
        }
    }

    restartStream(running: boolean = true): void {
        this.running = running;
        this.stream = newStream(this.m);
        this.stream.restart();
        this.stream.state.set(this.m.def.schema, this.m.initialVector());
    }

    resizeSvg() {
        if (this.height !== 600) {
            this.height = 600;
        } else {
            this.height = window.innerHeight - 55;
        }
        this.update();
    }

    // pflow.dev model of snapshot/execute state space
    menuAction(action: Action): void {
        if (action === 'resize') {
            this.resizeSvg();
            return;
        }
        const current = this.mode;
        const unClick = current === action;
        const isSnapshot = 'snapshot' === action;
        const wasSnapshot = 'snapshot' === current;
        const isExecute = 'execute' === action;
        const wasExecute = 'execute' === current;
        const wasDelete = 'delete' === current;

        if (unClick) {
            if (wasDelete) {
                this.mode = 'select';
            }
            if (wasSnapshot) {
                if (!this.running) {
                    this.mode = 'select';
                } else {
                    this.mode = 'execute';
                }
                // this.restartStream(false);
                hideCanvas();
            }
            if (wasExecute) {
                this.mode = 'select';
                this.restartStream(false);
            }
        } else {
            this.mode = action;
            if (isSnapshot) {
                snapshotSvg(this.m, this.getState());
                showCanvas();
                this.unsetCurrentObj();
            }
            if (wasSnapshot) {
                hideCanvas();
                if (!isExecute) {
                    this.restartStream(false);
                }
            }
            if (isExecute) {
                this.unsetCurrentObj();
                this.restartStream(true);
            }
            if (wasExecute) {
                if (!isSnapshot) {
                    this.restartStream(false);
                }
            }
            if (!this.mode) {
                this.mode = 'select';
            }
        }
    }

    unsetCurrentObj(): void {
        this.selectedObject = null;
    }

    getState(): mm.Vector {
        if (!this.isRunning()) {
            return this.m.initialVector();
        }
        return this.stream.state.get(this.m.def.schema) || this.m.initialVector();
    }

    getTokenCount(id: string): number {
        const state = this.getState();
        const n = this.getNode(id);
        if (n.metaType === 'place') {
            const p = n as mm.Place;
            return state[p.offset];
        }
        return 0;
    }

    isSelected(id: string): boolean {
        if (!this.selectedObject) {
            return false;
        }
        return this.selectedId === id;
    }

    getObj(id: string): mm.MetaObject {
        let obj: mm.MetaObject | undefined = this.m.def.transitions.get(id);
        if (obj) {
            return obj
        }
        obj = this.m.def.places.get(id);
        if (obj) {
            return obj
        }
        throw new Error("object not found: " + id);
    }

    getNode(id: string): mm.Place | mm.Transition {
        const obj = this.getObj(id)
        if (!obj) {
            throw new Error('Failed to select node' + id);
        }
        if (obj.metaType === 'arc') {
            throw new Error('cannot select arc as node' + id);
        }
        return obj;
    }

    deleteObject(id: string): void {
        const obj = this.getObj(id);
        if (obj.metaType === 'place') {
            this.deletePlace(id);
        }
        if (obj.metaType === 'transition') {
            this.deleteTransition(id)
        }
    }

    deleteTransition(id: string): void {
        this.m.def.transitions.delete(id);
        this.m.def.arcs = this.m.def.arcs.filter((a) => {
            return a.source?.transition?.label !== id && a.target?.transition?.label !== id;
        });
        this.m.def.arcs.forEach((a, i) => a.offset = i);
    }

    deletePlace(id: string): void {
        const p = this.getPlace(id);
        this.m.def.places.delete(id);
        this.m.def.transitions.forEach((t) => {
            delete t.delta[p.offset];
            t.delta.forEach((k, v) => {
                if (k > p.offset) {
                    t.delta[k - 1] = v;
                    delete t.delta[k];
                }
            })
            t.guards.delete(p.label);
        });
        this.m.def.arcs = this.m.def.arcs.filter((a) => {
            return a.source?.place?.label !== id && a.target?.place?.label !== id;
        });
    }

    deleteArc(id: number): void {
        const arc = this.m.def.arcs[id];
        const source = arc.source?.place || arc.source?.transition;
        const target = arc.target?.place || arc.target?.transition;
        if (!source || !target) {
            throw new Error('arc has no source or target: ' + id);
        }

        if (source.metaType === 'place' && target.metaType === 'transition') {
            const place = source as mm.Place;
            const transition = target as mm.Transition;
            transition.delta[place.offset] = 0;
            target.guards.delete(place.label);
        }
        if (source.metaType === 'transition' && target.metaType === 'place') {
            const place = target as mm.Place;
            const transition = source as mm.Transition;
            transition.delta[place.offset] = 0;
            source.guards.delete(place.label);
        }
        this.m.def.arcs.splice(arc.offset, 1);
        this.m.def.arcs.forEach((a, i) => a.offset = i);
    }

    placeClick(id: string): void {
        const obj = this.getObj(id);
        if (this.mode === 'delete') {
            this.deletePlace(id);
            this.unsetCurrentObj();
            return this.update();
        }
        if (this.mode === 'arc' && this.selectedObject) {
            if (this.selectedObject.metaType === 'transition' && obj.metaType === 'place') {
                const place = obj as mm.Place;
                const transition = this.selectedObject as mm.Transition;
                const weight = 1;
                transition.delta[place.offset] = weight;
                // REVIEW: do all the steps just as in reindex() call
                this.m.def.arcs.push({
                    metaType: 'arc',
                    offset: this.m.def.arcs.length,
                    weight,
                    source: {transition},
                    target: {place},
                })
                this.unsetCurrentObj();
                return this.update();
            }
            this.unsetCurrentObj();
            return this.update();
        }
        if (this.mode === 'token') {
            const place = this.getPlace(id);
            place.initial = place.initial + 1;
            return this.update();
        }
        if (!this.isSelected(id)) {
            this.selectedId = id;
            this.selectedObject = obj;
            return this.update();
        }
    }

    placeAltClick(id: string): void {
        if (this.mode === 'token') {
            const place = this.getPlace(id);
            if (place.initial > 0) {
                place.initial = place.initial - 1;
                return this.update();
            }
        }
    }

    getPlace(id: string): mm.Place {
        const obj = this.getObj(id);
        if (obj.metaType === 'place') {
            return obj;
        }
        throw new Error('not a place: ' + id)
    }

    isRunning(): boolean {
        return this.running;
    }

    beginEdit(): void {
        this.editing = true;
    }

    endEdit(): void {
        this.editing = false;
    }

    testFire(action: string): { ok: boolean; inhibited: boolean } {
        const res = this.m.testFire(this.getState(), action, 1);
        return {ok: res.ok, inhibited: !!res.inhibited};
    }

    transitionClick(id: string): void {
        if (this.isRunning()) {
            if (this.stream.dispatch({schema: this.m.def.schema, action: id, multiple: 1}).ok) {
                return this.update();
            } else {
                return;
            }
        }
        if (this.mode === 'delete') {
            this.deleteTransition(id);
            this.unsetCurrentObj();
            return this.update();
        }
        if (this.mode === 'arc' && this.selectedObject) {
            if (this.selectedObject.metaType === 'place') {
                const place = this.selectedObject as mm.Place;
                const transition = this.getTransition(id);
                transition.delta[place.offset] = -1;
                this.m.def.arcs.push({
                    metaType: 'arc',
                    offset: this.m.def.arcs.length,
                    weight: 1,
                    source: {place},
                    target: {transition},
                })
                this.unsetCurrentObj();
                return this.update();
            }
            this.unsetCurrentObj();
            return this.update();
        }
        if (!this.isSelected(id)) {
            this.selectedId = id;
            this.selectedObject = this.getObj(id);
            return this.update();
        }
    }

    getTransition(id: string): mm.Transition {
        const obj = this.getObj(id);
        if (obj.metaType === 'transition') {
            return obj;
        }
        throw new Error('not a transition: ' + id)
    }

    getCurrentObj(): mm.MetaObject | null {
        return this.selectedObject;
    }

    arcClick(id: number): void {
        const arc = this.m.def.arcs[id];
        switch (this.mode) {
            case "delete":
                this.deleteArc(arc.offset);
                break;
            case "arc":
                this.m.toggleInhibitor(arc.offset);
                break;
            case "token":
                this.m.setArcWeight(arc.offset, arc.weight + 1);
                break;
            default:
                return;
        }
        this.unsetCurrentObj();
        return this.update();
    }

    arcAltClick(id: number): void {
        const arc = this.m.def.arcs[id];
        switch (this.mode) {
            case "token":
                if (!this.m.setArcWeight(arc.offset, arc.weight - 1)) {
                    return;
                }
                break;
            default:
                return;
        }
        this.unsetCurrentObj();
        return this.update();
    }

    uploadFile(file: File): Promise<void> {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = (e) => {
                if (e.target) {
                    const content = e.target.result
                    if (content && this.loadJson(content.toString())) {
                        resolve();
                        return;
                    }
                }
                reject();
            };
            reader.readAsText(file);
        });
    }

    protected updateHook: () => void = () => {
    };
}

const metaModelSingleton = new MetaModel();
