import styled from '@emotion/styled'


export const AuthContainer = styled.div`
    height: 100dvh;
    font-family: "Roboto", sans-serif;  
`;

export const NavAuth = styled.nav`
    box-shadow: 0 6px 6px rgba(0, 0, 0, .06);
    height: 84px;
    padding-left: 100px;
    padding-right: 100px;
    background: #fff;
    @media (max-width: 1100px) {
        padding: 0px;
    }
`;

export const HeaderContainer = styled.div`
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 15px;
    align-items: center;
`;

export const HeaderLeft = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    margin-top: 10px;
    gap: 20px;
`;

export const LogoHeader = styled.img`
    width: 130px;
    margin-top: -10px;
`;

export const TextLogin = styled.div`
    color: #222;
    font-size: 1.5rem;
    font-family: "Roboto", sans-serif;
    @media (max-width: 990px) {
        display: none;
    }
`;

export const TextHelper = styled.div`
    color: var(--primary-color-text);
    cursor: pointer;
    font-size: .875rem;
    margin-right: 15px;
    font-family: "Roboto", sans-serif;  
    margin-top: 10px;
`;

export const ContentContainer = styled.div`
    background: var(--primary-color) ;
    padding-left: 100px;
    padding-right: 100px;
    @media (max-width: 1100px) {
        padding: 0px;
    }
     @media (max-width: 990px) {
       background: #fff;
    }
`;

export const Content = styled.div`
    background-image: url('/image/backgroundAuth.png') ;
    min-height: 600px;
    background-repeat: no-repeat;
    @media (max-width: 990px) {
        background-image: none;
    }
`;

export const CardContainer = styled.div`
    width: 100%;
`;

export const CardAuth = styled.div`
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .14);
    box-sizing: border-box;
    overflow: hidden;
    width: 400px;
    position: absolute;
    right: 100px;
    top: 150px;
     @media (max-width: 990px) {
        position: unset;
        width: 100%;
        height: 90.5dvh;
    }
`;

export const TitleAuth = styled.p`
    font-family: "Roboto", sans-serif;  
    color: #222;
    font-size: 1.25rem;
    max-width: 8.5rem;
`;

export const HeadCard = styled.div`
    padding: 1.375rem 30px;
    width: 100%;  
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const RightHeaderCard = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
`;

export const TextSwtichAuth = styled.div`
    border: 2px solid #ffbf00;
    border-radius: 2px;
    color: #ffbf00;
    font-size: .875rem;
    font-weight: 700;
    margin-right: 1rem;
    padding: .6875rem .875rem;
    position: relative;  
    background: #fefaec;
    z-index: 2;
    &::after{
        border-right: 2px solid #ffbf00;
        border-top: 2px solid #ffbf00;
        box-sizing: border-box;
        content: "";
        height: .75rem;
        position: absolute;
        right: -.75rem;
        top: 50%;
        transform: rotate(45deg) translateX(-50%);
        width: .75rem;
        background: #fefaec;
    }
`;

export const Rectangle = styled.div`
    width: 60px;
    height: 30px;
    background: #fff;
    position: absolute;
    top: 47px;
    right: 39px;
    transform: rotate(45deg);
    z-index: 1;
     @media (max-width: 990px) {
        top: 128px;
    }
`;

export const SwitchLogo = styled.img`
      width: 50px;
`;

export const ContentCard = styled.div`
    padding: 1.375rem 30px;
`;

export const WrapperInput = styled.div`
    border: 1px solid rgba(0, 0, 0, .14);
    border-radius: 2px;
    box-shadow: inset 0 2px 0 rgba(0, 0, 0, .02);
    box-sizing: border-box;
    height: 2.5rem;
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    margin-top: 30px;
`

export const InputAuth = styled.input`
    border: 0;
    filter: none;
    flex: 1;
    flex-shrink: 0;
    outline: none;
    padding: .75rem;  
    width: 100%;
    height: 100%;
`;

export const IconPassword = styled.img`
    cursor: pointer;
    opacity: 0.54;
`;

export const ButtonAuth = styled.button`
    background-color: var(--primary-color-text);
    box-shadow: 0 1px 1px rgba(0, 0, 0, .09);
    color: #fff;  
    width: 100%;
    padding: 7px;
    margin-top: 20px;
    cursor: pointer;
`;

export const ForgetPassword = styled.div`
    font-size: .75rem; 
    color: #05a ;
    margin-top: 10px;
`;

export const OrContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ccc;
    font-size: .75rem;
    text-transform: uppercase;
    gap: 10px;
    margin-top: 10px;
`;

export const Line = styled.div`
    width: 100%;
    height: 1px;
    border: 1px solid #dbdbdb;
`;

export const AuthWith = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
`

export const Facebook = styled.div`
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, .26);
    border-radius: 2px;
    box-sizing: border-box;
    color: rgba(0, 0, 0, .87);
    font-size: .875rem;
    height: 40px;
    outline: none;
    padding: 0 2px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`
export const Google = styled.div`
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, .26);
    border-radius: 2px;
    box-sizing: border-box;
    color: rgba(0, 0, 0, .87);
    font-size: .875rem;
    height: 40px;
    outline: none;
    padding: 0 2px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`

export const IconSocial = styled.img`
`;

export const TextFooter = styled.div`
    color: rgba(0, 0, 0, .26);
    padding-right: 4px;
    white-space: pre;
    font-size: .875rem;
    text-align: center;
    margin-top: 10px;
    span{
        color: var(--primary-color-text);
        cursor: pointer;
    }
`
interface ModalAgreementContainerProps {
    open: boolean;
}

export const ModalAgreementContainer = styled.div<ModalAgreementContainerProps>`
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    height: 100dvh;
    background: rgba(0, 0, 0, .4);
    display: ${(props) => props?.open ? "flex" : "none"};
    justify-content: center;
    align-items: center;
`;

export const ModalContainer = styled.div`
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 9px rgba(0, 0, 0, .12);
    box-sizing: border-box;
    padding: 24px;
    text-align: center;
    width: 500px;
    @media (max-width: 510px) {
        width: 100%;
    }
`;

export const TitleModal = styled.div`
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 2rem;
    margin-bottom: 16px;
`;

export const ContentModal = styled.div`
    color: rgba(0, 0, 0, .7);
    span{
        color: #4080ee;
    }
`;

export const ButtonModalContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
`;

export const ButtonCancel = styled.div`
    border: 1px solid rgba(0, 0, 0, .09);
    box-shadow: 0 1px 1px rgba(0, 0, 0, .03);
    color: #555;
    font-size: 1rem;
    min-width: 82px;
    padding: 5px;
    cursor: pointer;
`;

export const ButtonAgree = styled.div`
    background-color: var(--primary-color-text);
    box-shadow: 0 1px 1px rgba(0, 0, 0, .09);
    color: #fff;
    font-size: 1rem;
    min-width: 82px;
    margin-left: .625rem;
    padding: 5px;
    cursor: pointer;
`

export const BackContainer = styled.div`
    text-align: center ;
`;

export const IconInModal = styled.img`
    
`;

export const TextHeaderCard = styled.div`
    width: 100%;
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 2rem;
    text-align: center;
`;

export const TextContent = styled.div`
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    color: rgba(0, 0, 0, .7);
    span{
        color: #4080ee;
    }
`;

export const WhatsAppContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

export const AlertChangePassword = styled.div`
    margin-top: 10px;
    font-size: 14px;
    color: #45ca32;
`;

export const ListAlert = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
`;