//GET 요청에 대한 Axios

import axios from "axios";

export const fetchTokenData = async (url, setState,token) =>{
    // if(token === null){
    //
    //     const refreshAccessToken = localStorage.getItem("refreshToken");
    //     const response = await axios.post("http://localhost:8090/refresh",{refreshAccessToken});
    //     const {accessToken} = response.data;
    //     localStorage.setItem("token", accessToken);
    // }
    try {
        const response = await axios.get(`http://localhost:8090/${url}`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
  console.log("토큰값으로 데이터 불러오기 성공했음");
        setState(response.data);
    }catch (error) {
        console.log("토큰값으로 데이터 불러오기 실패했음",error);
        if(error.response.status === 401){
            console.error("401에러 출력 조건문으로 받았음")
        }
    }
}

export const postTokenData = async (url,formData,token) => {
        try {
            console.log(token)
            const response = await axios.post(`http://localhost:8090/${url}`, formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization:`Bearer ${token}`
                }
            });
            console.log("토큰값으로 데이터 보내기 성공했음");
            return response.data
        }catch (err){
            console.log(token)
            console.log("토큰값으로 데이터 보내기 실패햇음",err);
            if(err.response.status === 401){ //에러 상태가 401일때
                const refreshToken = localStorage.getItem("refreshToken");
                try {
                    const refreshResponse = await axios.post(
                        `http://localhost:8090/refresh`,
                        { refreshToken }, // JSON 형식으로 전송
                        { headers: {
                                "Content-Type": "application/json" }
                        }
                    );
                    const newAccessToken = refreshResponse.data.accessToken;
                    console.log("새로운 액세스 토큰:", newAccessToken);
                    localStorage.setItem("token", newAccessToken);
                } catch (error) {
                    console.log("리프레시 실패", error);
                }
            }
        }
}

export const postTokenJsonData = async (url,formData,token) => {
    try {
        const response = await axios.post(`http://localhost:8090/${url}`, formData,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }catch (err){
        console.log(err)
    }
}