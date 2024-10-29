import styled from "styled-components";
import useImageUploader from "../hooks/useImageUploader";
import {useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";

const PostContainer = styled.div`
    width: 1200px;
    height: 800px;
    margin: 0 auto;
    >form{
        width: 100%;
        >input,textarea{
            width: 100%;
            padding: 25px;
        }
        >textarea{
            min-height: 500px;
            max-height: 500px;
            resize: none;
        }
        >select{
            padding: 15px 30px;
        }
    }
    
    

`



function Home() {

    const {images,handleImageChange,handleRemoveImage} = useImageUploader(true)

    const userData = useSelector((state)=>state.auth.user) // 리덕스 툴킷에 저장한 유저정보 가져오기
    const token = useSelector((state)=> state.auth.token); // 리덕스 툴킷에 저자한 토큰값 가져오기

    const decoded = token ? jwtDecode(token) : null;

    return (
        <div>
            <button onClick={() => console.log(userData)}>리덕스 유저값 확인버튼</button>
            <button onClick={() => console.log(token)}>리덕스 토큰값 확인버튼</button>
            <button onClick={() => console.log(decoded)}>디코딩 확인버튼</button>
            <h1>메인</h1>
            <PostContainer>
                <form>
                    <select>
                        <option name={"soccer"} value={"soccer"}>축구</option>
                        <option name={"basketball"} value={"basketball"}>농구</option>
                        <option name={"pingpong"} value={"pingpong"}>탁구</option>
                    </select>
                    <input id={"title"} name={"title"}/>

                    <textarea/>
                    <div style={{display: 'flex', overflowX: 'auto'}}>
                        {images.map((image, index) => (
                            <div key={index} style={{position: 'relative', margin: '5px'}}>
                                <img src={image} alt={`preview ${index}`} style={{width: '100px', height: '100px'}}/>
                                <button
                                    type={"button"}
                                    onClick={() => handleRemoveImage(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange}/>
                    <input type={"submit"} id={"content"} name={"content"}/>
                </form>
            </PostContainer>
        </div>
    )
}

export default Home;