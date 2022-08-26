import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import MainContainer from './components/MainContainer';

const root = ReactDOM.createRoot(document.getElementById('main'));
root.render(<MainContainer/>);