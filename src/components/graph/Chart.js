import * as d3 from 'd3';
import EventEmitter from 'events';
import {NODE_COLOR, TOOL_MODE} from "../../data/node";
import Utils from "../../helpers/utils";
import ChartUtils from "../../helpers/utils";

class Chart {

    static event = new EventEmitter();

    static isInitialed = false;
    static width = window.innerWidth - 150;
    static height = window.innerHeight - 110;

    static lastNodeId = 0;
    static colors = d3.scaleOrdinal(d3.schemeCategory10);
    static mousedownNode = null;

    static dragLine = null;
    static mousedownLink = null;
    static selectedLink = null;
    static selectedNode = null;

    static activeColor = NODE_COLOR.Yellow;
    static activeTool = null;

    static resetMouseFields = () => {
        this.mousedownNode = null;
        this.mouseupNode = null;
        this.mousedownLink = null;
    }

    static mousedown = (event, d) => {
        if (event.ctrlKey || this.mousedownNode || this.mousedownLink) return;

        if (this.activeTool === TOOL_MODE.CreateNode) {
            // insert new node at point
            const point = d3.pointer(event);

            const id = ++this.lastNodeId;

            let color = this.activeColor;
            if (color === NODE_COLOR.Rainbow) {
                color = this.colors(id);
            }

            const { x, y } = this.calcScaledPosition(point[0], point[1]);

            const node = {id, reflexive: false,
                x: x || 0,
                y: y || 0,
                color: color};

            this.event.emit('node.create', node);
        }
    }

    static mousemove = (event, d) => {
        if (!this.mousedownNode) return;

        const { x: lx, y: ly} = this.calcScaledPosition(d3.pointer(event)[0], d3.pointer(event)[1]);

        // update drag line
        this.dragLine.attr('d', `M${this.mousedownNode.x},${this.mousedownNode.y}L${lx},${ly}`);
    }

    static mouseup = (event, d) => {
        if (this.mousedownNode) {
            // hide drag line
            this.dragLine
                .classed('hidden', event.currentTarget)
                .style('marker-end', '');
        }

        // because :active only works in WebKit?
        this.svg.classed('active', false);

        // clear mouse event vars
        this.resetMouseFields();

        this.svg.call(this.zoom).on('dblclick.zoom', null)
    }

    static tick = () => {
        // draw directed edges with proper padding from node centers
        this.linksWrapper.selectAll('path').attr('d', (d) => {
            const deltaX = d.target.x - d.source.x;
            const deltaY = d.target.y - d.source.y;
            const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const normX = deltaX / dist;
            const normY = deltaY / dist;
            const sourcePadding = d.left ? 48 : 44;
            const targetPadding = d.right ? 48 : 44;
            const sourceX = d.source.x + (sourcePadding * normX);
            const sourceY = d.source.y + (sourcePadding * normY);
            const targetX = d.target.x - (targetPadding * normX);
            const targetY = d.target.y - (targetPadding * normY);

            return `M${sourceX},${sourceY}L${targetX},${targetY}`;
        });

        this.nodesWrapper.selectAll('g').attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

    static render(nodes, links) {
        try {
            this.nodesData = nodes;

            this.linksData = links;

            if (!this.isInitialed) {

                this.svg = d3.select('.layer').on('contextmenu', (event, d) => {
                    event.preventDefault();
                }).on('mousedown', (event, d) => this.mousedown(event, d));

                this.zoom = d3.zoom()
                    .on('zoom', this.handleZoom)
                    .scaleExtent([0.04, 2.5]); // 4% min zoom level to max 250%

                this.wrapper = d3.select('.wrapper');

                // init D3 force layout
                this.force = d3.forceSimulation()
                    .force('link', d3.forceLink().id((d) => d.id).distance(200))
                    .force('charge', d3.forceManyBody().strength(-200))
                    .force('x', d3.forceX(this.width / 2))
                    .force('y', d3.forceY(this.height / 2))
                    //.force('center', d3.forceCenter(width / 2, height / 2))
                    .force("gravity", d3.forceManyBody(50))
                    .on('tick', () => this.tick());

                // init D3 drag support
                this.drag = d3.drag()
                    // Mac Firefox doesn't distinguish between left/right click when Ctrl is held...
                    // .filter((event, d) => event.button === 0 || event.button === 2)
                    .on('start', (event, d) => {
                        if (!event.active) this.force.alphaTarget(0.3).restart();

                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on('drag', (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                    })
                    .on('end', (event, d) => {
                        if (!event.active) this.force.alphaTarget(0);

                        d.fx = null;
                        d.fy = null;
                    });

                // handles to link and node element groups
                this.nodesWrapper = this.svg.select('.nodes');
                this.linksWrapper = this.svg.select('.links');

                this.nodeWrapper = this.nodesWrapper.selectAll('g');

                // line displayed when dragging new nodes
                this.dragLine = this.svg.select('.dragline');

                // handles to link and node element groups
                this.linkWrapper = this.linksWrapper.selectAll('path');

                // app starts here
                this.svg.on('mousedown', (event, d) => this.mousedown(event, d))
                    .on('mousemove', (event, d) => this.mousemove(event, d))
                    .on('mouseup', (event, d) => this.mouseup(event, d));

                this.svg.call(this.zoom).on('dblclick.zoom', null)

                // define arrow markers for graph links
                this.svg.append('svg:defs').append('svg:marker')
                    .attr('id', 'end-arrow')
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', 6)
                    .attr('markerWidth', 3)
                    .attr('markerHeight', 3)
                    .attr('orient', 'auto')
                    .append('svg:path')
                    .attr('d', 'M0,-5L10,0L0,5')
                    .attr('fill', '#000');

                this.svg.append('svg:defs').append('svg:marker')
                    .attr('id', 'start-arrow')
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', 4)
                    .attr('markerWidth', 3)
                    .attr('markerHeight', 3)
                    .attr('orient', 'auto')
                    .append('svg:path')
                    .attr('d', 'M10,-5L0,0L10,5')
                    .attr('fill', '#000');

                this.isInitialed = true;
            }

            this.draw();
        } catch (e) {
            console.error(e);
        }
    }

    static draw = () => {
        // path (link) group
        this.linkWrapper = this.linkWrapper.data(this.linksData);

        // update existing links
        this.linkWrapper.classed('selected', (d) => d === this.selectedLink)
            .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
            .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

        // remove old links
        this.linkWrapper.exit().remove();

        // add new links
        this.linkWrapper = this.linkWrapper.enter().append('svg:path')
            .attr('class', 'link')
            .classed('selected', (d) => d === this.selectedLink)
            .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
            .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')
            .on('mousedown', (event, d) => {
                if (this.activeTool === TOOL_MODE.Cursor) return;

                // select link
                this.mousedownLink = d;
                this.selectedLink = (this.mousedownLink === this.selectedLink) ? null : this.mousedownLink;
                this.selectedNode = null;
                this.draw();
            })
            .merge(this.linkWrapper);

        this.nodeWrapper = this.nodeWrapper.data(this.nodesData, (d) => d.id);

        // update existing nodes (reflexive & selected visual states)
        this.nodeWrapper.selectAll('circle')
            .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id))
            .classed('reflexive', (d) => d.reflexive);

        // remove old nodes
        this.nodesWrapper.selectAll('g > *').remove();

        // add new nodes
        const g = this.nodeWrapper.enter().append('svg:g');

        g.append('svg:circle')
            .attr('class', 'node')
            .attr('r', 40)
            .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(d.color).brighter().toString() : d3.rgb(d.color).brighter().toString())
            .style('stroke', (d) => d3.rgb(d.color).darker().toString())
            .style('stroke-opacity', "0.1")
            .style('filter', "drop-shadow(12px 12px 7px rgba(0,0,0,0.5))")
            .style('stroke-width', "5px")
            .classed('reflexive', (d) => d.reflexive)
            .on('mouseover', (event, d) => {
                if (!this.mousedownNode || d === this.mousedownNode) return;
                // enlarge target node
                d3.select(event.currentTarget).attr('transform', 'scale(1.1)');
            })
            .on('mouseout', (event, d) => {
                if (!this.mousedownNode || d === this.mousedownNode) return;
                // unenlarge target node
                d3.select(event?.currentTarget).attr('transform', '');
            })
            .on('mousedown', (event, d) => {
                if (this.activeTool !== TOOL_MODE.CreateLink) return;
                this.svg.on('.zoom', null);
                // select node
                this.mousedownNode = d;
                this.selectedNode = (this.mousedownNode === this.selectedNode) ? null : this.mousedownNode;
                this.selectedLink = null;

                // reposition drag line
                this.dragLine
                    .style('marker-end', 'url(#end-arrow)')
                    .classed('hidden', false)
                    .attr('d', `M${this.mousedownNode.x},${this.mousedownNode.y}L${this.mousedownNode.x},${this.mousedownNode.y}`);

                this.draw();
            })
            .on('mouseup', (event, d) => {
                if (!this.mousedownNode) return;

                if (this.activeTool !== TOOL_MODE.CreateLink) return;

                // needed by FF
                this.dragLine
                    .classed('hidden', true)
                    .style('marker-end', '');

                // check for drag-to-self
                this.mouseupNode = d;
                if (this.mouseupNode === this.mousedownNode) {
                    this.resetMouseFields();
                    return;
                }

                // unenlarge target node
                d3.select(event.currentTarget).attr('transform', '');

                // add link to graph (update if exists)
                // NB: links are strictly source < target; arrows separately specified by booleans
                const isRight = this.mousedownNode.id < this.mouseupNode.id;
                const source = isRight ? this.mousedownNode : this.mouseupNode;
                const target = isRight ? this.mouseupNode : this.mousedownNode;

                let link = this.linksData.filter((l) => l.source === source && l.target === target)[0];
                if (link) {
                    link[isRight ? 'right' : 'left'] = true;
                } else {
                    // add link
                    // console.log('added link - ', {source, target, left: !isRight, right: isRight})
                    // this.linksData.push({source, target, left: !isRight, right: isRight});

                    this.event.emit('link.create', {source, target, left: !isRight, right: isRight});
                }

                // select new link
                this.selectedLink = link;
                this.selectedNode = null;
                this.draw();
            });

        // show node IDs
        g.append('svg:text')
            .attr('x', 0)
            .attr('y', 4)
            .attr('class', 'id')
            .text((d) => d.id);

        // set the graph in motion
        this.force.nodes(this.nodesData).force('link').links(this.linksData);

        this.force.alphaTarget(0.3).restart();
    }

    static distance = (val) => {
        if (this.force) {
            this.force.force('link', d3.forceLink().id((d) => d.id).distance(val));
            this.draw();
        }
    }

    static charge = (val) => {
        if (this.force) {
            this.force.force('charge', d3.forceManyBody().strength(val));
            this.draw();
        }
    }

    static chargeCyclic = () => {
        if (this.force) {
            this.force.velocityDecay(0.1)
                .force('collide', d3.forceCollide().radius(20))
                .force('x', null)
                .force('y', null)
                .force("r", d3.forceRadial(function(d) {
                    switch (d.color) {
                        case NODE_COLOR.Yellow:
                            return 1;
                        case NODE_COLOR.Red:
                            return 300;
                        case NODE_COLOR.Purple:
                            return 600;
                        case NODE_COLOR.Teal:
                            return 900;
                        case NODE_COLOR.Blue:
                            return 1200;
                        default:
                            return 1500;
                    }
                }))
            this.draw();
        }
    }

    static cancelChargeCyclic = () => {
        if (this.force) {
            this.force.velocityDecay(0.5)
                .force('collide', d3.forceCollide().radius(20))
                .force('x', d3.forceX(this.width / 2))
                .force('y', d3.forceY(this.height / 2))
                .force("r", null)
            this.draw();
        }
    }

    static clusteringCharge = () => {
        if (this.force) {
            this.force.velocityDecay(0.5)
                .force('collide', d3.forceCollide().radius(20))
                .force('x', d3.forceX().x(function(d) {
                    switch (d.color) {
                        case NODE_COLOR.Yellow:
                            return 1;
                        case NODE_COLOR.Red:
                            return 300;
                        case NODE_COLOR.Purple:
                            return 600;
                        case NODE_COLOR.Teal:
                            return 900;
                        case NODE_COLOR.Blue:
                            return 1200;
                        default:
                            return 1500;
                    }
                }))
                .force('collision', d3.forceCollide().radius(function(d) {
                    return d.radius;
                }))

            this.draw();
        }
    }

    static solidCollide = () => {
        if (this.force) {
            this.force.force('collide',d3.forceCollide().radius(60).iterations(40))

            this.draw();
        }
    }

    static handleZoom = (ev) => {
        if (this.activeButton === 'create-label' || ev.sourceEvent?.shiftKey) {
            return;
        }
        const { transform } = ev;
        this.wrapper.attr('transform', transform)
            .attr('data-scale', transform.k)
            .attr('data-x', transform.x)
            .attr('data-y', transform.y);

        // // mouse cursor
        // const mouseCursorPosition = this.svg.select('.mouseCursorPosition');
        // mouseCursorPosition.attr('transform', transform)
        //     .attr('data-scale', transform.k)
        //     .attr('data-x', transform.x)
        //     .attr('data-y', transform.y);
        //
        // this.event.emit('zoom', ev, { transform });
        //
        // this.setAreaBoardZoom(transform);
        // if (this.nodesPath) return;
        // this.renderNodeText(transform.k);
        // this.renderIcons(transform.k);
        // this.renderNodeStatusText(transform.k);
        // this.renderNodeMatchText(transform.k);
    }

    static calcScaledPosition(x = 0, y = 0, del = '/') {
        if (!this.wrapper || this.wrapper.empty()) {
            return {
                x: 0,
                y: 0,
                moveX: 0,
                moveY: 0,
                scale: 1,
            };
        }
        const moveX = +this.wrapper?.attr('data-x') || 0;
        const moveY = +this.wrapper?.attr('data-y') || 0;
        const scale = +this.wrapper?.attr('data-scale') || 1;
        let _x = (x - moveX) / scale;
        let _y = (y - moveY) / scale;
        if (del === '*') {
            _x = (x - moveX) * scale;
            _y = (y - moveY) * scale;
        }
        return {
            x: _x,
            y: _y,
            moveX,
            moveY,
            scale,
        };
    }

    static autoScale() {
        const {
            width, height, min,
        } = Utils.getDimensions(this.nodesData, false);
        if (width && this.svg) {

            const LEFT_PADDING = 0;
            const TOP_PADDING = 20;

            const svgHeight = document.querySelector('#graph .layer')
                .getBoundingClientRect().height;

            const svgWidth = document.querySelector('#graph .layer')
                .getBoundingClientRect().width;

            const scaleW = (svgWidth - LEFT_PADDING) / width;
            const scaleH = (svgHeight - TOP_PADDING) / height;
            const scale = Math.min(scaleW, scaleH, 1);
            let left = min[0] * scale * -1 + LEFT_PADDING;
            let top = min[1] * scale * -1 + TOP_PADDING;

            left += ((svgWidth - LEFT_PADDING) - (scale * width)) / 2;
            top += ((svgHeight - TOP_PADDING) - (scale * height)) / 2;
            this.svg.call(this.zoom.transform, d3.zoomIdentity.translate(left, top).scale(scale));
        }
    }

}

export default Chart;
