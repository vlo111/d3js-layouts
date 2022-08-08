import React from 'react';
import '../assets/styles/App.css';
import Graph from "./Graph";
import { useSelector } from 'react-redux';
import {getNodes} from "../store/selector/graphs";

function App() {
    const nodes = useSelector(getNodes);

    return (
         <div id="graph">
             <div className="graph-content">
                 <div className="track">
                     <div className="frame">
                         <Graph nodes={nodes} links={[]} />
                     </div>
                 </div>
             </div>
         </div>
    )
}

export default App;
