import { FooterContainer,
         FooterContent,
         FooterSection,
         FooterSectionTitle,
         SocialIcons,
         Copyright,
         InquirySection,
         Section} from "../../styled/Common";
import styled from "styled-components";
import kakaoIcon from '../../assets/kakao.png';
import githubIcon from '../../assets/github.png';
import instagramIcon from '../../assets/instagram.png';

const Footer = () => {
    return (
        <FooterContainer>
            <FooterContent>
                {/* 개인 소개 섹션 */}
                <Section>
                    <FooterSectionTitle>개인소개</FooterSectionTitle>
                    <p>정하영: Movo 커뮤니티의 매니저로, 다양한 운동을 좋아하는 사람들을 연결하고, 활발한 소통의 장을 만들기 위해 노력하고 있습니다.</p>
                    <p>배해기: 프론트엔드 개발자로, 사용자들이 편리하게 커뮤니티를 이용할 수 있도록 직관적인 UI와 모바일 친화적 디자인을 담당하고 있습니다.</p>
                    <p>위영준: 백엔드 개발자로, 커뮤니티의 안정성과 데이터 관리에 중점을 두어 원활한 서비스 환경을 제공합니다.</p>
                </Section>
                {/* 회사 소개 섹션 */}
                 <FooterSection>
                     <FooterSectionTitle>Movo</FooterSectionTitle>
                     <p>부산광역시 부전동</p>
                     <p>Movo는 운동을 사랑하는 사람들을</p>
                     <p>위한 커뮤니티 플랫폼으로,</p>
                     <p>함께 운동할 사람들을 찾고 즐겁게</p>
                     <p>활동할 수 있는 공간을 제공합니다.</p>
                 </FooterSection>
            </FooterContent>
            {/* 문의하기 섹션 */}
                <InquirySection>
                     <p>문의하기 e-mail: example@example.com tel: 123-456-7890 운영시간: 09:00 - 18:00</p>
                </InquirySection>
                <SocialIcons>
                    <a href="https://www.kakao.com" target="_blank">
                        <img src={kakaoIcon} alt="KakaoTalk" />
                    </a>
                    <a href="https://www.instagram.com" target="_blank">
                        <img src={instagramIcon} alt="Instagram" />
                    </a>
                    <a href="https://github.com/sportsProject1/sports" target="_blank">
                        <img src={githubIcon} alt="GitHub" />
                    </a>
                </SocialIcons>
            {/* 저작권 정보 */}
            <Copyright>© Movo. All rights reserved.</Copyright>
        </FooterContainer>
    );
};

export default Footer;