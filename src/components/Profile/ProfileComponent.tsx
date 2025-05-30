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
    margin: 25px;
    @media (max-width: 1000px) {
        display: grid;
        justify-content: normal;
        margin: 0px;
    }
`;

export const FormGroup = styled.div`
    width: 100%;
`;

export const Label = styled.div`
    color: #666666;
    font-size: 16px;
    text-align: right;
    width: 200px;
     @media (max-width: 1000px) {
       text-align: left;
    }
`;
export const LabelRadio = styled.div`
    color: #666666;
    font-size: 16px;
    text-align: left;
    width: auto;
`;

export const FormProfil = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr; /* form-left (3 bagian), image (1 bagian) */
    grid-template-areas: "form-left image";
    padding-top: 10px;

    @media (max-width: 1160px) {
        grid-template-columns: 1fr;
        grid-template-areas:
            "image"
            "form-left";
    }
`;

export const FormLeft = styled.div`
    grid-area: form-left;
    padding: 10px;
`;
export const InputWrapper = styled.div`
    border: 1px solid #e5e5e5;
    padding: 10px;
    width: 100%;
    span{
        color: blue;
        text-decoration: underline;
        font-size: 14px;
        cursor: pointer;
        margin-left: 10px;
    }
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
    span{
        color: blue;
        text-decoration: underline;
        font-size: 14px;
        cursor: pointer;
    }
`;

export const WrapperImageProfil = styled.div`
    grid-area: image;
    border-left: 1px solid #e5e5e5;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;

    @media (max-width: 1160px) {
        border: none;
    }
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
    /* padding:30px; */
    width: 100%;
    display: flex;
    justify-content: center;
    @media (max-width: 1160px) {
       width: 100%;
       justify-content: left;
       padding-left: 10px;
    }
`;

export const ButtonSave = styled.button`
    background: var(--primary-color);
    color: white;
    padding: 10px 20px;
`