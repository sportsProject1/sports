import styled from "styled-components";

export const BoardContainer = styled.div`
    width: 100%;
    padding:40px;
    box-sizing: border-box;
    display: flex;
`

export const BoardWrap = styled.div`
    width: 100%;
    border: 1px solid #e0e0e0;
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    margin-left: 30px;
`