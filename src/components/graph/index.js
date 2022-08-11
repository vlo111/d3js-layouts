import React, {useEffect, useState} from 'react';
import '../../assets/styles/App.scss';
import Graph from "./Graph";
import {useDispatch, useSelector} from 'react-redux';
import {getLinks, getNodes} from "../../store/selector/graphs";
import Toolbar from "../Toolbar";
import Chart from "./Chart";
import {clearData} from "../../store/actions/graphs";

function App() {

    const dispatch = useDispatch();

    const nodes = useSelector(getNodes);
    const links = useSelector(getLinks);

    const [charge, setCharge] = useState(100);
    const [distance, setDistance] = useState(200);

    useEffect(() => {
        Chart.charge(-charge)
    }, [charge])

    useEffect(() => {
        Chart.distance(distance)
    }, [distance])


    const clearFrame = () => {
        dispatch(clearData())
    }

    const autoScale = () => {
        Chart.autoScale();
    }

    const chargeCyclic = () => {
        Chart.chargeCyclic();
    }

    return (
        <div>
            <div className="header">
                <div className="caption">

                </div>
                <div className="footer-tools">
                    <div className="left-bar">
                        <div className="undo">

                        </div>

                        <div className="separator" role="separator"></div>

                        <div className="zoom" onClick={autoScale}>
                            <div className="zoom-icon"/>
                        </div>
                        <div className="separator" role="separator"></div>
                        <div onClick={clearFrame} className="clear-frame-block">
                            <div className="clear-frame">
                                Clear frame
                            </div>
                        </div>

                        <div onClick={chargeCyclic} className="clear-frame-block">
                            <div className="clear-frame">
                                Charge Cyclic
                            </div>
                        </div>
                    </div>
                    <div className="settings">
                        <div className="tool-block">
                            <span className="charge-name">Charge</span>
                            <input
                                className="range"
                                type="range"
                                min="0"
                                max="5000"
                                step="1"
                                value={charge}
                                onChange={(e) => setCharge(e.target.value)}
                            />
                            <span className="range-value">{charge}</span>
                        </div>
                        <div className="tool-block">
                            <span className="distance">Distance</span>
                            <input
                                className="range"
                                type="range"
                                min="0"
                                max="1000"
                                step="1"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                            />
                            <span className="range-value">{distance}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="graph">
                <Toolbar/>
                <div className="graph-content">
                    <div className="track">
                        <div className="frame">
                            <Graph nodes={nodes} links={links}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
