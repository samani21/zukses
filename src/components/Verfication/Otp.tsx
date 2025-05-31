import styled from "@emotion/styled";

export const OtpContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: start;
    height: 100dvh;
`;

export const ContentContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Content = styled.div`
    width: 800px;
    color: #666666;
    text-align: center;
    p{
        margin-top: 50px;
    }
    span{
        font-weight: bold;
        color: var(--primary-color);
        cursor: pointer;
    }
    @media (max-width: 500px) {
        width: 100%;
        padding: 10px;
    }
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 10px;
`;

export const Title = styled.div`
    width: 100%;
    font-size: 18px;
    text-align: center;
`

export const IconBack = styled.img`
`

export const ButtonNext = styled.div`
    background: var(--primary-color);
    padding: 10px 15px;
    color: white;
    margin-top: 50px;
`