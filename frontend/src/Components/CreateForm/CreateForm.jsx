import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {postTokenData, postTokenJsonData, putTokenData} from "../../Server/ApiService";
import { fetchData } from "../../Server/ApiServiceNoToken";
import {useNavigate} from "react-router-dom";

const StyledContainer = styled.div`
width: 80%;
    margin:auto;
    margin-top: 30px;
    .toastui-editor-defaultUI .toastui-editor-mode-switch {
        display: none !important; /* 강제적으로 숨기기 */
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

function CreateForm({ updateData,updateId }) {
    const editorRef = useRef();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [category, setCategory] = useState();
    const [chatRoom,setChatRoom] = useState(false)
    useEffect(() => {
        // updateData가 있으면 초기값 설정
        if (updateData) {
            setTitle(updateData.title);
            if (editorRef.current) {
                editorRef.current.getInstance().setHTML(updateData.content); // 에디터에 초기 content 설정
            }

            // category 데이터가 로드된 후에 categoryId 설정
            if (updateData.category && category) {
                const matchedCategory = category.find(item => item.name === updateData.category);
                if (matchedCategory) {
                    setCategoryId(matchedCategory.id); // 일치하는 카테고리 ID 설정
                }
            }
        }

        fetchData("/category/get").then((res) => {
            // 'sports'와 'etc' 태그가 있는 카테고리만 필터링
            const filteredCategories = res.data.filter(item =>
                item.tag === 'sports' || item.tag === 'etc'
            );
            setCategory(filteredCategories);

            // 카테고리 데이터가 있을 경우 첫 번째 항목을 기본 선택
            if (filteredCategories.length > 0 && !updateData) {
                setCategoryId(filteredCategories[0].id);
            }
        });


    }, [updateData]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼의 기본 동작 방지

        if (updateData) {
            try {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('categoryId', categoryId);

                const htmlContent = editorRef.current.getInstance().getHTML();
                formData.append('content', htmlContent);
                await putTokenData(`/board/${updateId}`, formData).then(() => {
                    navigate('/board', { replace: true })
                });

            } catch (err) {
                console.log(err);
            }

        } else {
            try {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('categoryId', categoryId);
                formData.append('chatroom', chatRoom);

                const htmlContent = editorRef.current.getInstance().getHTML();
                formData.append('content', htmlContent);

                // 게시글 생성 요청
                const res = await postTokenData('/board/add', formData);

                // 게시글 생성 후 채팅방 생성
                if (chatRoom) {
                    const chatRoomData = {
                        boardId: res,
                        roomName: title, // 방 이름을 게시글 제목으로 설정하거나 적절한 값을 설정
                        createdUser: 13 // 게시글 작성자를 기본적으로 참여자로 추가
                    };
                    await postTokenJsonData('/chat/create', chatRoomData);
                }

                // 게시글 목록 페이지로 이동
                navigate('/board', { replace: true });

            } catch (error) {
                console.error('게시물 전송 중 오류 발생:', error);
                alert('게시물 전송에 실패했습니다.');
            }
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    id="title-input"
                />
                <select
                    onChange={(e) => setCategoryId(e.target.value)} value={categoryId}>
                    {category?.map((item) => {
                        return (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>
                <label onChange={()=>setChatRoom(!chatRoom)} id={"chat_room"}>채팅방 만들기
                <input value={chatRoom} id={"chat_room"} type={"checkbox"}/>
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
