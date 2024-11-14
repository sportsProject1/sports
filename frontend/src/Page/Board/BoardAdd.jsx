import React, {useEffect, useState} from 'react';
import CreateForm from "../../Components/CreateForm/CreateForm";
import {fetchTokenData, postTokenData} from "../../Server/ApiService";
import {useNavigate, useParams} from "react-router-dom";

function BoardAdd() {
    const [initialValues,setInitialValues] = useState({
        title: '',
        content: '',
        categoryId:'4',
        file: null
    });
    const navigate = useNavigate();

    const {id} = useParams();
    const [testData, setTestData] = useState({});
    const [imageArray,setImageArray] = useState();

    useEffect(() => {
        if(id){
            fetchTokenData(`/board/${id}`).then((res)=>{
                setTestData(res.data);
                const data = res.data;
                setImageArray(data.imgUrl ? data.imgUrl.split(',').map(img => img.trim()) : [])
                setInitialValues({
                    title: data.title,
                    content: data.content,
                    categoryId:data.id,
                    file:null
                })
            })
        }

    }, []);

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

            });
        }

        try {
            if(id){
                console.log(formData);
            }else{
                await postTokenData("/board/add", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            // navigate('/board')
        } catch (error) {
        }
    };
    return (
        <div>
            <button onClick={()=>console.log(imageArray)}>이미지테스트</button>
            <h1>글 생성</h1>
            <CreateForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                imageArray={imageArray}
                setImageArray={setImageArray}
                submitButtonText={"작성하기"}/>
        </div>
    );
}

export default BoardAdd;
