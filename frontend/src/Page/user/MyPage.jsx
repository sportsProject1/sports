import {useSelector} from "react-redux";
import UserUpdateForm from "./userComponents/UserUpdateForm";
import {MyPageContainer} from "../../styled/Container";
import {useEffect, useState} from "react";
import {fetchTokenData} from "../../Server/ApiService";

function MyPage(){

    const [userData,setUserData] = useState([]);

    useEffect(() => {
        fetchTokenData("/user/mypage",setUserData)

    }, []);
    if(userData){
        return (
            <MyPageContainer>
                <button onClick={()=>console.log(userData)}></button>
                <h1>마이페이지</h1>

                <UserUpdateForm userData={userData}/>

                <button onClick={() => console.log(userData)}>
                    수정하기
                </button>
            </MyPageContainer>
        )
    } else {
        return (
            <div>로그인이 안되어있는데</div>
        )
    }
}

export default MyPage;