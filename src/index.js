import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PflowEditor from './components/PflowEditor';
import {defaultCollection, defaultModel} from "./examples";

const params = new URLSearchParams(window.location.search.slice(1));
ReactDOM.render(<PflowEditor collection={params.get('collection') || defaultCollection} selected={params.get('model') || defaultModel} />, document.getElementById('root'));
