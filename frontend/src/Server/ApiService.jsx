

// GET 요청에 대한 Axios

import axios from "axios";

export const fetchData = async (url, setState) =>{

    try {
        const response = await axios.get(`http://localhost:8090/${url}`, {});
        setState(response.data);
    }catch (error) {
        console.log(error);
    }
}

export const postData = async (url,formData) => {
    try {
        const response = await axios.post(`http://localhost:8090/${url}`, formData,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log(response)
        return response.data
    }catch (err){
        console.log("요청실패",err);
    }
}