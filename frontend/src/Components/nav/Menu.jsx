import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../Store/authSlice";
import styled from "styled-components";
import {postTokenData, postTokenJsonData} from "../../Server/ApiService";
import { FaUserPlus, FaSignInAlt, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { FaPersonChalkboard, FaUserGear } from "react-icons/fa6";

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
            color: ${({ theme }) => theme.colors.primary};
        }
    }
`;

const MenuRight = styled.ul`
    display: flex;
    align-items: center;
    gap: 40px;
    margin-right: 1%;
    li {
        list-style: none;
        cursor: pointer;

        a, svg {
            text-decoration: none;
            font-size: 1rem;
        }

        &:hover {
            color: ${({ theme }) => theme.colors.primary};
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

    const handleCartClick = () => {
        if (!user) {
            navigate("/login"); // 로그인 페이지로 리다이렉트
        } else {
            navigate("/shop/cart"); // 장바구니로 이동
        }
    };
    return(
        <MenuContainer>
           {/* 왼쪽 메뉴 */}
           <MenuLeft>
               <li>
                   <Link to={"/board"}>운동</Link>
               </li>
               <li>
                  <Link to={"/board/recruit"}>모집</Link>
              </li>
               <li><Link to={"/chat"}>채팅</Link></li>
               <li>
                  <Link to={"/shop"}>상점</Link>
              </li>
               {user?.role === "ROLE_ADMIN" && (
                   <li>
                       <Link to={"/admin"}>관리자 <FaPersonChalkboard /></Link>
                   </li>
               )}
           </MenuLeft>

           {/* 오른쪽 메뉴 */}
           <MenuRight>
               {!user ? (
                   <>
                       <li>
                           <Link to={"/register"}>
                               회원가입<FaUserPlus />
                           </Link>
                       </li>
                       <li>
                           <Link to={"/login"}>
                               로그인<FaSignInAlt />
                           </Link>
                       </li>
                   </>
               ) : (
                   <>
                       <li onClick={handleLogout} >
                           로그아웃<FaSignOutAlt/>
                       </li>
                       <li>
                           <Link to={"/mypage"}>
                               마이페이지<FaUserGear />
                           </Link>
                       </li>
                   </>
               )}
               <li onClick={handleCartClick}>
                   장바구니<FaShoppingCart />
               </li>
           </MenuRight>
       </MenuContainer>
   );
}

export default Menu;