import { define } from '../../helpers/redux-request';

export const GET_NODES_LIST = define('GET_NODES_LIST');

export function getNodes(nodes) {
    return {
        type: GET_NODES_LIST,
        payload: { nodes },
    };
}

export const CREATE_NODE = define('CREATE_NODE');

export function createNode(node) {
    return {
        type: CREATE_NODE,
        payload: { node },
    };
}
