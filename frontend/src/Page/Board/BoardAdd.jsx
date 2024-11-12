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

            values.file.forEach((file) => {
                formData.append("file", file); // 각 파일을 개별적으로 추가
<<<<<<< HEAD

=======
>>>>>>> 72567cfb53e9412a3aa01e74e8497f4461d337b7
            });
        }

        try {
            await postTokenData("/board/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
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
