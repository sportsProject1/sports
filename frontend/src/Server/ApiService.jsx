//GET 요청에 대한 Axios

import axios from "axios";

export const fetchTokenData = async (url, setState,token) =>{

    if(token == null){

        const refreshAccessToken = localStorage.getItem("refreshToken");
        const response = await axios.post("http://localhost:8090/refresh",{refreshAccessToken});
        const {accessToken} = response.data;
        localStorage.setItem("token", accessToken);
    }


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
    }
}

export const postTokenData = async (url,formData,token) => {
    if(token){
        try {
            const response = await axios.post(`http://localhost:8090/${url}`, formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization:`Bearer ${token}`
                }
            });
            console.log("토큰값으로 데이터 보내기 성공했음");
            return response.data
        }catch (err){
            console.log("토큰값으로 데이터 보내기 실패햇음",err);
        }
    }else{


        const refreshToken = localStorage.getItem("refreshToken");
        console.log(refreshToken);
        if(!refreshToken){
            return console.log("리프레시토큰도없음")
        }
        const response = await axios.post("http://localhost:8090/refresh",{refreshToken: refreshToken});
        console.log(response)
        const {accessToken} = response.data;
        localStorage.setItem("token", accessToken);

        try {
            const response = await axios.post(`http://localhost:8090/${url}`, formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization:`Bearer ${accessToken}`
                }
            });
            console.log("토큰값으로 데이터 보내기 성공했음");
            return response.data
        }catch (err){
            console.log("토큰값으로 데이터 보내기 실패햇음",err);
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