import React from 'react';
import CreateForm from "../../Components/CreateForm";
import {postTokenData} from "../../Server/ApiService";

function BoardAdd() {
    const initialValues = {
        title: '',
        content: '',
        image: null
    };

    const handleSubmit = async() => {
        await postTokenData("/board/add", initialValues);
    };
    return (
        <div>
            <h1>글 생성</h1>
            <CreateForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitButtonText={"작성하기"}/>
        </div>
    );
}

export default BoardAdd;
