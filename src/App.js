import './App.css';
import * as d3 from 'd3';
import React, {useEffect, useRef, useState} from "react";
import Utils from "./utils";

function App() {

    const container = useRef(null);

    const [nodes, setNodes] = useState(Utils.getNodes());
    const [links, setLinks] = useState(Utils.getLinks());

    const [width, setWidth] = useState(900);
    const [height, setHeight] = useState(700);

    // const [lastNodeId, setLastNodeId] = useState(2);

    // init D3 force layout
    const force = d3.forceSimulation()
        .force('link', d3.forceLink().id((d) => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('x', d3.forceX(width / 2))
        .force('y', d3.forceY(height / 2))
        // .on('tick', () => tick());

    // init D3 drag support
    const drag = d3.drag()
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

    let dragLine;
    let path;
    let circle;
    let selectedLink;
    let mousedownLink;
    let selectedNode;
    let colors = d3.scaleOrdinal(d3.schemeCategory10);
    let mousedownNode;
    let mouseupNode;
    let lastKeyDown;
    let lastNodeId = 0;

    const resetMouseVars = () => {
        mousedownNode = null;
        mouseupNode = null;
        mousedownLink = null;
    }

    useEffect(() => {

        return () => {
            const root = d3.select(container.current);

            root.attr("width", width)
                .attr("height",height)
                .on('contextmenu', (event, d) => event.preventDefault());

            root.append('svg:defs').append('svg:marker')
                .attr('id', 'end-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 6)
                .attr('markerWidth', 3)
                .attr('markerHeight', 3)
                .attr('orient', 'auto')
                .append('svg:path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', '#000');

            root.append('svg:defs').append('svg:marker')
                .attr('id', 'start-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 4)
                .attr('markerWidth', 3)
                .attr('markerHeight', 3)
                .attr('orient', 'auto')
                .append('svg:path')
                .attr('d', 'M10,-5L0,0L10,5')
                .attr('fill', '#000');

            dragLine = root.append('svg:path')
                .attr('class', 'link dragline hidden')
                .attr('d', 'M0,0L0,0');

            // handles to link and node element groups
            path = d3.select(container.current).append('svg:g').selectAll('path');
            circle = d3.select(container.current).append('svg:g').selectAll('g');

            // app starts here
            root.on('mousedown', (event, d) => mousedown(event, d))
                .on('mousemove', (event, d) => mousemove(event, d))
                .on('mouseup', (event, d) => mouseup(event, d));

            d3.select(window)
                .on('keydown', (event, d) => keydown(event, d))
                .on('keyup', (event, d) => keyup(event, d));

            restart()
        }
    }, []);

       // update graph (called when needed)
    const restart = () => {
        // path (link) group
        path = path.data(links);

        // update existing links
        path.classed('selected', (d) => d === selectedLink)
            .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
            .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

        // remove old links
        path.exit().remove();

        // add new links
        path = path.enter().append('svg:path')
            .attr('class', 'link')
            .classed('selected', (d) => d === selectedLink)
            .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
            .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')
            .on('mousedown', (event, d) => {
                if (event.ctrlKey) return;

                // select link
                mousedownLink = d;
                selectedLink = (mousedownLink === selectedLink) ? null : mousedownLink;
                selectedNode = null;
                restart();
            })
            .merge(path);

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
            .attr('r', 20)
            .style('fill', (d) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
            .style('stroke', (d) => d3.rgb(colors(d.id)).darker().toString())
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
            })
            .on('mousedown', (event, d) => {
                if (event.ctrlKey) return;

                // select node
                mousedownNode = d;
                selectedNode = (mousedownNode === selectedNode) ? null : mousedownNode;
                selectedLink = null;

                // reposition drag line
                dragLine
                    .style('marker-end', 'url(#end-arrow)')
                    .classed('hidden', false)
                    .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`);

                restart();
            })
            .on('mouseup', (event, d) => {
                if (!mousedownNode) return;

                // needed by FF
                dragLine
                    .classed('hidden', true)
                    .style('marker-end', '');

                // check for drag-to-self
                mouseupNode = d;
                if (mouseupNode === mousedownNode) {
                    resetMouseVars();
                    return;
                }

                // unenlarge target node
                d3.select(event.currentTarget).attr('transform', '');

                // add link to graph (update if exists)
                // NB: links are strictly source < target; arrows separately specified by booleans
                const isRight = mousedownNode.id < mouseupNode.id;
                const source = isRight ? mousedownNode : mouseupNode;
                const target = isRight ? mouseupNode : mousedownNode;

                let link = links.filter((l) => l.source === source && l.target === target)[0];
                if (link) {
                    link[isRight ? 'right' : 'left'] = true;
                } else {
                    links.push({ source, target, left: !isRight, right: isRight });
                }

                // select new link
                selectedLink = link;
                selectedNode = null;
                restart();
            });

        // show node IDs
        g.append('svg:text')
            .attr('x', 0)
            .attr('y', 4)
            .attr('class', 'id')
            .text((d) => d.id);

        circle = g.merge(circle);

        // set the graph in motion
        force
            .nodes(nodes)
            .force('link').links(links);

        force.alphaTarget(0.3).restart();
    }

    const mousedown = (event, d) => {
        // because :active only works in WebKit?
        d3.select(container.current).classed('active', event.currentTarget);

        if (event.ctrlKey || mousedownNode || mousedownLink) return;

        // insert new node at point
        const point = d3.pointer(event);
        const node = { id: ++lastNodeId, reflexive: false, x: point[0], y: point[1] };
        nodes.push(node);

        restart();
    }

    const mousemove = (event, d) => {
        if (!mousedownNode) return;
        // update drag line
        dragLine.attr('d', `M${mousedownNode.x},${mousedownNode.y}L${d3.pointer(event)[0]},${d3.pointer(event)[1]}`);
    }

    const mouseup = (event, d) => {
        if (mousedownNode) {
            // hide drag line
            dragLine
                .classed('hidden', event.currentTarget)
                .style('marker-end', '');
        }

        // because :active only works in WebKit?
        d3.select(container.current).classed('active', false);

        // clear mouse event vars
        resetMouseVars();
    }

    const spliceLinksForNode = (node) => {
        const toSplice = links.filter((l) => l.source === node || l.target === node);
        for (const l of toSplice) {
            links.splice(links.indexOf(l), 1);
        }
    }

    const keydown = (event, d) => {
        event.preventDefault();

        if (lastKeyDown !== -1) return;
        lastKeyDown = event.keyCode;

        // ctrl
        if (event.keyCode === 17) {
            circle.call(drag);
            d3.select(container.current).classed('ctrl', event.currentTarget);
            return;
        }

        if (!selectedNode && !selectedLink) return;

        switch (event.keyCode) {
            case 8: // backspace
            case 46: // delete
                if (selectedNode) {
                    nodes.splice(nodes.indexOf(selectedNode), 1);
                    spliceLinksForNode(selectedNode);
                } else if (selectedLink) {
                    links.splice(links.indexOf(selectedLink), 1);
                }
                selectedLink = null;
                selectedNode = null;
                restart();
                break;
            case 66: // B
                if (selectedLink) {
                    // set link direction to both left and right
                    selectedLink.left = true;
                    selectedLink.right = true;
                }
                restart();
                break;
            case 76: // L
                if (selectedLink) {
                    // set link direction to left only
                    selectedLink.left = true;
                    selectedLink.right = false;
                }
                restart();
                break;
            case 82: // R
                if (selectedNode) {
                    // toggle node reflexivity
                    selectedNode.reflexive = !selectedNode.reflexive;
                } else if (selectedLink) {
                    // set link direction to right only
                    selectedLink.left = false;
                    selectedLink.right = true;
                }
                restart();
                break;
        }
    }

    const keyup = (event, d) => {
        lastKeyDown = -1;

        // ctrl
        if (event.keyCode === 17) {
            circle.on('.drag', null);
            d3.select(container.current).classed('ctrl', false);
        }
    }


    return (
    <div className="App">
        <svg
            ref={container}
        />
    </div>
  );
}

export default App;
