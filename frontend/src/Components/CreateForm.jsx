import {Formik} from "formik";
import * as Yup from 'yup';
import useImageUploader from "../hooks/useImageUploader";
import {
    CreateInput,
    CreateLabel, CreatePreviewImage,
    CreateSelect,
    CreateSubmitButton,
    CreateTextarea,
    FormGroup,
    StyledForm
} from "../styled/Form";

function CreateForm({initialValues,onSubmit,submitButtonText}) {
    const {images,handleImageChange,resetImages} = useImageUploader(true);
    console.log(images)
    return(
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
                    const allFiles = values.file ? [...values.file, ...files] : files; // 이전 값과 새 파일을 합침
                    setFieldValue("file", allFiles); // 파일 배열로 설정
                    handleImageChange(event); // 이미지 미리보기 로직 실행
                };
                const handleCategoryChange = (event) => {
                    const selectedCategory = event.target.value;
                    handleChange(event); // 기본 onChange 처리

                    // 카테고리 선택 시 제목 맨 앞에 말머리 추가
                    if (selectedCategory) {
                        const categoryLabelMap = {
                            "1": "축구",
                            "2": "농구",
                            "3": "배구",
                            "4": "클라이밍"
                        };
                        const label = categoryLabelMap[selectedCategory];
                        if (label) {
                            const currentTitle = values.title || '';
                            // 이미 말머리가 포함되어 있지 않을 때만 추가
                            const updatedTitle = currentTitle.startsWith(`[${label}]`)
                                ? currentTitle
                                : `[${label}] ${currentTitle.replace(/^\[.*?\]\s*/, '')}`;
                            setFieldValue("title", updatedTitle);
                        }
                    }
                };
                return (
                    <StyledForm>
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

                        {/* 이미지 업로드 */}
                        <FormGroup>
                            <CreateLabel htmlFor="image">이미지 업로드:</CreateLabel>
                            {images.length > 0 && images.map((image, index) => (
                                <CreatePreviewImage
                                    key={index}
                                    src={image.preview}
                                    alt={`업로드된 이미지 ${index + 1}`}
                                />
                            ))}

                            <input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                multiple // 여러 이미지 업로드 허용 (필요 시 추가)
                            />
                        </FormGroup>

                        <CreateSubmitButton type="submit" disabled={isSubmitting}>
                            {submitButtonText || '제출'}
                        </CreateSubmitButton>
                    </StyledForm>
                );
            }}
        </Formik>
    )
}
export default CreateForm