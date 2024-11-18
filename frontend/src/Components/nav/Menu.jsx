import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../Store/authSlice";
import styled from "styled-components";
import {postTokenData, postTokenJsonData} from "../../Server/ApiService";
import { FaUser, FaSignInAlt, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 0;
`;

const MenuLeft = styled.ul`
    display: flex;
    align-items: center;

    li {
        list-style: none;
        margin: 0 15px;
        padding: 5px 10px;
        cursor: pointer;

        &:hover {
            border-bottom: 1px solid #ccc;
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
        }
    }
`;

const MenuRight = styled.ul`
    display: flex;
    align-items: center;
    gap: 40px;
    li {
        list-style: none;
        cursor: pointer;

        a, svg {
            color: #333;
            text-decoration: none;
            font-size: 1.5rem;
        }

        &:hover {
            color: #3498db;
        }
    }
`;

function Menu (){

    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 로그아웃 요청 보내기
            await postTokenJsonData("/logout",null);

            // 로컬스토리지 초기화
            localStorage.clear();

            // Redux 스토어에서 사용자 정보 제거 (로그아웃 후 상태 관리)
            dispatch(logout());

            // 홈 페이지로 리디렉션
            navigate("/");
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
        }
    };
    return(
        <MenuContainer>
           {/* 왼쪽 메뉴 */}
           <MenuLeft>
               <li>
                   <Link to={"/board"}>운동</Link>
               </li>
               <li>자유</li>
               <li>모집</li>
               {user?.role === "ROLE_ADMIN" && (
                   <li>
                       <Link to={"/admin"}>어드민 페이지</Link>
                   </li>
               )}
           </MenuLeft>

           {/* 오른쪽 메뉴 */}
           <MenuRight>
               {!user ? (
                   <>
                       <li>
                           <Link to={"/register"}>
                               <FaUser /> {/* 회원가입 아이콘 */}
                           </Link>
                       </li>
                       <li>
                           <Link to={"/login"}>
                               <FaSignInAlt /> {/* 로그인 아이콘 */}
                           </Link>
                       </li>
                   </>
               ) : (
                   <>
                       <li>
                           <FaUserCircle onClick={handleLogout} /> {/* 로그아웃 아이콘 */}
                       </li>
                       <li>
                           <Link to={"/mypage"}>
                               <FaUser /> {/* 마이페이지 아이콘 */}
                           </Link>
                       </li>
                   </>
               )}
               <li>
                   <Link to={"/shop/cart"}>
                       <FaShoppingCart /> {/* 장바구니 아이콘 */}
                   </Link>
               </li>
           </MenuRight>
       </MenuContainer>
   );
}


export default Menu;