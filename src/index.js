import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.scss';
import Graph from './components/graph';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <Graph />
    </Provider>
);

reportWebVitals();
