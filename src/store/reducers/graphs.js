import {
    GET_NODES_LIST, CREATE_NODE
} from '../actions/graphs';
import * as d3 from "d3";

const initialState = {
    links: [
        { source: {id: `Name a0`, type: "a", reflexive: false}, target: {id: `Name a1`, type: "a", reflexive: false}, left: false, right: true },
        { source: {id: `Name a1`, type: "a", reflexive: false}, target: {id: `Name a2`, type: "a", reflexive: false}, left: false, right: true }
    ],
    nodes: [].concat(
        d3.range(10).map((i) => { return {id: `Name a${i}`, type: "a", reflexive: false}; }),
        d3.range(10).map((i) => { return {id: `Name b${i}`, type: "b", reflexive: false}; }),
        d3.range(10).map((i) => { return {id: `Name c${i}`, type: "c", reflexive: false }; }),
        d3.range(1).map((i) => { return { id: `Name d${i}`, type: "d", reflexive: true}; })
    ),
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_NODES_LIST.REQUEST: {
            return {
                ...state,
                status: 'request',
                nodes: [],
            };
        }
        case GET_NODES_LIST.SUCCESS: {
            const { nodes } = action.payload.data;
            return {
                ...state,
                status: 'success',
                nodes,
            };
        }
        case GET_NODES_LIST.FAIL: {
            return {
                ...state,
                status: 'fail',
            };
        }
        case CREATE_NODE: {
            const { node } = action.payload;
            return {...state, nodes: [...state.nodes, node]}
        }
        default: {
            return state;
        }
    }
}
