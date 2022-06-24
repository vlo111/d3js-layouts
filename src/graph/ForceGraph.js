import App from "./App";
import {useEffect, useState} from "react";
import * as d3 from 'd3';

function ForceGraph({nodes, charge}) {
    const [animatedNodes, setAnimatedNodes] = useState([]);

    // re-create animation every time nodes change
    useEffect(() => {
        const simulation = d3
            .forceSimulation()
            .force("x", d3.forceX(800))
            .force("y", d3.forceY(350))
            .force("charge", d3.forceManyBody().strength(charge))
            .force("collision", d3.forceCollide(5));

        // update state on every frame
        simulation.on("tick", () => {
            setAnimatedNodes([...simulation.nodes()]);
        });

        // copy nodes into simulation
        simulation.nodes([...nodes]);
        // slow down with a small alpha
        simulation.alpha(0.1).restart();

        // stop simulation on unmount
        return () => simulation.stop();
    }, [nodes, charge]);

    return (
        <g>
            {animatedNodes.map((node) => (
                <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    key={node.id}
                    stroke="black"
                    fill={node.type !== "d" ? node.type === "a" ? "brown" : node.type === "b" ? "steelblue" : "#e92525" : 'mediumslateblue'}
                />
            ))}
        </g>
    );
}

export default ForceGraph;
