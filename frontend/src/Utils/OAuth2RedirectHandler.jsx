import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function OAuth2RedirectHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () =>{
            try{
                const res = await axios.get("http://localhost:8090/api/protected",{
                    withCredentials: true,
                });
                if(res.status === 200 ){
                    console.log("로그인 성공")
                    navigate("/",{replace:true});
                }else{
                    console.error("인증실패")
                    navigate("/login")
                }
            }catch (error){
                console.log(error,"에러뜸")
                navigate("/login");
            }
        }
        checkToken();
    }, [navigate]);

    return <div>로딩중</div>;
}

export default OAuth2RedirectHandler;
