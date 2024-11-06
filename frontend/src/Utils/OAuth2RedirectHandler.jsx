import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OAuth2RedirectHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await axios.get("http://localhost:8090/api/oauth2/token", {
                    withCredentials: true,
                });

                const { accessToken, refreshToken } = response.data;

                if (accessToken && refreshToken) {
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);

                    navigate("/", { replace: true });
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("토큰 가져오기 실패:", error);
                navigate("/login");
            }
        };

        fetchTokens();
    }, [navigate]);

    return <div>로딩 중...</div>;
}

export default OAuth2RedirectHandler;
