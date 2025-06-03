import styled from "@emotion/styled";

export const AddressComponent = styled.div`
    font-family: "Roboto", sans-serif;    
    padding: 10px;
    padding-top: 0px;
`;

export const HeaderAddress = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 15px;
    @media (max-width: 650px) {
     display: none;
    }
`

export const Title = styled.div`
    font-weight: bold;
    font-size: 18px;
    color: #171717;
`;

export const ButtonAddAddress = styled.div`
    cursor: pointer;
    background: var(--primary-color);
    color: white;
    padding: 10px 15px;
`;

export const ContentAddress = styled.div`
    font-size: 18px;
    color: #171717;
    padding-top: 10px;
    @media (max-width: 650px) {
        .mobile{
        display: none;
        }
    }
`;

export const ListAddressContainer = styled.div`
    padding-top: 20px;
`;

export const Address = styled.div`
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
    font-size: 18px;
    color: #666666;
    margin-bottom: 15px;
`;

export const AddressTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const InfoUser = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    b{
        color: #171717;
        border-right: 1px solid #666666;
        font-size: 1rem;
        padding-right: 5px;
    }
    p{
        padding-left: 10px;
        font-size: .875rem;
    }
`;

export const Action = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 20px;
    font-size: 16px;
    color: #05a7ff;
    @media (max-width: 650px) {
     display: none;
    }
`;

export const AddressContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding-top: 10px;
`;

export const TypographAddress = styled.div`
    font-size: .875rem;
    line-height: 1.25rem;
`

export const SetAddress = styled.div`
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, .26);
    box-shadow: 0 1px 1px rgba(0, 0, 0, .03);
    color: rgba(0, 0, 0, .87);
    font-size: .875rem;
    min-width: 0;
    padding: 4px 12px;
    @media (max-width: 650px) {
     display: none;
    }
`;

export const StatusAddress = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    color: #666666;
    padding-top: 10px;
    gap: 5px;
    span{
        border: 1px solid #666666;
        font-size: .75rem;
        padding: 4px;
        padding: 2px 4px;
    }

    .primary{
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
    }
`;

export const AddAddressMobile = styled.div`
    display: none;
    @media (max-width: 650px) {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        font-size: .875rem;
        color: var(--primary-color);
    }
`;

export const IconAddAddress = styled.img`
`