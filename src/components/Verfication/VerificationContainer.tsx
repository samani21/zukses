import styled from "@emotion/styled";

export const VerificationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100dvh;
    font-family: "Roboto", sans-serif;   
`;

export const ContentVerification = styled.div`
    max-width: 500px;
    padding: 10px;
`;

export const IconVerificationContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
`;

export const IconVerification = styled.img`
    width: 100px;
`;

export const Title = styled.div`
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    margin-bottom: 30px;
`;

export const Line = styled.div`
    margin-top: 50px;
    height: 1px;
    width: 100%;
    border-top: 1px solid #c9c9c9;
    margin-bottom: 30px;
`;

export const WarningContainer = styled.div`
    background: #ca264c28;
    padding: 10px;
    span{
        font-weight: bold;
    }
`;

export const ListWarning = styled.li`
    padding-left: 20px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-top: 40px;
`;

export const ButtonApprove = styled.div`
    cursor: pointer;
    border: 1px solid #666666;
    color: #171717;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 10px;
`;
export const ButtonReject = styled.div`
    cursor: pointer;
    background: var(--primary-color);
    color: #fff;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 10px;
`;

export const IconButton = styled.img`
   
`