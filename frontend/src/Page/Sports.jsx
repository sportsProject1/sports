import styled from "styled-components";
import {Link, Outlet} from "react-router-dom";

const SportsContainer = styled.div`
    text-align: center;
    >ul{
        display: flex;
        justify-content: center;
        > li{
            margin:15px;
            border: 1px solid black;
            padding: 5px;
        }
    }
    > div{
        width: 1000px;
        display: flex;
        flex-direction: column;
        margin: auto;
        >ul li{
            margin:10px 0;
            padding:5px;
        }
    }
`

function Sports(){
    return(
        <SportsContainer>
            <h1>
                축구
            </h1>

            <ul>
                <li>
                    <Link to={"/sports/soccer"}>
                        축구
                    </Link>
                </li>
                <li>
                    <Link to={"/sports/basketball"}>
                        농구
                    </Link>
                </li>
                <li>
                    <Link to={"/sports/pingpong"}>
                        탁구
                    </Link>
                </li>
                <li>
                    <Link to={"/sports/badminton"}>
                        배드민턴
                    </Link>
                </li>
                <li>
                    <Link to={"/sports/tennis"}>
                        테니스
                    </Link>
                </li>
                <li>
                    <Link to={"/sports/climbing"}>
                        클라이밍
                    </Link>
                </li>
            </ul>

            <Outlet/>

        </SportsContainer>
    )
}

export default Sports;