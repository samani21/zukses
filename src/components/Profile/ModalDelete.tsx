import styled from "@emotion/styled";

export const DeleteComponentComponent = styled.div`
    font-family: "Roboto", sans-serif;    
    padding: 10px;
    background: #fff;
    color: #555;
    padding: 20px;

`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 10px;
    padding-top: 30px;
`;

export const ButtonHold = styled.div`
    align-items: center;
    background: none;
    border: 0;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    font-size: 14px;
    justify-content: center;
    min-width: 140px;
    outline: none;
    padding: 10px;
    color: #555;
    &:hover{
        background: #e5e5e5;
    }
`;

export const ButtonOk = styled.button`
    align-items: center;
    background: none;
    border: 0;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    font-size: 14px;
    justify-content: center;
    min-width: 140px;
    outline: none;
    padding: 10px;
    background: var(--primary-color);
`;