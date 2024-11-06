import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function OAuth2RedirectHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const getOAuth2Token = async () => {
            try {
                const res = await axios.get("http://localhost:8090/oauth2/token", {
                    withCredentials: true,
                });

                if (res.status === 200) {
                    // Authorization 헤더에서 토큰 가져오기
                    const token = res.headers["accessToken"];
                    const refreshToken = res.headers["refreshToken"];
                    console.log("Access Token:", token);
                    console.log("Refresh Token:", refreshToken);

                    localStorage.setItem("token", token);
                    localStorage.setItem("refreshToken", refreshToken);
                    navigate("/", { replace: true });
                } else {
                    navigate("/login");
                }
            } catch (err) {
                console.log(err);
                navigate("/login");
            }
        };

        getOAuth2Token();
    }, [navigate]);

    return <div>로딩중</div>;
}

export default OAuth2RedirectHandler;
