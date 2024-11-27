import styled from "styled-components";

export const FooterContainer = styled.footer`
    width: 100%;
    padding: 5px 0;
    margin: 100px 0 0 0;
    background-color: #2c2c2c;
    color: #ffffff;
`;

export const FooterContent = styled.div`
    display: flex;
    justify-content: space-around;
    gap:15rem;
    padding: 10px 0;
    max-width: 1200px;
    margin: 0 auto;
`;

export const Section = styled.div`
    flex: 2;
    text-align: left;
    font-size: 0.8rem;
    line-height: 2;
    color: #cccccc;
    white-space: nowrap;
`;

export const FooterSection = styled.div`
    flex: 1;
    text-align: center;
    font-size: 0.8rem;
    color: #cccccc;
    line-height: 1.5;
    white-space: nowrap;
`;

export const InquirySection = styled.div`
    display: inline;
    text-align: center;
`;

export const FooterSectionTitle = styled.h4`
    font-weight: bold;
    margin-bottom: 10px;
`;

export const SocialIcons = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 10px auto 5px auto;
    a {
        color: #ffffff;
        font-size: 1.2rem;
        transition: color 0.3s;
    }
    a:hover {
        color: #ff6347;
    }
    img {
        width: 25px;
        height: 25px;
        transition: transform 0.3s;
    }
    img:hover {
        transform: scale(1.1);
    }
`;

export const Copyright = styled.div`
    text-align: center;
    padding: 5px;
    font-size: 0.7rem;
    color: #777;
    padding-top: 10px;
    border-top: 1px solid #444;
`;