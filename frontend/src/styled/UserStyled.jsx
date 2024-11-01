// styled/UserStyled.js
import styled from 'styled-components';

export const RegisterFormWrap = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
`;

export const ProfileImageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

export const ErrorText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 5px;
`;
