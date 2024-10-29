//GET 요청에 대한 Axios

import axios from "axios";

export const fetchTokenData = async (url, setState,token) =>{
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
}