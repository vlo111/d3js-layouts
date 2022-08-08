import React, {Component, useEffect, useRef, useState} from 'react';
import * as d3 from "d3";
import '../assets/styles/App.css';
import Graph from "./Graph";
import { useSelector } from 'react-redux';
import {getNodes} from "../store/selector/graphs";

function App() {
    const nodes = useSelector(getNodes);

    return (
         <div id="graph">
            <Graph nodes={nodes} links={[]} />
         </div>
    )
}

export default App;
