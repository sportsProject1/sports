import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {postTokenData} from "../../Server/ApiService";
import {fetchData} from "../../Server/ApiServiceNoToken";

const StyledContainer = styled.div`
    .toastui-editor-contents {
        font-family: 'Noto Sans', sans-serif;
        line-height: 1.8;
    }

    .toastui-editor-toolbar {
        border-radius: 5px;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
    }

    .toastui-editor {
        border-radius: 8px;
        border: 1px solid #ccc;
    }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  outline: none;
  font-family: 'Noto Sans', sans-serif;

  &:focus {
    border-color: #333;
    box-shadow: 0 0 5px rgba(51, 51, 51, 0.3);
  }
`;

const PreviewContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;

  h1 {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .preview-content {
    white-space: pre-wrap;
    font-family: 'Noto Sans', sans-serif;
    line-height: 1.8;
  }
`;

function CreateForm({ onUploadImage }) {
    const editorRef = useRef();
    const [title, setTitle] = useState('');
    const [categoryId,setCategoryId] = useState('');

    const [category,setCategory] = useState();

    useEffect(() => {
        // 제목을 미리보기 영역에 추가하는 로직

        fetchData("/category/get").then((res)=>{
            setCategory(res.data)
        })

        const previewElement = document.querySelector('.toastui-editor-md-preview');
        if (previewElement) {
            const titleElement = document.createElement('h1');
            titleElement.textContent = title || '제목 미리보기';
            titleElement.style.marginBottom = '10px';
            titleElement.style.fontSize = '2rem';

            // 기존에 제목이 있다면 제거 후 다시 추가
            const existingTitle = previewElement.querySelector('h1');
            if (existingTitle) {
                previewElement.removeChild(existingTitle);
            }
            previewElement.insertBefore(titleElement, previewElement.firstChild);
        }
    }, [title]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼의 기본 동작 방지

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('categoryId',categoryId)

            const htmlContent = editorRef.current.getInstance().getHTML();
            formData.append('content', htmlContent);

            // POST 요청 전송
            const response = await postTokenData('/board/add', formData);
            if (response.success) {
                alert('게시물이 성공적으로 등록되었습니다.');
                // 필요 시 페이지 이동 또는 폼 초기화
            } else {
                alert('게시물 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('게시물 전송 중 오류 발생:', error);
            alert('게시물 전송에 실패했습니다.');
        }
    };

    const toolbarItems = [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'link'],
        ['image', 'code', 'codeblock'],
        ['scrollSync'],
    ];

    return (
        <StyledContainer>
            <form onSubmit={handleSubmit}>
                <StyledInput
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    id="title-input"
                />
                <select onChange={(e) => setCategoryId(e.target.value)}>
                    {category?.map((item) => {
                        return (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>
                <Editor
                    ref={editorRef}
                    initialValue="여기에 내용을 작성하세요."
                    previewStyle="vertical"
                    height="600px"
                    initialEditType="markdown"
                    useCommandShortcut={true}
                    toolbarItems={toolbarItems}
                    hooks={{
                        addImageBlobHook: async (blob, callback) => {
                            try {
                                // 서버에 이미지 업로드 후 경로 반환
                                const formData = new FormData();
                                formData.append('file', blob);
                                console.log(blob);

                                // postTokenData 함수가 response.data를 반환
                                const fullPath = await postTokenData('/board/fileAdd', formData);
                                console.log(fullPath);

                                // 미리보기에서는 전체 URL 사용
                                callback(fullPath, '이미지 설명');
                            } catch (error) {
                                console.error('이미지 업로드 중 오류 발생:', error);
                                alert('이미지 업로드에 실패했습니다.');
                            }
                        },
                    }}
                />

                <button type="submit">게시물 등록</button>
            </form>
        </StyledContainer>
    );
}

export default CreateForm;
