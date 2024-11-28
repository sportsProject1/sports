import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import {setCredentials} from "../Store/authSlice";

function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchTokensAndUserInfo = async () => {
            try {
                const response = await axios.get("https://sports-5ebw.onrender.com/oauth2/token", {
                    withCredentials: true,
                });

                const { accessToken, refreshToken, user } = response.data;

                if (accessToken && refreshToken && user) {
                    // 유저 정보와 토큰을 Redux 스토어와 로컬 스토리지에 저장
                    dispatch(setCredentials({ user, token: accessToken }));

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("loginTime", new Date().getTime());

                    navigate("/", { replace: true });
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("토큰 및 유저 정보 가져오기 실패:", error);
                navigate("/login");
            }
        };

        fetchTokensAndUserInfo();
    }, [navigate, dispatch]);

    return <div>로딩 중...</div>;
}

export default OAuth2RedirectHandler;