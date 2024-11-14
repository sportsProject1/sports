import React from 'react';
import styled from 'styled-components';
import logoImage from '../../assets/movologo.png';
import { Link } from 'react-router-dom';

// 로고를 감싸는 전체 컨테이너
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
  height: 100%;
  margin: auto;
`;

// 스타일링된 Link 컴포넌트
const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;

  img {
    border-radius: 60px;
    width: auto;
    height: 70%;
  }
`;
const Logo = () => {
  return (
    <LogoContainer>
        <StyledLink to="/">
            <img src={logoImage} alt="Logo" />
        </StyledLink>
    </LogoContainer>
  );
};

export default Logo;