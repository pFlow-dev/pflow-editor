import {Cell, Fn, Role} from "@pflow-dev/metamodel";

// convert x, y to pixel coordinates in SVG
export function pos(x: number, y: number): { x: number, y: number } {
    return {x: x * 80, y: y * 80}
}

function fooBarAddSub(fn: Fn, cell: Cell, role: Role): void {
    const defaultRole = role('default');
    const foo = cell('foo', 1, 3, pos(6, 4));

    const bar = fn('bar', defaultRole, pos(5, 5));
    const baz = fn('baz', defaultRole, pos(7, 5));
    const add = fn('add', defaultRole, pos(5, 3));
    const sub = fn('sub', defaultRole, pos(7, 3));

    add.tx(1, foo);
    foo.tx(1, sub);

    bar.guard(3, foo);
    foo.guard(1, baz);
}

export const  defaultDeclaration = () => {} //fooBarAddSub;
