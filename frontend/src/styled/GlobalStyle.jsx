// GlobalStyle.js
import { createGlobalStyle } from 'styled-components';


const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Gothic+A1&display=swap');
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    
    body {
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
        font-family: "Gothic A1", sans-serif;
        font-weight: 400;
        font-style: normal;
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    a {
        color: black;
        text-decoration: none;
        &:hover {
            color: ${({ theme }) => theme.colors.secondary};
        }
    }

`;

export default GlobalStyle;
