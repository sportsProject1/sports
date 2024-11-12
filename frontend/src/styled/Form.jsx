import styled from "styled-components";
import {Form} from "formik";


export const StyledForm = styled(Form)` // Formik의 Form을 styled-components로 래핑
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const CreateLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

export const CreateInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const CreateSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const CreateTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const CreateSubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
`;

export const CreatePreviewImage = styled.img`
    width:100px;
    height: 100px;
    border-radius: 15px;
`