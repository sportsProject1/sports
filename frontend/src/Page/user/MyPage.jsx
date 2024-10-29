import {useSelector} from "react-redux";
import UserUpdateForm from "./userComponents/UserUpdateForm";

function MyPage(){
    const user = useSelector((state) => state.auth.user);
    if(user){
        return (
            <div>
                <button onClick={()=>console.log(user)}></button>
                <h1>마이페이지</h1>

                <UserUpdateForm user={user}/>
                
                <button onClick={() => console.log(user)}>
                    수정하기
                </button>
            </div>
        )
    } else {
        return (
            <div>로그인이 안되어있는데</div>
        )
    }
}

export default MyPage;