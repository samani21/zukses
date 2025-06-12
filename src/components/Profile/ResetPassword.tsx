import styled from "@emotion/styled";

export const ResetPasswordContainer = styled.div`
   
`;

export const HeaderResetPassword = styled.div`
    width: 100%;
    font-size: 1.20rem;
    p{
        color: #222;
        text-align: center;
    }
`;

export const ContentResetPassword = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const IconResetPasswrd = styled.img`
    
`

export const IconResetPasswordContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const VerifyContainer = styled.div`
    height: 590px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Roboto", sans-serif;  
    width: 100%;
    p{
        font-size: 18px;
        font-weight: 500;
        text-align: center;
        margin-top: 20px;
    }
    @media (max-width: 650px) {
        height: 90dvh;
    }
`;
export const CheckPasswordContainer = styled.div`
    height: 590px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Roboto", sans-serif;  
    width: 100%;
    p{
        font-size: 18px;
        font-weight: 500;
        text-align: center;
        margin-top: 20px;
    }
    @media (max-width: 650px) {
        height: 88dvh;
    }
`;

export const CheckPasswordContent = styled.div`
    width:60%;
    @media (max-width: 950px) {
        width: 80%;
    }
    @media (max-width: 650px) {
        width: 90%;
    }
`;
export const ChangePasswordContent = styled.div`
    width:70%;
    @media (max-width: 950px) {
        width: 90%;
    }
    @media (max-width: 650px) {
        width: 100%;
    }
`;

export const ButtonVerify = styled.button`
    border: 1px solid #e5e5e5;
    display: flex;
    justify-content: center;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 40px;
    color: #666666;
    span{
        margin-left: 10px;
    }
`;