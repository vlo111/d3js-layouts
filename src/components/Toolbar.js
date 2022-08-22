import React, {useEffect, useState} from 'react';
import '../assets/styles/App.scss';
import {ReactComponent as CursorSvg} from '../assets/icons/cursor.svg';
import {ReactComponent as PencilSvg} from '../assets/icons/pencil.svg';
import {ReactComponent as LinkSvg} from '../assets/icons/arrow.svg';
import {ReactComponent as LayoutSvg} from '../assets/icons/layout.svg';
import {ReactComponent as CircularSvg} from '../assets/icons/circular.svg';
import {ReactComponent as DefaultChargeSvg} from '../assets/icons/default.svg';
import {ReactComponent as ClusteringSvg} from '../assets/icons/clustering.svg';
import {ReactComponent as SolidSvg} from '../assets/icons/solid.svg';
import Outside from "./Outside";
import Chart from "./graph/Chart";
import {NODE_COLOR, TOOL_MODE} from "../data/node";

function Toolbar() {

    const [activeTool, setActiveTool] = useState('');

    const [colorOptions, setColorOptions] = useState(false);

    const [layoutOptions, setLayoutOptions] = useState(false);

    const [activeColor, setActiveColor] = useState(NODE_COLOR.Yellow);

    const activeColorStyle = {backgroundColor: activeColor};

    const activeColorBGStyle = {background: activeColor};

    useEffect(() => {
        Chart.activeColor = activeColor;
    }, [activeColor]);

    useEffect(() => {
        Chart.activeTool = activeTool;

        const layerElement = document.querySelector('.layer');

        if(layerElement) {
            layerElement.style.cursor = 'auto';

            if (activeTool === TOOL_MODE.CreateNode)
                layerElement.style.cursor = 'crosshair';

            if(activeTool === TOOL_MODE.Cursor) {
                Chart.nodesWrapper.selectAll('g').call(Chart.drag);
            }
        }

    }, [activeTool]);

    const [layoutRadio, setLayoutRadio] = React.useState('default');

    const chargeCyclic = () => {
        Chart.chargeCyclic();
    }

    const cancelChargeCyclic = () => {
        Chart.cancelChargeCyclic();
    }

    const clusteringCharge = () => {
        Chart.clusteringCharge();
    }

    const solidCollide = () => {
        Chart.solidCollide();
    }

    useEffect(() => {
        switch (layoutRadio) {
            case "circular":
                chargeCyclic();
                break;
            case "cluster":
                clusteringCharge();
                break;
            case "solid":
                solidCollide();
                break;
            default:
                cancelChargeCyclic();
                break;
        }
    }, [layoutRadio])

    return (
        <div className="toolbar">
            <div className={`tool ${activeTool === TOOL_MODE.Cursor ? 'active' : ''}`}
                 onClick={() => setActiveTool(TOOL_MODE.Cursor)}>
                <CursorSvg/>
            </div>
            <div className={`tool ${TOOL_MODE.CreateNode} ${activeTool === TOOL_MODE.CreateNode ? 'active' : ''}`}
                 style={activeTool === TOOL_MODE.CreateNode ? activeColor === NODE_COLOR.Rainbow ? activeColorBGStyle : activeColorStyle : null}
                 onClick={(ev) => {
                     setActiveTool(TOOL_MODE.CreateNode);
                     setColorOptions(!colorOptions);
                 }}>
                <PencilSvg/>
                <div className="select"/>
            </div>
            {colorOptions &&
                <Outside exclude={`.${TOOL_MODE.CreateNode}`} onClick={() => setColorOptions(!colorOptions)}>
                    <div className="options">
                        <table className="colors-table" cellPadding="0" cellSpacing="0" role="grid">
                            <tr role="row">
                                <td className={`${activeColor === NODE_COLOR.Yellow ? 'active-color' : ''}`}
                                    onClick={() => setActiveColor(NODE_COLOR.Yellow)}>
                                    <div className="color-style" style={{backgroundColor: NODE_COLOR.Yellow}}/>
                                </td>
                                <td className={`${activeColor === NODE_COLOR.Red ? 'active-color' : ''}`}
                                    onClick={() => setActiveColor(NODE_COLOR.Red)}>
                                    <div className="color-style" style={{backgroundColor: NODE_COLOR.Red}}/>
                                </td>
                                <td className={`${activeColor === NODE_COLOR.Blue ? 'active-color' : ''}`}
                                    onClick={() => setActiveColor(NODE_COLOR.Blue)}>
                                    <div className="color-style" style={{backgroundColor: NODE_COLOR.Blue}}/>
                                </td>
                            </tr>
                            <tr role="row">
                                <td className={`${activeColor === NODE_COLOR.Purple ? 'active-color' : ''}`}
                                    onClick={() => setActiveColor(NODE_COLOR.Purple)}>
                                    <div className="color-style" style={{backgroundColor: NODE_COLOR.Purple}}/>
                                </td>
                                <td className={`${activeColor === NODE_COLOR.Teal ? 'active-color' : ''}`}
                                    onClick={() => setActiveColor(NODE_COLOR.Teal)}>
                                    <div className="color-style" style={{backgroundColor: NODE_COLOR.Teal}}/>
                                </td>
                                <td className={`${activeColor === NODE_COLOR.Rainbow ? 'active-color' : ''}`}
                                    onClick={() => setActiveColor(NODE_COLOR.Rainbow)}>
                                    <div className="color-style" style={{background: NODE_COLOR.Rainbow}}/>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Outside>}
            <div className={`tool ${activeTool === TOOL_MODE.CreateLink ? 'active active-link' : ''}`}
                 onClick={() => setActiveTool(TOOL_MODE.CreateLink)}>
                <LinkSvg/>
            </div>
            <div className={`tool ${TOOL_MODE.EditNode} ${activeTool === TOOL_MODE.EditNode ? 'active' : ''}`}
                 onClick={() => {
                     setActiveTool(TOOL_MODE.EditNode)
                     setLayoutOptions(!layoutOptions)
                 }}>
                <LayoutSvg/>
            </div>
            {layoutOptions &&
                <Outside exclude={`.${TOOL_MODE.EditNode}`} onClick={() => setLayoutOptions(!layoutOptions)}>
                    <div className="options options-layout">
                        <div className="container">
                            <div className="radio-tile-group">
                                <div className="input-container">
                                    <input id="circular" checked={layoutRadio === 'circular'} onChange={() => setLayoutRadio('circular')} className="radio-button" type="radio" name="radio"/>
                                    <div className="radio-tile">
                                        <div className="icon walk-icon">
                                            <CircularSvg />
                                        </div>
                                        <label htmlFor="circular" className="radio-tile-label">Circular Layout</label>
                                    </div>
                                </div>

                                <div className="input-container">
                                    <input id="charge" checked={layoutRadio === 'default'} onChange={() => setLayoutRadio('default')} className="radio-button" type="radio" name="radio"/>
                                    <div className="radio-tile">
                                        <div className="icon bike-icon">
                                            <DefaultChargeSvg />
                                        </div>
                                        <label htmlFor="charge" className="radio-tile-label">Default charge</label>
                                    </div>
                                </div>

                                <div className="input-container">
                                    <input id="cluster" checked={layoutRadio === 'cluster'} onChange={() => setLayoutRadio('cluster')} className="radio-button" type="radio" name="radio"/>
                                    <div className="radio-tile">
                                        <div className="icon car-icon">
                                            <ClusteringSvg />
                                        </div>
                                        <label htmlFor="cluster" className="radio-tile-label">Clustering</label>
                                    </div>
                                </div>

                                <div className="input-container">
                                    <input id="solid" checked={layoutRadio === 'solid'} onChange={() => setLayoutRadio('solid')} className="radio-button" type="radio" name="radio"/>
                                    <div className="radio-tile">
                                        <div className="icon fly-icon">
                                            <SolidSvg />
                                        </div>
                                        <label htmlFor="solid" className="radio-tile-label">Solid Collide</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Outside>}
            {/*<div className={`tool ${activeTool === TOOL_MODE.EditLink ? 'active' : ''}`}*/}
            {/*     onClick={() => setActiveTool(TOOL_MODE.EditLink)}>*/}
            {/*    <CursorSvg/>*/}
            {/*</div>*/}
            {/*<div className={`tool ${activeTool === TOOL_MODE.Reset ? 'active' : ''}`}*/}
            {/*     onClick={() => setActiveTool(TOOL_MODE.Reset)}>*/}
            {/*    <CursorSvg/>*/}
            {/*</div>*/}
        </div>
    )
}

export default Toolbar;
