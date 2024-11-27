import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { postTokenData, postTokenJsonData, putTokenData } from '../../Server/ApiService';
import { fetchData } from '../../Server/ApiServiceNoToken';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Map from '../Map/Map'; // 지도 컴포넌트 가져오기

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

const StyledSelect = styled.select`
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 10px;
    font-size: 16px;
    color: #333;
    width: 100%;
    max-width: 300px;
    cursor: pointer;
    margin-bottom: 10px;
    margin-right: 10px;
`;

const StyledLabel = styled.label`
    margin-right: 20px;
`;

const CheckboxInput = styled.input`
    margin-left: 10px;
    transform: scale(1.5);
    cursor: pointer;
`;

const Mapbutton = styled.button`
    padding: 5px;
    margin-left: 8px;

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

const SubmitButton = styled.button`
  width: 10%;
  height: 50px;
  margin: 10px 0 10px auto;
  display: block;
  border:none;
  border-radius:8px;
  color:white;
  background :#007BFF;
  cursor:pointer;
`;

function CreateForm({ updateData, updateId }) {
  const editorRef = useRef();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    chatRoom: false,
    latitude: null, // 기본값 null로 설정
    longitude: null, // 기본값 null로 설정
  });
  const [category, setCategory] = useState();
  const [showMap, setShowMap] = useState(false); // 지도 표시 여부 상태 추가
  const userRole = useSelector((state) => state.auth.user?.role);
  console.log(userRole)
console.log(updateData)
  useEffect(() => {
    if (updateData) {
      setFormData((prev) => ({
        ...prev,
        title: updateData.title,
        categoryId: updateData.categoryId || '',
        latitude: updateData.latitude || null, // 기존 위도 설정
        longitude: updateData.longitude || null, // 기존 경도 설정
      }));
      editorRef.current?.getInstance().setHTML(updateData.content);

      if (updateData.category) {
        const categoryIdFromCategoryName = category?.find(cat => cat.name === updateData.category)?.id;
        if (categoryIdFromCategoryName) {
           setFormData(prev => ({ ...prev, categoryId: categoryIdFromCategoryName }));
        }
      }
    }

    fetchData('/category/get').then((res) => {
      const filteredCategories = res.data.filter((item) => {
        if (item.tag === '운동') {
          return true; // 운동 태그는 모두 표시
        }
        if (item.tag === 'etc') {
          if (item.name === '공지사항') {
            return userRole === 'ROLE_ADMIN'; // 공지사항은 ROLE_ADMIN만 표시
          }
          return true; // 나머지 etc는 모두 표시
        }
        return false; // 그 외 태그는 제외
      });

      setCategory(filteredCategories);

      // 기본 카테고리 선택 (새 게시글 작성 시)
      if (filteredCategories.length > 0 && !updateData) {
        setFormData((prev) => ({ ...prev, categoryId: filteredCategories[0].id }));
      }
    });
  }, [updateData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // 이미 요청 중이라면 함수 종료

    // 제목과 본문 유효성 검사
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      setIsSubmitting(false); // 버튼 활성화
      return;
    }

    const content = editorRef.current.getInstance().getMarkdown(); // Markdown 형식으로 본문 가져오기
    if (!content.trim()) {
      alert('본문 내용을 입력해주세요.');
      setIsSubmitting(false); // 버튼 활성화
      return;
    }

    const userConfirmed = window.confirm(updateData ? '게시글을 수정하시겠습니까?' : '게시글을 등록하시겠습니까?');
    if (!userConfirmed) {
      setIsSubmitting(false); // 버튼 활성화
      return;
    }

    setIsSubmitting(true); // 요청 시작 시 플래그 설정

    const newFormData = new FormData();
    newFormData.append('title', formData.title);
    newFormData.append('categoryId', formData.categoryId);
    newFormData.append('content', editorRef.current.getInstance().getHTML()); // 실제 전송은 HTML 형식으로
    newFormData.append('chatroom', formData.chatRoom);

    if (formData.latitude !== null && formData.longitude !== null) {
      newFormData.append('latitude', formData.latitude);
      newFormData.append('longitude', formData.longitude);
    }

    try {
      if (updateData) {
        await putTokenData(`/board/${updateId}`, newFormData);
        alert('게시글이 성공적으로 수정되었습니다.');
      } else {
        const res = await postTokenData('/board/add', newFormData);
        if (formData.chatRoom) {
          await postTokenJsonData('/chat/create', {
            boardId: res,
            roomName: formData.title,
          });
        }
        alert('게시글이 성공적으로 등록되었습니다.');
      }
      navigate('/board', { replace: true });
    } catch (error) {
      console.error('게시물 전송 중 오류 발생:', error);
    } finally {
      setIsSubmitting(false); // 요청 완료 후 플래그 해제
    }
  };

  const handleMapChange = (latitude, longitude) => {
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const toggleMap = () => {
    setShowMap((prev) => !prev); // 지도 표시 여부 토글
    if (!formData.latitude && !formData.longitude) {
      // 지도 사용 버튼을 누르면 현재 위치를 가져옴
      getCurrentLocation();
    }
  };

  // 사용자의 현재 위치를 가져오는 함수
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        },
        (error) => {
          console.error('현재 위치를 가져오는 데 실패했습니다:', error);
          alert('현재 위치를 가져오는 데 실패했습니다. 수동으로 위치를 선택해주세요.');
        }
      );
    } else {
      alert('Geolocation이 지원되지 않는 브라우저입니다.');
    }
  };

  return (
    <StyledContainer>
      <form onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          placeholder="제목을 입력하세요"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <StyledSelect onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} value={formData.categoryId}>
          {category?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </StyledSelect>
        <StyledLabel>
          채팅방 만들기
          <CheckboxInput
            type="checkbox"
            checked={formData.chatRoom}
            onChange={() => setFormData((prev) => ({ ...prev, chatRoom: !prev.chatRoom }))}
          />
        </StyledLabel>

        {/* 지도 사용 버튼 */}
        <Mapbutton type="button" onClick={toggleMap}>
          {showMap ? '지도 숨기기' : '지도 사용하기'}
        </Mapbutton>

        {/* 지도 표시 조건 추가 */}
        {showMap && (
          <Map
            latitude={formData.latitude ?? 33.450701} // 기본 위도
            longitude={formData.longitude ?? 126.570667} // 기본 경도
            onChange={handleMapChange}
            isSearchEnabled={true} // 검색 기능 활성화
          />
        )}

        <Editor
          ref={editorRef}
          initialValue="내용을 입력하세요."
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut={true}
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
        <SubmitButton type="submit">게시물 등록</SubmitButton>
      </form>
    </StyledContainer>
  );
}

export default CreateForm;