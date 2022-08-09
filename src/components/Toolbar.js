import React, {useEffect, useState} from 'react';
import '../assets/styles/App.scss';
import {ReactComponent as CursorSvg} from '../assets/icons/cursor.svg';
import {ReactComponent as PencilSvg} from '../assets/icons/pencil.svg';
import {ReactComponent as LinkSvg} from '../assets/icons/arrow.svg';
import Outside from "./Outside";
import Chart from "./graph/Chart";
import {NODE_COLOR, TOOL_MODE} from "../data/node";

function Toolbar() {

    const [activeTool, setActiveTool] = useState('');

    const [colorOptions, setColorOptions] = useState(false);

    const [activeColor, setActiveColor] = useState(NODE_COLOR.Black);

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
                    <div className="color-options">
                        <table className="colors-table" cellPadding="0" cellSpacing="0" role="grid">
                            <tr role="row">
                                <td className={`${activeColor === NODE_COLOR.Black ? 'active-color' : ''}`}
                                    onClick={() => setActiveColor(NODE_COLOR.Black)}>
                                    <div className="color-style" style={{backgroundColor: NODE_COLOR.Black}}/>
                                </td>
                                <td className={`${activeColor === NODE_COLOR.Red ? 'active-color' : ''}`}
                                    onClick={() => setActiveColor(NODE_COLOR.Red)}>
                                    <div className="color-style" style={{backgroundColor: NODE_COLOR.Red}}/>
                                </td>
                                <td className={`${activeColor === NODE_COLOR.Cornflowerblue ? 'active-color' : ''}`}
                                    onClick={() => setActiveColor(NODE_COLOR.Cornflowerblue)}>
                                    <div className="color-style" style={{backgroundColor: NODE_COLOR.Cornflowerblue}}/>
                                </td>
                            </tr>
                            <tr role="row">
                                <td className={`${activeColor === NODE_COLOR.Blue ? 'active-color' : ''}`}
                                    onClick={() => setActiveColor(NODE_COLOR.Blue)}>
                                    <div className="color-style" style={{backgroundColor: NODE_COLOR.Blue}}/>
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
            <div className={`tool ${activeTool === TOOL_MODE.EditNode ? 'active' : ''}`}
                 onClick={() => setActiveTool(TOOL_MODE.EditNode)}>
                <CursorSvg/>
            </div>
            <div className={`tool ${activeTool === TOOL_MODE.EditLink ? 'active' : ''}`}
                 onClick={() => setActiveTool(TOOL_MODE.EditLink)}>
                <CursorSvg/>
            </div>
            <div className={`tool ${activeTool === TOOL_MODE.Reset ? 'active' : ''}`}
                 onClick={() => setActiveTool(TOOL_MODE.Reset)}>
                <CursorSvg/>
            </div>
        </div>
    )
}

export default Toolbar;
