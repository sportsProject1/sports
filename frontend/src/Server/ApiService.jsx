import {api} from "./api";

export const fetchTokenData = async (url)=>{
    try{
        const response = await api.get(url)
        return response;
    }catch(error){
    }
}

export const postTokenData = async (url, formData) => {
    try {
        const response = await api.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;  // 응답 데이터를 반환
    } catch (error) {
        console.error('API 요청 실패:', error);
        throw error;  // 실패 시 예외를 throw
    }
};

export const deleteTokenData = async (url)=>{
    try{
        const response = await api.delete(url,{})
    }catch (error){
    }
}

export const putTokenData = async (url,formData)=>{
    try{
        const response = await api.put(url,formData,{
            headers:{
                "Content-Type": "multipart/form-data",
            }
        })
    }
    catch(error){
        console.log(error)
    }
}

export const putTokenJsonData = async (url,formData)=>{
    try{
        const response = await api.put(url,formData,{
            headers:{
                "Content-Type": "application/json",
            }
        })
    }
    catch(error){
    }
}

export const postTokenJsonData = async (url,formData)=>{
    try{
        const response = await api.post(url, formData,{
            headers:{
                "Content-Type": "application/json",
            }
        })
    }catch(error){
    }
}