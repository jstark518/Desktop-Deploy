import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import {createBrowserRouter, RouterProvider, HashRouter, Routes, Route, redirect} from 'react-router-dom';
import MainContainer from '../routes/MainContainer';
import LoginPage from '../routes/LoginPage';


//let parsedData = JSON.parse(exampleData);

let isLoggedIn = false;
console.log(window);

const root = createRoot(document.getElementById('main'));
root.render(
<HashRouter >
    <Routes>
        <Route path="/" element={isLoggedIn ? <MainContainer /> : <LoginPage />} />
    </Routes>
</HashRouter>
);


