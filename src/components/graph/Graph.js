import React, {Component, useEffect, useRef, useState} from 'react';
import * as d3 from "d3";
import '../../assets/styles/App.scss';
import Chart from "./Chart";
import {useDispatch} from "react-redux";
import {createNode, createLink} from "../../store/actions/graphs";

function Graph({nodes, links}) {

    const dispatch = useDispatch();

    const addNewNode = (node) => {
        dispatch(createNode(node));
    }

    const addNewLink = (link) => {
        dispatch(createLink(link));
    }

    useEffect(() => {
        Chart.render(nodes, links);
    }, [nodes, links])

    useEffect(() => {
        Chart.event.on('node.create', addNewNode);
        Chart.event.on('link.create', addNewLink);
    }, [])

    return (
        <svg className="layer" width={window.innerWidth - 150} height={window.innerHeight - 110}>
            <g className="wrapper">
                <path className="link dragline hidden" d="M0,0L0,0"/>
                <g className="nodes"/>
                <g className="links"/>
            </g>
        </svg>
    )
}

export default Graph;
