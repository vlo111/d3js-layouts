import '../App.css';
import * as d3 from 'd3';
import React, {useEffect, useMemo, useRef, useState} from "react";
import ForceGraph from './ForceGraph'

function App() {

    const [charge, setCharge] = useState(-3);

    // create nodes with unique ids
    // radius: 5px
    // const nodes = useMemo(
    //     () =>
    //
    //         d3.range(50).map((n) => {
    //             return { id: n, r: 5 };
    //         }),
    //     []
    // );
    const nodes = useMemo(
        () =>
            [].concat(
                d3.range(10).map((i) => {
                    return {id: `a${i}`, type: "a", r: 10};
                }),
                d3.range(20).map((i) => {
                    return {id: `b${i}`, type: "b", r: 10};
                }),
                d3.range(300).map((i) => {
                    return {id: `c${i}`, type: "c", r: 10};
                }),
                d3.range(1).map((i) => {
                    return {id: `d${i}`, type: "d", r: 10};
                })
            ),
        []
    );


    return (
        <div className="App">
            <input
                type="range"
                min="-60"
                max="0"
                step="1"
                value={charge}
                onChange={(e) => setCharge(e.target.value)}
            />
            <svg width="1600" height="800">
                <ForceGraph nodes={nodes} charge={charge}/>
            </svg>
        </div>
    );
}

export default App;
