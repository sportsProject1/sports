import Home from "./Page/Main/Home";
import Login from "./Page/user/Login";
import Layout from "./Page/Layout";
import {createBrowserRouter} from "react-router-dom";
import Register from "./Page/user/Register";
import React from "react";
import Board from "./Page/Board/Board";
import Shop from "./Page/shop/Shop";
import ShopAdd from "./Page/shop/ShopAdd";
import ShopDetail from "./Page/shop/ShopDetail";
import MyPage from "./Page/user/MyPage";
import ShopCart from "./Page/shop/ShopCart";
import OAuth2RedirectHandler from "./Utils/OAuth2RedirectHandler";
import Payment from "./Page/shop/Payment";
import BoardAdd from "./Page/Board/BoardAdd";
import BoardDetail from "./Page/Board/BoardDetail";
import History from "./Page/shop/History";

import AdminPage from "./Page/user/userComponents/admin/AdminPage";
import UserList from "./Page/user/userComponents/admin/UserList";


const Routes = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            { path: '/', element: <Home/> },
            { path: '/login', element: <Login/> },
            { path: '/register', element: <Register/> },
            { path: '/board', element: <Board/>,},
            { path: '/board/:sport', element: <Board/>},
            { path: '/board/add', element: <BoardAdd /> },
            { path: '/board/detail/:id', element: <BoardDetail/> },
            { path: '/board/update/:id', element: <BoardAdd/>},

            { path: '/shop', element: <Shop/> },
            { path: '/shop/:shop', element: <Shop/>},
            { path: '/shop/detail/:id', element:<ShopDetail/>},
            { path: '/shop/update/:id', element:<ShopAdd/>},
            { path: '/shop/add', element: <ShopAdd/>},
            { path: '/shop/cart', element: <ShopCart/>},
            { path: '/shop/payment', element: <Payment/>},

            { path: '/mypage', element: <MyPage/>},
            { path: '/history', element: <History/>},

            // Admin 관련 라우트
            {
                path: "/admin/*",
                element: <AdminPage />, // AdminPage가 상위 컴포넌트
                children: [
                    { index: true, element: <UserList /> }, // /admin으로 접근 시 /admin/users로
                    { path: "users", element: <UserList /> }, // 사용자 관리
                    { path: "posts", element: <div>Post Management Coming Soon!</div> }, // 게시물 관리
                ],
            },

            { path: '/oauth2/redirect', element: <OAuth2RedirectHandler/>}
        ]
    }
]);

export default Routes;
