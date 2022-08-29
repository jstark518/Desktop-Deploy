import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import MainContainer from './components/MainContainer';
import './css/app.css'
import exampleData from './data'

//let parsedData = JSON.parse(exampleData);

const root = createRoot(document.getElementById('main'));
root.render(<MainContainer exampleData={exampleData}/>);