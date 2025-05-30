import styled from "@emotion/styled";

export const ProfilComponent = styled.div`
    font-family: "Roboto", sans-serif;    
    padding: 10px;
    padding-top: 0px;
    border-bottom: 1px solid #e5e5e5;
`;

export const Title = styled.div`
    font-weight: bold;
    font-size: 18px;
    color: #171717;
`;

export const SubTitle = styled.div`
    color: #666666;
    font-size: 14px;
    font-weight: 600;
`;

export const Wrapper = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 10px;
`;

export const Label = styled.label`
    color: #666666;
    font-size: 16px;
    text-align: right;
`;

export const FormProfil = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding: 20px;
`;

export const InputWrapper = styled.div`
    border: 1px solid #e5e5e5;
    padding-left: 10px;
    padding-right: 10px;
    width: 100%;
`;

export const Input = styled.input`
    outline: none;  
    width: 100%;
`;
export const InputSelect = styled.select`
    padding: 10px;
    border:1px solid #e5e5e5;
    color: #666666;
`;

export const InputRadio = styled.input`
    &:checked{
        accent-color: var(--primary-color);
    }
`;

export const Table = styled.table`
    width: 100%;
    flex: 2;
`;
export const TBody = styled.tbody`
    
`;

export const Tr = styled.tr`
      
`;

export const Td = styled.td`
    padding: 15px 20px;
`;

export const WrapperImageProfil = styled.div`
    border-left: 1px solid #e5e5e5;
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ImageProfilContainer = styled.div`
    p{
        font-size: 16px;
        color: #666666;
    }
`;

export const LabelImageContainer = styled.div`
    padding: 8px 12px;
    background: #fff;
    text-align: center;
    color: #666666;
    cursor: pointer;
    font-size: 14px;
    font-weight:600;

`;

export const LabelImage = styled.label`
    display: inline-block;
    border: 1px solid #e5e5e5;
    padding: 10px 20px;
`;

export const ImageContainer = styled.div`
    display: flex;
    justify-content: center ;
    align-items: center;
`;

export const Image = styled.img`
    border-radius: 50%;
    width: 150px;
`;

export const ButtonContainer = styled.div`
    padding:30px;
    width: 52%;
    display: flex;
    justify-content: center;
`;

export const ButtonSave = styled.button`
    background: var(--primary-color);
    color: white;
    padding: 10px 20px;
`