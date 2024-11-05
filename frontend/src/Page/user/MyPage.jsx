import UserUpdateForm from "./userComponents/Mypage/UserUpdateForm";
import {useEffect, useState} from "react";
import {fetchTokenData} from "../../Server/ApiService";
import {Title} from "../../styled/Common";
import UserInfo from "./userComponents/Mypage/UserInfo";
import getData from "lodash-es/_getData";

function MyPage(){

    const [userData,setUserData] = useState([]);

    const [userUpdate,setUserUpdate] = useState(false);

    const onUpdate = () =>{
        setUserUpdate(!userUpdate);
    }

    useEffect(() => {
        const getData = async () =>{
            const data = await fetchTokenData("/user/mypage")
            setUserData(data.data)
        }
        getData();
    }, [userUpdate]);
    if(userData){
        return (
            <div>
                <Title>마이페이지</Title>
                {userUpdate === false ?
                    <UserInfo userData={userData} onUpdate={onUpdate}/> :
                    <UserUpdateForm userData={userData} onUpdate={onUpdate}/>
                }
            </div>
        )
    } else {
        return (
            <div>로그인이 안되어있는데</div>
        )
    }
}

export default MyPage;