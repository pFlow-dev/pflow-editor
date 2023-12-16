import {Cell, Fn, PlaceNode, Role} from "@pflow-dev/metamodel/index";
import {pflowDAO, pos} from "./dao";


export function pflowMetro(fn: Fn, cell: Cell, role: Role): void {
    // subway stops from https://en.wikipedia.org/wiki/List_of_New_York_City_Subway_stations_in_Manhattan
    const dao = pflowDAO(fn, cell, role);

    const stops: Array<PlaceNode> = []
    const lines: Array<Array<PlaceNode>> = []
    const linesByName: { [name: string]: Array<PlaceNode> } = {}

    function line(name: string, ...stops: Array<PlaceNode>): Array<PlaceNode> {
        linesByName[name] = stops
        lines.push(stops)
        return stops
    }

    function stop(name: string): PlaceNode {
        const stop = cell(name, 0, 0, pos(3, 3));
        stops.push(stop)
        return stop
    }

    const A = stop('Azure Plaza')
    const B = stop('Blissful Junction')
    const C = stop('Crystal Gardens')
    const D = stop('Dreamy Terrace')
    const E = stop('Enchanting Square')
    const F = stop('Fantasy Court')
    const G = stop('Graceful Park')
    const H = stop('Harmony Crossing')
    const I = stop('Illusion Lane')
    const J = stop('Jubilee Center')
    const K = stop('Kaleidoscope Square')
    const L = stop('Luminous Station')
    const M = stop('Mystical Hub')
    const N = stop('Nebula Plaza')
    const O = stop('Opulent Square')
    const P = stop('Pegasus Gateway')
    const Q = stop('Quasar Junction')
    const R = stop('Radiant Park')
    const S = stop('Serenity Square')
    const T = stop('Tranquil Terrace')
    const U = stop('Unity Plaza')
    const V = stop('Velvet Vista')
    const W = stop('Whimsy Way')
    const X = stop('Xenon Crossing')
    const Y = stop('Yonder Plaza')
    const Z = stop('Zephyr Junction')
    const hub = stop('Wonderland Hub')
}