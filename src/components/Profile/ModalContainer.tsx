import styled from "@emotion/styled";

interface ModalContainerProps {
    open: boolean;
}

export const ModalContainer = styled.div<ModalContainerProps>`
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    height: 100dvh;
    background: rgba(0, 0, 0, .4);
    display: ${(props) => props?.open ? "flex" : "none"};
    justify-content: center;
    align-items: center;
    z-index: 100;
`;

export const HeaderProtect = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
`

export const ModalProtectContainer = styled.div`
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 9px rgba(0, 0, 0, .12);
    box-sizing: border-box;
    padding: 24px;
    text-align: center;
    width: 500px;
    font-family: "Roboto", sans-serif;   
    @media (max-width: 510px) {
        width: 100%;
    }
`;

export const Content = styled.div`
    width: 100%;
    font-size: 18px;
    p{
        margin-top: 10px;
    }
`;

export const IconModalContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const IconModal = styled.img`
    
`;

export const ButtonVerifikasi = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: 1px solid #e5e5e5;
    color: #666666;
    font-weight: 600;
    margin-top: 30px;
`;

export const HeaderModal = styled.div`
    p{
        font-size: 18px;
        font-weight: 500;
    }
`;

export const IconAbsolute = styled.img`
    position: absolute;
    cursor: pointer;
`

export const Typograph = styled.p`
    text-align: center;
    font-size: 16px;
    color: #666666;
`;

export const ImageModalContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px;
`;

export const ResendVerification = styled.div`
    color: #b9b7b7;
    font-size: 16px;
    p{
        color: #171717;
    }
    span{
        color: var(--primary-color);
        cursor: pointer;
    }
`