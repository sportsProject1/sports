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
        const user = JSON.parse(localStorage.getItem("user"));

        dispatch(setCredentials({user,token}));

    }, [dispatch]);

  return (


        <ThemeProvider theme={themeState === 'light' ? lightTheme : darkTheme}>
            <GlobalStyle/>
          <RouterProvider router={Routes}/>
        </ThemeProvider>

  );
}

export default App;
