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

function App() {

    const [themeState, setThemeState] = useState("light");
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (token && user) { // token과 user가 존재할 때만 디스패치
            dispatch(setCredentials({ user, token }));
        }

        const clearStorageAfter24Hours = () => {
            const loginTime = localStorage.getItem("loginTime");

            if (!loginTime) return; // 로그인 시간이 없으면 함수 종료

            const currentTime = new Date().getTime();
            const timeElapsed = currentTime - parseInt(loginTime, 10);

            if (timeElapsed > 24 * 60 * 60 * 1000) {
                localStorage.clear(); // 로컬 스토리지 초기화
                alert("24시간이 지나 자동으로 로그아웃되었습니다.");
                // 리다이렉트 로직을 추가할 수 있습니다.
            }
        };

        clearStorageAfter24Hours();
        const interval = setInterval(clearStorageAfter24Hours, 60 * 60 * 1000);

        return () => clearInterval(interval);

    }, [dispatch]);

  return (


        <ThemeProvider theme={themeState === 'light' ? lightTheme : darkTheme}>
            <GlobalStyle/>
          <RouterProvider router={Routes}/>
        </ThemeProvider>

  );
}

export default App;
