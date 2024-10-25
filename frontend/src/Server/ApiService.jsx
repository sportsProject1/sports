

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
    }catch (err){
        console.log(err);
    }
}