import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // 기본 스타일
import axios from 'axios';
import styled from 'styled-components';
import { postTokenData } from "../../Server/ApiService";

const FormContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
`;

const EditorWrapper = styled.div`
    width: 48%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const PreviewWrapper = styled.div`
    width: 48%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
`;

const TitleInput = styled.input`
    padding: 8px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const CategoryInput = styled.input`
    padding: 8px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
`;

function CreateForm() {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [content, setContent] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const quillRef = useRef(null);

    // 이미지 업로드 핸들러
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await postTokenData('/board/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.url;  // 서버에서 반환된 이미지 URL
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            return null;
        }
    };

    // 이미지 삽입 핸들러 (Markdown 형식으로 삽입)
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const imageUrl = await handleImageUpload(file);
            if (imageUrl) {
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();

                // ![](image_url) 형식으로 Markdown 삽입
                const markdownImage = `![](${imageUrl})`;
                quill.insertText(range.index, markdownImage);

                // 이미지 URL을 실시간으로 상태에 추가
                setImageUrls((prevUrls) => [...prevUrls, imageUrl]);
            }
        };
    };

    // 퀼 에디터의 툴바 설정
    const modules = {
        toolbar: {
            container: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['bold', 'italic', 'underline'],
                ['link'],
                ['image'], // 이미지 업로드 버튼 추가
                ['blockquote', 'code-block'],
            ],
            handlers: {
                image: imageHandler, // 툴바의 이미지 버튼 클릭 시 imageHandler 실행
            }
        }
    };

    // 본문 내용 변경 시 실시간으로 HTML로 변환
    useEffect(() => {
        const quill = quillRef.current.getEditor();
        quill.on('text-change', () => {
            setContent(quill.root.innerHTML); // 퀼 에디터에서 HTML 형식으로 본문 내용 저장
        });
    }, []);

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();  // FormData 객체 생성
        const quill = quillRef.current.getEditor();
        const delta = quill.getContents();  // 본문 내용

        // 본문 내용과 제목, 카테고리 추가
        formData.append('title', title);
        formData.append('categoryId', categoryId);
        formData.append('content', JSON.stringify(delta));  // delta 형태로 본문 내용 추가

        // 이미지 URL 추출하여 formData에 추가
        const ops = delta.ops || [];
        const imgUrls = [];
        ops.forEach((op) => {
            if (op.insert && op.insert.image) {
                imgUrls.push(op.insert.image);
            }
        });

        // 이미지 URL을 하나씩 formData에 추가 (files 필드에)
        imgUrls.forEach((url, index) => {
            formData.append(`files[${index}]`, url);
        });

        try {
            // 게시글 작성 시 데이터를 formData로 서버로 전송
            const response = await postTokenData('/board/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // multipart/form-data 헤더 설정
                },
            });
            console.log('게시글 작성 성공:', response.data);
        } catch (error) {
            console.error('게시글 작성 실패:', error);
        }
    };


    // Markdown 형식의 이미지를 HTML로 변환하여 미리보기
    const renderContentWithMarkdownImages = (htmlContent) => {
        return htmlContent.replace(/!\[\]\((.*?)\)/g, (match, url) => {
            return `<img src="${url}" alt="image" />`;
        });
    };

    return (
        <FormContainer>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <h1>Create Post</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>

                    <label>Title:</label>
                    <TitleInput
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label>Category:</label>
                    <CategoryInput
                        type="text"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <EditorWrapper>
                            <ReactQuill
                                ref={quillRef}
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                formats={['bold', 'italic', 'underline', 'header', 'list', 'link', 'image']}
                                placeholder="Write your post here..."
                                theme="snow"
                            />
                        </EditorWrapper>

                        <PreviewWrapper>
                            <h3>Live Preview (Markdown Format)</h3>
                            {/* 본문 내용에서 Markdown 형식의 이미지를 HTML로 변환해서 미리보기 */}
                            <div dangerouslySetInnerHTML={{ __html: renderContentWithMarkdownImages(content) }} />
                        </PreviewWrapper>
                    </div>

                    <SubmitButton type="submit">
                        Submit
                    </SubmitButton>
                </form>
            </div>
        </FormContainer>
    );
}

export default CreateForm;
