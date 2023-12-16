import {Cell, Fn, PlaceNode, Role, RoleDef, TxNode} from "@pflow-dev/metamodel";

// convert x, y to pixel coordinates in SVG
export function pos(x: number, y: number): { x: number, y: number } {
    return {x: x * 80, y: y * 80}
}

export function pflowDAO(fn: Fn, cell: Cell, role: Role): {
    memberSession: PlaceNode;
    adminRole: RoleDef;
    login: TxNode;
    memberRole: RoleDef;
    token: PlaceNode
} {
    const adminRole = role('admin');
    const memberRole = role('member');

    function session(label: string): PlaceNode {
        const inactive = cell('inactive::' + label, 1, 1, pos(3, 3));

        const leave = fn('leave::' + label, memberRole, pos(2, 5));
        leave.tx(1, inactive);

        const join = fn('join::' + label, memberRole, pos(2, 5));
        inactive.tx(1, join);

        const expel = fn('expel::' + label, adminRole, pos(2, 5));
        expel.tx(1, inactive);

        return inactive
    }

    const memberSession = session('member');

    const login = fn('login', memberRole, pos(2, 5));
    memberSession.guard(1, login);

    const register = fn('register', memberRole, pos(2, 5));

    function object(label: string): PlaceNode {
        const modelObject = cell('identity::' + label, 0, 0, pos(3, 3));

        const paused = cell('paused::' + label, 1, 0, pos(3, 3));
        register.tx(1, modelObject);
        memberSession.guard(1, register);

        const enable = fn('enable::' + label, adminRole, pos(2, 5));
        paused.tx(1, enable);

        const disable = fn('disable::' + label, adminRole, pos(2, 5));
        disable.tx(1, paused);

        return cell('object::' + label, 0, 0, pos(3, 3));
    }

    return {
        adminRole,
        memberRole,
        login,
        memberSession,
        token: object('token'),
    }
}

export function pflowWallet(fn: Fn, cell: Cell, role: Role): { debit: TxNode; credit: TxNode } {
    const dao = pflowDAO(fn, cell, role);
    const debit = fn('debit', dao.memberRole, pos(2, 5));
    const credit = fn('credit', dao.memberRole, pos(2, 5));

    return {debit, credit}
}


