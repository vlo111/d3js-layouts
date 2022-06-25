import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App1';
import reportWebVitals from './reportWebVitals';
import * as d3 from "d3";

const root = ReactDOM.createRoot(document.getElementById('root'));

const nodes =
    [].concat(
        d3.range(10).map((i) => { return {id: `a${i}`, type: "a", reflexive: false}; }),
        d3.range(10).map((i) => { return {id: `b${i}`, type: "b", reflexive: false}; }),
        d3.range(10).map((i) => { return {id: `c${i}`, type: "c", reflexive: false }; }),
        d3.range(1).map((i) => { return { id: `d${i}`, type: "d", reflexive: true}; })
    );

const links = [
    { source: nodes[0], target: nodes[1], left: false, right: true },
    { source: nodes[1], target: nodes[2], left: false, right: true }
];

root.render(
  <React.StrictMode>
    <App nodes={nodes} links={links} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
