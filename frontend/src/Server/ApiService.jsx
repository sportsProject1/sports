

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