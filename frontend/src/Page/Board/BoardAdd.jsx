import React from 'react';
import CreateForm from "../../Components/CreateForm";
import {postTokenData} from "../../Server/ApiService";

function BoardAdd() {
    const initialValues = {
        title: '',
        content: '',
        categoryId:'4',
        file: null
    };

    const handleSubmit = async (values) => {
        // 폼의 현재 값을 API 요청에 사용
        console.log('제출된 값:', values); // 확인용
        await postTokenData("/board/add", values);
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
