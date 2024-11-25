import {Divider, FooterContainer} from "../../styled/Common";
import { MainContainer, SectionTitle} from "../../styled/main/MainPageStyled";
import MainBanner from "./MainBanner";
import MainBestBoard from "./MainBestBoard";
import MainBestItem from "./MainBestItem";
import UserInfoBox from "../../Components/UserInfoBox";
import Advertisement from "./Advertisement";
function Home() {

    return (
        <MainContainer>
            <MainBanner/>
            <Advertisement/>
            <UserInfoBox/>

{/*         <SectionTitle>최신 게시글</SectionTitle> */}
            <MainBestBoard/>
            <Divider/>

{/*         <SectionTitle>최신 게시글</SectionTitle> */}
            <MainBestItem/>

        </MainContainer>
    )
}

export default Home;