import Home from "./Page/Main/Home";
import Login from "./Page/user/Login";
import Layout from "./Page/Layout";
import { createBrowserRouter } from "react-router-dom";
import Register from "./Page/user/Register";
import React from "react";
import Board from "./Page/Board/Board";
import SportsChild from "./Page/Board/SportsChild";
import Shop from "./Page/shop/Shop";
import ShopAdd from "./Page/shop/ShopAdd";
import ShopDetail from "./Page/shop/ShopDetail";
import MyPage from "./Page/user/MyPage";
import ShopCart from "./Page/shop/ShopCart";
import OAuth2RedirectHandler from "./Utils/OAuth2RedirectHandler";

const Routes = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            { path: '/', element: <Home/> },
            { path: '/login', element: <Login/> },
            { path: '/register', element: <Register/> },
            { path: '/sports', element: <Board/>,
                children:[{
                    path: '/sports/:sport', element: <SportsChild/>
                }]
            },
            { path: '/shop', element: <Shop/> },
            { path: '/shop/detail/:id', element:<ShopDetail/>},
            { path: '/shop/update/:id', element:<ShopAdd/>},
            { path: '/shop/add', element: <ShopAdd/>},
            { path: '/shop/cart', element: <ShopCart/>},

            { path: '/mypage', element: <MyPage/>},

            { path: '/oauth2/redirect', element: <OAuth2RedirectHandler/>}
        ]
    }
]);

export default Routes;
