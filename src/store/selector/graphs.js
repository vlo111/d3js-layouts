import { createSelector } from 'reselect';

export const getGraph = (state) => state.graphs;

export const getNodes = createSelector(
    getGraph,
    (items) => items.nodes,
);

export const getLinks = createSelector(
    getGraph,
    (items) => items.links,
);
