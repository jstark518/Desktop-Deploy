import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import MainContainer from './components/MainContainer';


//let parsedData = JSON.parse(exampleData);

console.log(window.repo);


const root = createRoot(document.getElementById('main'));
root.render(<MainContainer gitRepoAPIData={window.repo}/>);

