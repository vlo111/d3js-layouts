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

/*
    //#region chart fields
    let width = window.innerWidth - 50;
    let height = window.innerHeight - 50;
    let colors = d3.scaleOrdinal(d3.schemeCategory10);
    let svg;
    let lastNodeId = 0;
    let force;
    let drag;
    let circle;
    //#endregion

    //#region event fields
    let selectedNode = null;
    let mousedownNode = null;
    //#endregion

    useEffect(() => {
        return () => {
            initChart();

            render();
        }
    }, []);

    // update force layout (called automatically each iteration)
    const tick = () => {
        circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

    // update graph (called when needed)
    const render = () => {

        // circle (node) group
        // NB: the function arg is crucial here! nodes are known by id, not by index!
        circle = circle.data(nodes, (d) => d.id);

        // update existing nodes (reflexive & selected visual states)
        circle.selectAll('circle')
            .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
            .classed('reflexive', (d) => d.reflexive);

        // remove old nodes
        circle.exit().remove();

        // add new nodes
        const g = circle.enter().append('svg:g');

        g.append('svg:circle')
            .attr('class', 'node')
            .attr('r', 40)
            .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
            .style('stroke', (d) => d3.rgb(colors(d.id)).darker().toString())
            .style('stroke-opacity', "0.1")
            .style('filter', "drop-shadow(12px 12px 7px rgba(0,0,0,0.5))")
            .style('stroke-width', "5px")
            .classed('reflexive', (d) => d.reflexive)
            .on('mouseover', (event, d) => {
                if (!mousedownNode || d === mousedownNode) return;
                // enlarge target node
                d3.select(event.currentTarget).attr('transform', 'scale(1.1)');
            })
            .on('mouseout', (event, d) => {
                if (!mousedownNode || d === mousedownNode) return;
                // unenlarge target node
                d3.select(event?.currentTarget).attr('transform', '');
            });

        // show node IDs
        g.append('svg:text')
            .attr('x', 0)
            .attr('y', 4)
            .attr('class', 'id')
            .text((d) => d.id);

        circle = g.merge(circle);

        // set the graph in motion
        force.nodes(nodes);

        force.alphaTarget(0.3).restart();
    }

    //# region  EVENTS

    const mousedown = (event, d) => {
        // insert new node at point
        const point = d3.pointer(event);
        const node = {id: ++lastNodeId, reflexive: false, x: point[0], y: point[1]};
        nodes.push(node);

        render();
    }

    //# endregion

    const initChart = () => {

        svg = d3.select(svgRef.current).on('contextmenu', (event, d) => {
            event.preventDefault();
        })

        // set up initial nodes and links
        //  - nodes are known by 'id', not by index in array.
        //  - reflexive edges are indicated on the node (as a bold black circle).
        //  - links are always source < target; edge directions are set by 'left' and 'right'.

        // init D3 force layout
        force = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(-400))
            .force('x', d3.forceX(width / 2))
            .force('y', d3.forceY(height / 2))
            //.force('center', d3.forceCenter(width / 2, height / 2))
            .force("gravity", d3.forceManyBody(50))
            .on('tick', () => tick());

        // init D3 drag support
        drag = d3.drag()
            // Mac Firefox doesn't distinguish between left/right click when Ctrl is held...
            .filter((event, d) => event.button === 0 || event.button === 2)
            .on('start', (event, d) => {
                if (!event.active) force.alphaTarget(0.3).restart();

                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) force.alphaTarget(0);

                d.fx = null;
                d.fy = null;
            });

        // handles to link and node element groups
        circle = svg.select('.nodes').selectAll('g');

        // app starts here
        svg.on('mousedown', (event, d) => mousedown(event, d))
    }
*/
    return (
        // <div ref={svgRef}> </div>
        <svg width={window.innerWidth - 50} height={window.innerHeight - 50}>
            <g className="wrapper">
                <g className="nodes"/>
                <g className="links"/>
            </g>
        </svg>
    )
}

export default Graph;
