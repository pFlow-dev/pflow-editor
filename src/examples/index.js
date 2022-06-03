import {domodel} from '../pflow';

export const defaultCollection = 'examples'
export const defaultModel = 'metamodel'

// Provide an example model by default
domodel(defaultCollection, defaultModel, (role, cell, fn, param) => {});

// A built-in example for testing
domodel('examples', 'metamodel', (role, cell, fn) => {
    const defaultRole = role("default")
    // lambda style assignment
    const foo = cell("foo", 1, 0, {x: 170, y: 230})
    const baz = cell("baz", 0, 0, {x: 330, y: 110})

    const bar = fn("bar", defaultRole, {x: 170, y: 110})
    const qux = fn("qux", defaultRole, {x: 330, y: 230})
    const quux = fn("quux", defaultRole, {x: 50, y: 230})
    const plugh = fn("plugh", defaultRole, {x: 460, y: 110})

    foo.tx(1, bar)
    qux.tx(1, foo)

    baz.tx(1, qux)
    bar.tx(1, baz)

    foo.guard(1, quux)
    baz.guard(1, plugh)
});


