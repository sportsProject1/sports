import React from 'react';
import {CreateInput, CreateLabel, CreateSelect, CreateTextarea, FormGroup} from "../../styled/Form";

const CreateInputFields = ({ handleChange, handleBlur, handleCategoryChange, values }) => (
    <>
        {/* 제목 입력 */}
        <FormGroup>
            <CreateLabel htmlFor="title">제목:</CreateLabel>
            <CreateInput
                type="text"
                name="title"
                placeholder="제목을 입력하세요"
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </FormGroup>

        {/* 카테고리 선택 */}
        <FormGroup>
            <CreateLabel htmlFor="categoryId">카테고리:</CreateLabel>
            <CreateSelect
                name="categoryId"
                onChange={handleCategoryChange}
                onBlur={handleBlur}
            >
                <option value="4">클라이밍</option>
                <option value="1">축구</option>
                <option value="2">농구</option>
                <option value="3">배구</option>
            </CreateSelect>
        </FormGroup>

        {/* 본문 입력 */}
        <FormGroup>
            <CreateLabel htmlFor="content">본문:</CreateLabel>
            <CreateTextarea
                name="content"
                rows="5"
                placeholder="본문을 작성하세요"
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </FormGroup>
    </>
);

export default CreateInputFields;
