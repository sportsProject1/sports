import React, {useEffect, useState} from 'react';
import CreateForm from "../../Components/CreateForm/CreateForm";
import {fetchTokenData, postTokenData} from "../../Server/ApiService";
import {useNavigate, useParams} from "react-router-dom";

function BoardAdd() {
    const navigate = useNavigate();
    const [updateData,setUpdateData] = useState();

    const {id} = useParams();

    useEffect(() => {
        if(id){
            fetchTokenData(`/board/${id}`).then((res)=>{
                setUpdateData(res.data);
            })
        }

    }, []);

    return (
        <div>
            <CreateForm
                updateId={id}
                updateData={updateData}
                submitButtonText={"작성하기"}/>
        </div>
    );
}

export default BoardAdd;
