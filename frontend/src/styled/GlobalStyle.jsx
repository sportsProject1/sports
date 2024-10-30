import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        background-color: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.color};
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        box-sizing: border-box;
        height: 1000vh;
        a {
            text-decoration: none;
        }
    }
`;

export default GlobalStyle;
