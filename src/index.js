import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import App from './graph/App1';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);

reportWebVitals();
