

// GET 요청에 대한 Axios

import axios from "axios";

export const fetchData = async (url, setState) =>{

    try {
        const response = await axios.get(`http://localhost:8090/${url}`, {});
        setState(response.data);
        console.log("토큰값 없이 데이터 불러오기 성공")
    }catch (error) {
        console.log("토큰값없이 데이터 불러오기 실패함",error);
    }
}

export const postData = async (url,formData) => {
    try {
        const response = await axios.post(`http://localhost:8090/${url}`, formData,{
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