import React from 'react';
import CreateForm from "../../Components/CreateForm/CreateForm";
import {postTokenData} from "../../Server/ApiService";

function BoardAdd() {
    const initialValues = {
        title: '',
        content: '',
        categoryId:'4',
        file: null
    };

    const handleSubmit = async (values) => {
        console.log('제출된 값:', values); // 확인용

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("content", values.content);
        formData.append("categoryId", values.categoryId);

        // 여러 파일을 FormData에 추가
        if (values.file && values.file.length > 0) {
            values.file.forEach((file, index) => {
                formData.append(`file${index}`, file); // 각 파일을 개별적으로 추가
            });
        }

        try {
            await postTokenData("/board/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('데이터 전송 성공');
            console.log(formData)
        } catch (error) {
            console.error('데이터 전송 실패:', error);
        }
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
