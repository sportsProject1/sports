import './App.css';
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import 'reset-css';
import {RouterProvider} from "react-router-dom";
import Routes from "./Routes";
import {ThemeProvider} from "styled-components";
import {darkTheme, lightTheme} from "./styled/theme";
import GlobalStyle from "./styled/GlobalStyle";
import {setCredentials} from "./Store/authSlice";
import {jwtDecode} from "jwt-decode";

function App() {

    const [themeState, setThemeState] = useState("light");

    const dispatch = useDispatch();

    useEffect(() => {

        const token = localStorage.getItem("token"); // 로컬스토리지에 token 가져오기
        const user = token ? jwtDecode(token) : null; // 토큰이 있으면 토큰값 디코딩해서 변수 user에 담기
        if(token && user){
            dispatch(setCredentials({token,user})) // 토큰값 유저값 리덕스에 담기
            // app에서 리덕스 관리하는 이유는 모든페이지가 App으로 관리되기 때문
        }

    }, [dispatch]);

  return (


        <ThemeProvider theme={themeState === 'light' ? lightTheme : darkTheme}>
            <GlobalStyle/>
          <RouterProvider router={Routes}/>
        </ThemeProvider>

  );
}

export default App;
