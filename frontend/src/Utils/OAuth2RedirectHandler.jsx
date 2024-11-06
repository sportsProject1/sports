import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";

function OAuth2RedirectHandler(){
    const navigate = useNavigate();

    useEffect(() => {
        const getOAuth2Token = async() => {
            const Oauth2Token = await axios.get("http://localhost:8090/oauth2/token",{
                method: "POST",
                credentials: "include",
            }).then((res) =>{
                if(res.ok) {
                    // Authorization 헤더에서 토큰 가져옴
                    const token = res.headers.get("accessToken")
                    const refreshToken = res.headers.get("refreshToken")
                    console.log(token, refreshToken)
                    localStorage.setItem("token", token);
                    localStorage.setItem("refreshToken", refreshToken);
                    navigate("/",{replace:true});
                }}).catch(err =>{
                    console.log(err)
                    navigate("/login");
                });
        }
        getOAuth2Token();
    }, [navigate]);
    return <div>로딩중</div>
}
export default OAuth2RedirectHandler;