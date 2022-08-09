import { define } from '../../helpers/redux-request';

export const GET_NODES_LIST = define('GET_NODES_LIST');

export const CREATE_NODE = define('CREATE_NODE');

export function createNode(node) {
    return {
        type: CREATE_NODE,
        payload: { node },
    };
}

export const CREATE_LINK = define('CREATE_LINK');

export function createLink(link) {
    return {
        type: CREATE_LINK,
        payload: { link },
    };
}

export const CLEAR_DATA = define('CLEAR_DATA');

export function clearData() {
    return {
        type: CLEAR_DATA,
        payload: { },
    };
}
