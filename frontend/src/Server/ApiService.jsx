

// GET 요청에 대한 Axios

// import axios from "axios";
// import useAuthToken from "../hooks/useAuthToken";
//
// export const fetchTokenData = async (url, setState) =>{
//     try {
//         const response = await axios.get(`http://localhost:8090/${url}`, {
//             headers:{
//                 Authorization: `Bearer ${useAuthToken}`
//             }
//         });
//         console.log("토큰값으로 데이터 불러오기 성공했음");
//         setState(response.data);
//     }catch (error) {
//         console.log("토큰값으로 데이터 불러오기 실패했음",error);
//     }
// }
//
// export const postTokenData = async (url,formData) => {
//     try {
//         const response = await axios.post(`http://localhost:8090/${url}`, formData,{
//             headers: {
//                 "Content-Type": "multipart/form-data",
//                 Authorization:`Bearer ${useAuthToken}`
//             }
//         });
//         console.log("토큰값으로 데이터 보내기 성공했음");
//         return response.data
//     }catch (err){
//         console.log("토큰값으로 데이터 보내기 실패햇음",err);
//     }
// }


// 혹시 위에거 안되면 위에 다 주석처리하고 아래걸로 해보세요
// 아래는 인자로 token값 받아와서 사용하는 방식으로 만들어뒀어요

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