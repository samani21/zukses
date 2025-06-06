import styled from "@emotion/styled";

export const MenusContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: auto;
    background: #fff;
    font-family: "Roboto", sans-serif;    
    &::-webkit-scrollbar{
        display: none;
    }
`;

export const Menu = styled.div`
    padding: 10px;
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: 100%;
    padding: 16px 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.active{
        border-bottom: 1px solid var(--primary-color);
        color: var(--primary-color);
    }
    @media (max-width: 650px) {
        &.active{
        border-bottom: 2px solid var(--primary-color);
        color: var(--primary-color);
        font-weight: bold;
        }
    }
`;

export const SearchContainer = styled.div`
    background: #eaeaea;
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 20px;
    padding: 0px 10px;
    .image-black{
        display: none;
    }
     &:focus-within {
        .image-gray{
            display: none;
        }
        .image-black{
        display: inline;
        }
    }

    @media (max-width: 650px) {
        display: none;
    }
`;

export const InputSearch = styled.input`
    width: 100%;
    color: black;
    border: none;
    outline: none;
    padding: 16px 0px;
    &::placeholder{
        color: #666666;
    }
`;

export const IconOrders = styled.img`
    
`

export const ListItemOrder = styled.div`
    margin-top: 15px;
    @media (max-width: 650px) {
        padding-left: 10px;
        padding-right: 10px;
    }
`;

export const ItemOrder = styled.div`
    background: #fff;
    padding: 25px;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .05);
    border-radius: .125rem;
    margin-bottom: 1px;
    @media (max-width: 650px) {
        border-radius: 10px;
        padding: 10px;
    }
`;

export const HeaderItemOrder = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom:1px solid #e8e8e8;
`;

export const HeaderLeft = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 10px;
    b{
        font-size: 14px;
        font-weight: 600;
        margin-left: 8px;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;


export const ButtonChat = styled.button`
    background: var(--primary-color);
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: white;
    @media (max-width: 1050px) {
        display: none;
    }
`;


export const ButtonViewShop = styled.button`
    background: #fff;
    border: 1px solid rgba(0, 0, 0, .09);
    color: #555;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 5px 10px;
      @media (max-width: 1050px) {
        display: none;
    }
`;

export const StatusOrders = styled.div`
    color: var(--primary-color);
    line-height: 24px;
    text-align: right;
    text-transform: uppercase;
    white-space: nowrap;
    @media (max-width: 650px) {
        font-size: 14px;
    }
`;

export const ContentItemOrder = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
`;

export const ContentLeft = styled.div`
    display: flex;
    justify-content: left;
    align-items: start;
    gap:10px;
    width: 100%;
`

export const ImageItem = styled.img`
    width: 100px;
`;

export const InfoItem = styled.div`
    margin: 0 0 5px;
    font-size: 16px;
    span{
          display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 16px;
    line-height: 22px;
    margin: 0 0 5px;
    max-height: 48px;
    }
     @media (max-width: 650px) {
        span{
            font-size: 14px;
        }
    }
`;

export const Variant = styled.div`
    color: rgba(0, 0, 0, .54);
     @media (max-width: 650px) {
        font-size: 14px;
    }
`;

export const Price = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 10px;
    .price-old{
        color: #000;
        margin: 0 4px 0 0;
        opacity: .26;
        overflow: hidden;
        -webkit-text-decoration-line: line-through;
        text-decoration-line: line-through;
        text-overflow: ellipsis;
    }
    .price-new{
        color: var(--primary-color);
    }
    @media (max-width: 650px) {
        display: none;
    }
`;

export const PriceAmount = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 10px;
    background: #fffefb;
    padding: 24px 24px 12px;
    color: rgba(0, 0, 0, .8);
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 1px;
    span{
        font-size: 24px;
        line-height: 30px;
        color: var(--primary-color);
    }
    @media (max-width: 650px) {
        display: none;
    }
`;

export const ActionOrder = styled.div`
    background: #fffefb;
    padding: 24px 24px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 1300px) {
        justify-content: right;
    }
    @media (max-width: 950px) {
        display: none;
    }
`;

export const InformationOrder = styled.div`
    gap: 10px;
    display: flex;
    gap: 4px;
    justify-content: center;
    align-items: center;
    max-width: 400px;
    min-width: 300px;
    word-wrap: break-word;
    color: rgba(0, 0, 0, .54);
    font-size: 12px;
    line-height: 16px;
    text-align: left;
    @media (max-width: 1300px) {
        display: none;
    }
`;

export const ActionButtonContainer = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 10px;
`;

export const ButtonColor = styled.button`
    background: var(--primary-color);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
`
export const ButtonAction = styled.button`
    background: #fff;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, .09);
    color: #555;
`

export const SatusMarket = styled.div`
    background: var(--primary-color);
    color: white;
    font-size: 12px;
    padding: 1px 6px;
    border-radius: 2px;
    font-weight: bold;
`;

export const VariaQty = styled.div`
    @media (max-width: 650px) {
        display: flex;
        justify-content: space-between;
        gap: 20px;
    }
`;

export const PriceMobile = styled.div`
    display: none;
    @media (max-width: 650px) {
        display: flex;
        justify-content: right;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        .price-old{
            color: #000;
            margin: 0 4px 0 0;
            opacity: .26;
            overflow: hidden;
            -webkit-text-decoration-line: line-through;
            text-decoration-line: line-through;
            text-overflow: ellipsis;
        }
        .price-new{
            color: var(--primary-color);
        }
    }
`;

export const CardItemOrder = styled.div`
  margin-bottom: 20px;
`;

export const ActionMobileContainer = styled.div`
    display: none;
    @media (max-width: 650px) {
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 10px;
    width: 100%;    
    }
`;

export const ButtonOutline = styled.button`
    background: #fff;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    padding: 5px 15px;
    border-radius: 8px;
`
export const ButtonOutlineGray = styled.button`
    background: #fff;
    border: 1px solid #c3c3c3;
    color: #575757;
    padding: 5px 15px;
    border-radius: 8px;
`;

export const AmountMobile = styled.div`
    display: none;
    @media screen {
        display: flex;
        justify-content: right;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        span{
            font-weight: bold;
        }
        margin-top: 10px;
        margin-bottom: 10px;
    }
`