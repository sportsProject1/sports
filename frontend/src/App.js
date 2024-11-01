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

        const clearStorageAfter24Hours = () => {
            const loginTime = localStorage.getItem("loginTime");

            // 로그인 시간이 저장되지 않았으면 return
            if (!loginTime) return;

            const currentTime = new Date().getTime();
            const timeElapsed = currentTime - parseInt(loginTime);

            // 24시간(밀리초로 24 * 60 * 60 * 1000)이 경과한 경우
            if (timeElapsed > 24 * 60 * 60 * 1000) {
                localStorage.clear(); // 로컬 스토리지 비우기
                alert("24시간이 지나 자동으로 로그아웃되었습니다.");
                // 필요시 추가 로직 (예: 로그인 페이지로 리다이렉트)
            }
        };

        // 페이지 로드 시 확인
        clearStorageAfter24Hours();

        // 매 시간마다 24시간 경과 여부 확인
        const interval = setInterval(clearStorageAfter24Hours, 60 * 60 * 1000);

        // 컴포넌트 언마운트 시 interval 해제
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
