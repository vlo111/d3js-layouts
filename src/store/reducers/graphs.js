import {
    CREATE_NODE, CREATE_LINK, CLEAR_DATA
} from '../actions/graphs';
import * as d3 from "d3";

const initialState = {
    // links: [
    //     { source: {id: `Name a0`, type: "a", reflexive: false}, target: {id: `Name a1`, type: "a", reflexive: false}, left: false, right: true },
    //     { source: {id: `Name a1`, type: "a", reflexive: false}, target: {id: `Name a2`, type: "a", reflexive: false}, left: false, right: true }
    // ],
    // nodes: [].concat(
    //     d3.range(10).map((i) => { return {id: `Name a${i}`, type: "a", reflexive: false}; }),
    //     d3.range(10).map((i) => { return {id: `Name b${i}`, type: "b", reflexive: false}; }),
    //     d3.range(10).map((i) => { return {id: `Name c${i}`, type: "c", reflexive: false }; }),
    //     d3.range(1).map((i) => { return { id: `Name d${i}`, type: "d", reflexive: true}; })
    // ),
    links: [],
    nodes: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_NODE: {
            const { node } = action.payload;
            return {...state, nodes: [...state.nodes, node]}
        }
        case CREATE_LINK: {
            const { link } = action.payload;
            return {...state, links: [...state.links, link]}
        }
        case CLEAR_DATA: {
            return {nodes: [], links: []}
        }
        default: {
            return state;
        }
    }
}
