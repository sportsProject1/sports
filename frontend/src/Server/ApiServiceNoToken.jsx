

// GET 요청에 대한 Axios

import axios from "axios";
import {apiNoToken} from "./api";

export const fetchData = async (url, setState) =>{
    try{
        const response = await apiNoToken.get(url);
        return response
    }catch (error){
        console.log(error);
    }
}

export const postData = async (url,formData) => {
    try {
        const response = await apiNoToken.post(url, formData,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("토큰값 없이 데이터 보내기 성공")
        return response.data
    }catch (err){
        console.log("토큰값 없이 데이터 보내기 실패했음",err);
    }
}

export const postJsonData = async (url,formData) => {
    try{
        const response = await axios.post(`http://localhost:8090/${url}`, formData)
    }catch (error) {
        console.log(error)
    }
}