import Home from "./Page/Home";
import Login from "./Page/Login";
import Layout from "./Page/Layout";
import { createBrowserRouter } from "react-router-dom";
import Register from "./Page/Register";
import React from "react";
import Sports from "./Page/Sports";
import SportsChild from "./Page/SportsChild";

const Routes = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            { path: '/', element: <Home/> },
            { path: '/login', element: <Login/> },
            { path: '/register', element: <Register/> },
            { path: '/sports', element: <Sports/>,
                children:[{
                    path: '/sports/:sport', element: <SportsChild/>
                }]
            },
        ]
    }
]);

export default Routes;
