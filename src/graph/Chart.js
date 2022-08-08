import * as d3 from 'd3';
import EventEmitter from 'events';

class Chart {

    static event = new EventEmitter();

    static isInitialed = false;

    static lastNodeId = 0;

    static width = window.innerWidth - 50;
    static height = window.innerHeight - 50;

    static colors = d3.scaleOrdinal(d3.schemeCategory10);
    static selectedNode = null;
    static mousedownNode = null;

    static mousedown = (event, d) => {
        // insert new node at point
        const point = d3.pointer(event);

        const node = {id: ++this.lastNodeId, reflexive: false, x: point[0], y: point[1]};

        this.event.emit('node.create', node);
    }

    static tick = () => {
        this.nodesWrapper.selectAll('g').attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

    static render(nodes, links) {
        try {
            this.nodesData = nodes

            this.linksData = links

            if (!this.isInitialed) {
                console.log(nodes)

                this.svg = d3.select('#graph svg').on('contextmenu', (event, d) => {
                    event.preventDefault();
                }).on('mousedown', (event, d) => this.mousedown(event, d))

                this.wrapper = d3.select('.wrapper');

                // init D3 force layout
                this.force = d3.forceSimulation()
                    .force('charge', d3.forceManyBody().strength(-400))
                    .force('x', d3.forceX(this.width / 2))
                    .force('y', d3.forceY(this.height / 2))
                    //.force('center', d3.forceCenter(width / 2, height / 2))
                    .force("gravity", d3.forceManyBody(50))
                    .on('tick', () => this.tick());

                // init D3 drag support
                this.drag = d3.drag()
                    // Mac Firefox doesn't distinguish between left/right click when Ctrl is held...
                    .filter((event, d) => event.button === 0 || event.button === 2)
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
                this.nodesWrapper = d3.select('.nodes');

                this.nodeWrapper = this.nodesWrapper.selectAll('g');

                // app starts here
                this.svg.on('mousedown', (event, d) => this.mousedown(event, d))

                this.isInitialed = true;
            }
            this.draw();
        } catch (e) {
            console.error(e);
        }
    }

    static draw = () => {
        // circle (node) group
        // NB: the function arg is crucial here! nodes are known by id, not by index!
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
            .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id))
            .style('stroke', (d) => d3.rgb(this.colors(d.id)).darker().toString())
            .style('stroke-opacity', "0.1")
            .style('filter', "drop-shadow(12px 12px 7px rgba(0,0,0,0.5))")
            .style('stroke-width', "5px")
            .classed('reflexive', (d) => d.reflexive)

        // show node IDs
        g.append('svg:text')
            .attr('x', 0)
            .attr('y', 4)
            .attr('class', 'id')
            .text((d) => d.id);

        // set the graph in motion
        this.force.nodes(this.nodesData);

        this.force.alphaTarget(0.3).restart();
    }
}

export default Chart;
