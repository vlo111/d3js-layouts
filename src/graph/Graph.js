import React, {Component, useEffect, useRef, useState} from 'react';
import * as d3 from "d3";
import '../assets/styles/App.css';
import Chart from "./Chart";
import {useDispatch} from "react-redux";
import {createNode} from "../store/actions/graphs";

function Graph({nodes, links}) {

    const dispatch = useDispatch();

    const addNewNode = (node) => {
        dispatch(createNode(node))
    }

    useEffect(() => {
        Chart.render(nodes, links);
    }, [nodes])

    useEffect(() => {
        Chart.event.on('node.create', addNewNode);
    }, [])

    return (
        // <div ref={svgRef}> </div>
        <svg width={window.innerWidth - 150} height={window.innerHeight - 110}>
            <g className="wrapper">
                <g className="nodes"/>
                <g className="links"/>
            </g>
        </svg>
    )
}

export default Graph;
