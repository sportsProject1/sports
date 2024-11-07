import { Divider} from "../../styled/Common";
import {Footer, MainContainer, SectionTitle} from "../../styled/main/MainPageStyled";
import MainBanner from "./MainBanner";
import MainBestBoard from "./MainBestBoard";
import MainBestItem from "./MainBestItem";
function Home() {
    return (
        <MainContainer>
            <MainBanner/>
            <Divider/>

            <SectionTitle>최신 게시글</SectionTitle>
            <MainBestBoard/>
            <Divider/>

            <SectionTitle>최신 게시글</SectionTitle>
            <MainBestItem/>

            <Footer/>

        </MainContainer>
    )
}

export default Home;