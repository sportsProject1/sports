import { FooterContainer,
         FooterContent,
         FooterSection,
         FooterSectionTitle,
         SocialIcons,
         Copyright,
         InquirySection,
         Section} from "../../styled/Common";
import styled from "styled-components";

const Footer = () => {
    return (
        <FooterContainer>
            <FooterContent>
                {/* 개인 소개 섹션 */}
                <Section>
                    <FooterSectionTitle>개인소개</FooterSectionTitle>
                    <p>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!소개가!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</p>
                    <p>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!들어갈!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</p>
                    <p>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!곳이다!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</p>
                </Section>
                {/* 회사 소개 섹션 */}
                 <FooterSection>
                    <FooterSectionTitle>Movo</FooterSectionTitle>
                    <p>주소: 부산광역시 부전동</p>
                    <p>대표: 정하영</p>
                    <p>기타 정보?</p>
                </FooterSection>
            </FooterContent>
            {/* 문의하기 섹션 */}
                <InquirySection>
                     <p>문의하기 e-mail: example@example.com tel: 123-456-7890 운영시간: 09:00 - 18:00</p>
                </InquirySection>
                <SocialIcons>
                    <a>GitHub</a>
                    <a>KakaoTalk</a>
                    <a>Instagram</a>
                </SocialIcons>
            {/* 저작권 정보 */}
            <Copyright>© Movo. All rights reserved.</Copyright>
        </FooterContainer>
    );
};

export default Footer;