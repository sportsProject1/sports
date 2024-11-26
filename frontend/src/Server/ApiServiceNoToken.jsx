

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

export const registerFetchData = async (url,options = {}) =>{
    try {
        const response = await apiNoToken.get(url, {
            params: options.params, // params 처리
        });
        return response;
    } catch (error) {
        console.error('Error in fetchData:', error);
        throw error; // 에러를 호출한 곳에서 처리할 수 있도록 전달
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

export const postJsonData = async (url, formData) => {
    try {
        const response = await apiNoToken.post(url, formData);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};