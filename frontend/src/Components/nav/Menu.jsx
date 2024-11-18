import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../Store/authSlice";
import styled from "styled-components";
import {postTokenData, postTokenJsonData} from "../../Server/ApiService";
import { FaUserPlus, FaSignInAlt, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    gap: 20px;
`;

const MenuLeft = styled.ul`
    display: flex;
    align-items: center;
    gap: 40px;
    margin-right: 40px;
    li {
        list-style: none;
        padding: 5px 10px;
        cursor: pointer;

        &:hover {
            color: ${({ theme }) => theme.colors.secondary};
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
                       <Link to={"/admin"}>관리자 홈</Link>
                   </li>
               )}
           </MenuLeft>

           {/* 오른쪽 메뉴 */}
           <MenuRight>
               {!user ? (
                   <>
                       <li>
                           <Link to={"/register"}>
                               <FaUserPlus /> {/* 회원가입 아이콘 */}
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
                           <FaSignOutAlt onClick={handleLogout} /> {/* 로그아웃 아이콘 */}
                       </li>
                       <li>
                           <Link to={"/mypage"}>
                               <FaUserGear /> {/* 마이페이지 아이콘 */}
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