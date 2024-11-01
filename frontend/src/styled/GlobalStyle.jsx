// GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    
    body {
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
        font-family: 'Arial', sans-serif;
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    a {
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: none;
        &:hover {
            color: ${({ theme }) => theme.colors.secondary};
        }
    }
    
    button {
        cursor: pointer;
        border: none;
        padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
        border-radius: ${({ theme }) => theme.borderRadius};
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.surface};
        font-weight: bold;
        transition: ${({ theme }) => theme.transition};
        &:hover {
            background-color: ${({ theme }) => theme.colors.secondary};
            box-shadow: ${({ theme }) => theme.boxShadow};
        }
    }
`;

export default GlobalStyle;
