import './App.css';
import * as d3 from 'd3';
import React, {useEffect, useRef, useState} from "react";

const data = {
    links: [
        // Groups
        {
            source: 'Marvel',
            target: 'Heroes',
            sourceX: 10,
            sourceY: 23,
            targetX: 40,
            targetY: 50,
        },
        {
            source: 'Marvel',
            target: 'Villains',
            sourceX: 100,
            sourceY: 230,
            targetX: 400,
            targetY: 500,
        },
        {
            source: 'Marvel',
            target: 'Teams',
            sourceX: 200,
            sourceY: 100,
            targetX: 50,
            targetY: 150,
        },
        // Heroes
        {
            source: 'Heroes',
            target: 'Spider-Man',
            sourceX: 45,
            sourceY: 85,
            targetX: 15,
            targetY: 35,
        },
        {
            source: 'Heroes',
            target: 'CAPTAIN MARVEL',
        },
        {
            source: 'Heroes',
            target: 'HULK',
        },
        {
            source: 'Heroes',
            target: 'Black Widow',
        },
        {
            source: 'Heroes',
            target: 'Daredevil',
        },
        {
            source: 'Heroes',
            target: 'Wolverine',
        },
        {
            source: 'Heroes',
            target: 'Captain America',
        },
        {
            source: 'Heroes',
            target: 'Iron Man',
        },
        {
            source: 'Heroes',
            target: 'THOR',
        },
        // Villains
        {
            source: 'Villains',
            target: 'Dr. Doom',
        },
        {
            source: 'Villains',
            target: 'Mystique',
        },
        {
            source: 'Villains',
            target: 'Red Skull',
        },
        {
            source: 'Villains',
            target: 'Ronan',
        },
        {
            source: 'Villains',
            target: 'Magneto',
        },
        {
            source: 'Villains',
            target: 'Thanos',
        },
        {
            source: 'Villains',
            target: 'Black Cat',
        },
        // Teams
        {
            source: 'Teams',
            target: 'Avengers',
        },
        {
            source: 'Teams',
            target: 'Guardians of the Galaxy',
        },
        {
            source: 'Teams',
            target: 'Defenders',
        },
        {
            source: 'Teams',
            target: 'X-Men',
        },
        {
            source: 'Teams',
            target: 'Fantastic Four',
        },
        {
            source: 'Teams',
            target: 'Inhumans',
        },
    ],
    nodes: [
        // Groups
        {
            id: 'Marvel',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/marvel.png',
            size: 500,
            fontSize: 18,
        },
        {
            id: 'Heroes',
            symbolType: 'circle',
            color: 'red',
            size: 300,
        },
        {
            id: 'Villains',
            symbolType: 'circle',
            color: 'red',
            size: 300,
        },
        {
            id: 'Teams',
            symbolType: 'circle',
            color: 'red',
            size: 300,
        },
        // Heroes
        {
            id: 'Spider-Man',
            name: 'Peter Benjamin Parker',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_spiderman.png',
            size: 400,
        },
        {
            id: 'CAPTAIN MARVEL',
            name: 'Carol Danvers',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_captainmarvel.png',
            size: 400,
        },
        {
            id: 'HULK',
            name: 'Robert Bruce Banner',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_hulk.png',
            size: 400,
        },
        {
            id: 'Black Widow',
            name: 'Natasha Alianovna Romanova',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_blackwidow.png',
            size: 400,
        },
        {
            id: 'Daredevil',
            name: 'Matthew Michael Murdock',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_daredevil.png',
            size: 400,
        },
        {
            id: 'Wolverine',
            name: 'James Howlett',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_wolverine.png',
            size: 400,
        },
        {
            id: 'Captain America',
            name: 'Steven Rogers',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_captainamerica.png',
            size: 400,
        },
        {
            id: 'Iron Man',
            name: 'Tony Stark',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_ironman.png',
            size: 400,
        },
        {
            id: 'THOR',
            name: 'Thor Odinson',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_thor.png',
            size: 400,
        },
        // Villains
        {
            id: 'Dr. Doom',
            name: 'Victor von Doom',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/drdoom.png',
            size: 400,
        },
        {
            id: 'Mystique',
            name: 'Unrevealed',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/mystique.png',
            size: 400,
        },
        {
            id: 'Red Skull',
            name: 'Johann Shmidt',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/redskull.png',
            size: 400,
        },
        {
            id: 'Ronan',
            name: 'Ronan',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/ronan.png',
            size: 400,
        },
        {
            id: 'Magneto',
            name: 'Max Eisenhardt',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/magneto.png',
            size: 400,
        },
        {
            id: 'Thanos',
            name: 'Thanos',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/thanos.png',
            size: 400,
        },
        {
            id: 'Black Cat',
            name: 'Felicia Hardy',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/blackcat.png',
            size: 400,
        },
        // Teams
        {
            id: 'Avengers',
            name: '',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/avengers.png',
            size: 400,
        },
        {
            id: 'Guardians of the Galaxy',
            name: '',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/gofgalaxy.png',
            size: 400,
        },
        {
            id: 'Defenders',
            name: '',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/defenders.png',
            size: 400,
        },
        {
            id: 'X-Men',
            name: '',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/xmen.png',
            size: 400,
        },
        {
            id: 'Fantastic Four',
            name: '',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/fantasticfour.png',
            size: 400,
        },
        {
            id: 'Inhumans',
            name: '',
            svg:
                'http://marvel-force-chart.surge.sh/marvel_force_chart_img/inhumans.png',
            size: 400,
        },
    ],
};

function App() {

    const container = useRef(null);

    const [nodes, setNodes] = useState(
        [].concat(
            d3.range(10).map((i) => { return {id: `a${i}`, type: "a"}; }),
            d3.range(20).map((i) => { return {id: `b${i}`, type: "b"}; }),
            d3.range(30).map((i) => { return {id: `c${i}`, type: "c"}; }),
            d3.range(1).map((i) => { return { id: `d${i}`, type: "d"}; })
    )
    );

    const [width, setWidth] = useState(100);

    const [height, setHeight] = useState(100);

    const [links, setLinks] = useState([
        {
            source: 4,
            target: 1
        },
        {
            source: 5,
            target: 2
        },
        {
            source: 2,
            target: 3
        },
        {
            source: 2,
            target: 4
        },
        {
            source: 1,
            target: 5
        },
        {
            source: 1,
            target: 6
        },
        {
            source: 1,
            target: 7
        },
    ]);

    useEffect(() => {

        return () => {
            const root = d3.select(container.current);

            // What happens when a circle is dragged?
            const dragstarted = (ev, d) => {
                debugger
                // if (!d3.event.active) simulation.alphaTarget(.03).restart();
                d.fx = ev.x;
                d.fy = ev.y;
            }

            const dragged = (ev, d) => {
                d.fx = ev.x;
                d.fy = ev.y;
            }

            const dragended = (ev, d) => {
                // if (!d3.event.active) simulation.alphaTarget(.03);
                d.fx = null;
                d.fy = null;
            }

            const node = root
                .append("g")
                .selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("r", 10)
                .attr("fill", function(d) { return d.type !== "d" ? d.type === "a" ? "brown" : d.type === "b" ? "steelblue" : "#1fd710" : 'mediumslateblue'; })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            const ticked = () => {
                node
                    .attr("cx", function(d) {
                        return d.x + 450; })
                    .attr("cy", function(d) { return d.y + 350; });
            }

// A scale that gives a X target position for each group
            const x = d3.scaleOrdinal()
                .domain([1, 2, 3, 4])
                .range([10, 200, 400, 500])

            const simulation = d3.forceSimulation(nodes)
                .force("charge", d3.forceCollide().radius(1))
                .force("r", d3.forceRadial(function(d) { return d.type === "d" ? 1 : d.type === "a" ? 100 : d.type === "b" ? 200 : 300; }))
                // .force("x", d3.forceX().strength(0.5).x( function(d){ return x(d.type) } ))
                // .force("y", d3.forceY().strength(0.5).y( height / 2 ))
                // .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
                // .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
                // .force("collide", d3.forceCollide().strength(.1).radius(15).iterations(1)) // Force that avoids circle overlapping
                .on("tick", ticked);
        }
    }, []);

  return (
    <div className="App">
        <svg
            style={{ marginTop: 20, width: 900, height: 700, background: "#eee", border: '1px solid red' }}
            ref={container}
        />
    </div>
  );
}

export default App;
