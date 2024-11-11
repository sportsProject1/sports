import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';

// Styled components
const FormContainer = styled.div`
  margin: 20px;
`;

const InputField = styled(Field)`
  display: block;
  margin: 10px 0;
  padding: 8px;
  width: 100%;
  font-size: 16px;
`;

const TextAreaField = styled(Field)`
  display: block;
  margin: 10px 0;
  padding: 8px;
  width: 100%;
  height: 150px;
  font-size: 16px;
  white-space: pre-wrap; /* 줄바꿈 인식 */
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

// Validation schema
const validationSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, '제목은 최소 3글자 이상이어야 합니다.')
        .required('제목을 입력하세요.'),
    content: Yup.string()
        .min(10, '본문은 최소 10글자 이상이어야 합니다.')
        .required('본문을 입력하세요.'),
});

const CreateForm = ({ initialValues, onSubmit, submitButtonText}) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ setFieldValue }) => (
                <FormContainer>
                    <Form>
                        {/* Title field */}
                        <label htmlFor="title">제목</label>
                        <InputField type="text" name="title" placeholder="제목을 입력하세요" />
                        <ErrorMessage name="title" component="div" style={{ color: 'red' }} />

                        {/* Content field */}
                        <label htmlFor="content">본문</label>
                        <TextAreaField
                            as="textarea"
                            name="content"
                            placeholder="본문을 입력하세요"
                        />
                        <ErrorMessage name="content" component="div" style={{ color: 'red' }} />

                        {/* Image field */}
                        <label htmlFor="image">이미지</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={(event) => {
                                setFieldValue('image', event.currentTarget.files[0]);
                            }}
                        />
                        <ErrorMessage name="image" component="div" style={{ color: 'red' }} />

                        {/* Submit button */}
                        <SubmitButton type="submit">{submitButtonText}</SubmitButton>
                    </Form>
                </FormContainer>
            )}
        </Formik>
    );
};

export default CreateForm;
