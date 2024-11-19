import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { postTokenData, postTokenJsonData, putTokenData } from '../../Server/ApiService';
import { fetchData } from '../../Server/ApiServiceNoToken';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StyledContainer = styled.div`
    width: 80%;
    margin: auto;
    margin-top: 30px;
    .toastui-editor-defaultUI .toastui-editor-mode-switch {
        display: none !important;
    }
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

function CreateForm({ updateData, updateId }) {
    const editorRef = useRef();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        categoryId: '',
        chatRoom: false,
    });
    const [category, setCategory] = useState();
    const userId = useSelector((state) => state.auth.user?.userId);

    useEffect(() => {
        if (updateData) {
            setFormData((prev) => ({
                ...prev,
                title: updateData.title,
                categoryId: updateData.categoryId || '',
            }));
            editorRef.current?.getInstance().setHTML(updateData.content);
        }

        fetchData('/category/get').then((res) => {
            const filteredCategories = res.data.filter((item) => item.tag === 'sports' || item.tag === 'etc');
            setCategory(filteredCategories);
            if (filteredCategories.length > 0 && !updateData) {
                setFormData((prev) => ({ ...prev, categoryId: filteredCategories[0].id }));
            }
        });
    }, [updateData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // 이미 요청 중이라면 함수 종료

        setIsSubmitting(true); // 요청 시작 시 플래그 설정

        const content = editorRef.current.getInstance().getHTML();
        const newFormData = new FormData();
        newFormData.append('title', formData.title);
        newFormData.append('categoryId', formData.categoryId);
        newFormData.append('content', content);
        newFormData.append('chatroom', formData.chatRoom);

        try {
            if (updateData) {
                await putTokenData(`/board/${updateId}`, newFormData);
            } else {
                const res = await postTokenData('/board/add', newFormData);
                if (formData.chatRoom) {
                    // chatroom이 true일 때만 chat/create 호출
                    console.log(formData.chatRoom)
                    await postTokenJsonData('/chat/create', {
                        boardId: res,
                        roomName: formData.title,
                    });
                }
            }
            navigate('/board', { replace: true });
        } catch (error) {
            console.error('게시물 전송 중 오류 발생:', error);
        }
    };

    const toolbarItems = [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['image'],
    ];

    return (
        <StyledContainer>
            <form onSubmit={handleSubmit}>
                <StyledInput
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    id="title-input"
                />
                <select onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} value={formData.categoryId}>
                    {category?.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <label>
                    채팅방 만들기
                    <input
                        type="checkbox"
                        checked={formData.chatRoom}
                        onChange={() => setFormData((prev) => ({ ...prev, chatRoom: !prev.chatRoom }))}
                    />
                </label>
                <Editor
                    ref={editorRef}
                    initialValue="내용을 입력하세요."
                    previewStyle="vertical"
                    height="600px"
                    initialEditType="markdown"
                    useCommandShortcut={true}
                    toolbarItems={toolbarItems}
                    hooks={{
                        addImageBlobHook: async (blob, callback) => {
                            try {
                                const imageFormData = new FormData();
                                imageFormData.append('file', blob);
                                const fullPath = await postTokenData('/board/fileAdd', imageFormData);
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

