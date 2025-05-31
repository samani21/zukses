import styled from "@emotion/styled";

export const EmailContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
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
    @media (max-width: 500px) {
        width: 100%;
        padding: 10px;
    }
`
export const Title = styled.div`
    padding-bottom: 30px;
    font-weight: bold;
    font-size: 18px;
    border-bottom:  1px solid #666666;
    width: 100%;
`;


export const FormContainer = styled.div`
    width: 100%;
    margin-top: 50px;
`

export const Label = styled.div`
    color: #666666;
    font-size: 16px;
`;

export const FormGroup = styled.div`
    display: flex;
    justify-content: left;
    align-items: start;
    gap:40px;
    width: 100%;
    @media (max-width: 500px) {
        display: grid;
        justify-content: normal;
    }
`;

export const WrapperInputContainer = styled.div`
    flex: 2;
`

interface WrapperInput {
    error: boolean;
}

export const WrapperInput = styled.div<WrapperInput>`
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
    cursor: pointer;
    flex: 2;
    border: ${(props) => props?.error ? "1px solid red" : "1px solid rgba(0, 0, 0, .14)"};;
`

export const Input = styled.input`
    border: 0;
    filter: none;
    flex: 1;
    flex-shrink: 0;
    outline: none;
    padding: .75rem;  
    width: 100%;
    height: 100%;
`;

export const Error = styled.p`
    color: red;
`

export const ButtonNext = styled.button`
    background: var(--primary-color);
    margin-top: 20px;
    color: white;
    padding: 10px 15px;
`