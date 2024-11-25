import React from 'react';
import styled from 'styled-components';
import logoImage from '../../assets/logowhitebg.png';
import { Link } from 'react-router-dom';

// 로고를 감싸는 전체 컨테이너
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 스타일링된 Link 컴포넌트
const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;

  img {
    width: 150px;
    height: auto;
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