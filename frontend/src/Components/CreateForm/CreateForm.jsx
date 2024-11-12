import React from 'react';
import {Formik} from "formik";
import * as Yup from 'yup';
import CreateInputFields from "./CreateInputFields";
import CreateImageUploader from "./CreateImageUploader";
import useImageUploader from "../../hooks/useImageUploader";
import {CreateSubmitButton, StyledForm} from "../../styled/Form";

function CreateForm({ initialValues, onSubmit, submitButtonText }) {
    const { images, handleImageChange } = useImageUploader(true);
    console.log(images);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                title: Yup.string().min(3, '제목은 최소 3글자 이상').max(20, '제목은 최대 20글자')
                    .required('제목을 입력하세요.'),
                content: Yup.string().min(10, '본문은 최소 10글자 이상').required('본문을 입력해주세요.')
            })}
            onSubmit={onSubmit}
        >
            {({ values, setFieldValue, isSubmitting, handleChange, handleBlur }) => {
                console.log(values); // 폼의 현재 상태를 확인

                const handleFileChange = (event) => {
                    const files = Array.from(event.target.files);
                    const allFiles = values.file ? [...values.file, ...files] : files;
                    setFieldValue("file", allFiles);
                    handleImageChange(event);
                };

                const handleCategoryChange = (event) => {
                    handleChange(event);
                    const selectedCategory = event.target.value;
                    const categoryLabelMap = {
                        "1": "축구",
                        "2": "농구",
                        "3": "배구",
                        "4": "클라이밍"
                    };
                    const label = categoryLabelMap[selectedCategory];
                    if (label) {
                        const currentTitle = values.title || '';
                        const updatedTitle = currentTitle.startsWith(`[${label}]`)
                            ? currentTitle
                            : `[${label}] ${currentTitle.replace(/^\[.*?\]\s*/, '')}`;
                        setFieldValue("title", updatedTitle);
                    }
                };

                return (
                    <StyledForm>
                        <CreateInputFields
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            handleCategoryChange={handleCategoryChange}
                            values={values}
                        />
                        <CreateImageUploader images={images} handleFileChange={handleFileChange} />
                        <CreateSubmitButton type="submit" disabled={isSubmitting}>
                            {submitButtonText || '제출'}
                        </CreateSubmitButton>
                    </StyledForm>
                );
            }}
        </Formik>
    );
}

export default CreateForm;
