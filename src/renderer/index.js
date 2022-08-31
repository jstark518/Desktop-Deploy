import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import SimpleRepoList from "./components/SimpleRepoList";

const root = createRoot(document.getElementById('main'));

root.render(<SimpleRepoList></SimpleRepoList>);
