import {api} from "./api";

export const fetchTokenData = async (url)=>{
    try{
        const response = api.get(url)
        console.log(response.data);
        console.log(response);
    }catch(error){
        console.log(error)
    }
}

export const postTokenData = async (url,formData)=>{
    try{
        const response = await api.post(url, formData,{
            headers:{
                "Content-Type": "multipart/form-data",
            }
        })
        console.log(response.data);
    }catch(error){
        console.log(error)
    }
}

export const deleteTokenData = async (url)=>{
    try{
        const response = await api.delete(url,{})
    }catch (error){
        console.log(error)
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
        console.log(error)
    }
}

export const postTokenJsonData = async (url,formData)=>{
    try{
        const response = await api.post(url, formData,{
            headers:{
                "Content-Type": "application/json",
            }
        })
        console.log(response.data);
    }catch(error){
        console.log(error)
    }
}