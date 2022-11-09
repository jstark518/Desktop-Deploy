import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import {createBrowserRouter, RouterProvider, HashRouter, Routes, Route, redirect} from 'react-router-dom';
import MainContainer from '../routes/MainContainer';
import MainEntrance from '../routes/MainEntrance';
import {AuthProvider, useAuth} from './components/CustomHooks/useAuth';

let isLoggedIn = false;

const root = createRoot(document.getElementById('main'));
root.render(
<HashRouter >
    <Routes>
        <Route 
            path="*" 
            element={<AuthProvider><MainEntrance/></AuthProvider>} 
        />
    </Routes>
</HashRouter>
);


