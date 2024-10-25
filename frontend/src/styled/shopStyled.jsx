import styled from "styled-components";

export const ShopContainer = styled.div`
    width: 100%;
    
    >a{
        font-size: 24px;
        border: 1px solid black;
        border-radius: 5px;
        padding: 5px;
    }
`
export const ShopList = styled.div`
    width: 80%;
    display: flex;
    justify-content: center;
`
export const ShopCard = styled.div`
    width: 10%;
    display: flex;
    flex-direction: column;
    margin: 15px;
    cursor: pointer;
    >img{
        width: 100%;
    }
`