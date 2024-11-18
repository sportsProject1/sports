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
        fetchTokenData("/user/mypage").then((res)=>{
            setUserData(res.data)
        })

    }, [userUpdate]);
    if(userData){
        return (
            <div>
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