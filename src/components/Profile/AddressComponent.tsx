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
    @media (max-width: 650px) {
        display: none;
    }
`;
export const ListAddressContainerMobile = styled.div`
        display: none;
     @media (max-width: 650px) {
         padding-top: 20px;
         display: inline;
    }
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
    p{
        cursor: pointer;
    }
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

export const ModalAdd = styled.div`
    background: #fff;
    height: 500px;
    padding: 15px;
    width: 50%;
    @media (max-width: 1000px) {
        width: 75%;
    }
    @media (max-width: 650px) {
        width: 100%;
        height: 100%;
        background: #e5e5e5;
        padding: 0px;
    }
`

export const HeaderModal = styled.div`
    font-size: 20px;
    @media (max-width: 650px) {
       display:  none;
    }
`;
export const HeaderModalMobile = styled.div`
    font-size: 20px;
    display:  none;
     @media (max-width: 650px) {
        display: flex;
        justify-content: left;
        align-items: center;
        gap: 30px;
        background: #fff;
        padding: 15px;
    }
`;

export const ContentInput = styled.div`
    height: 450px;
    overflow: auto;
    &::-webkit-scrollbar{
        display: none;
    }
    @media (max-width: 650px) {
        height: 91dvh;
        padding: 15px;
        background: #fff;
        border-radius: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 5px;
        margin-right: 5px;
    }
`;


export const LabelContainer = styled.div`
    color: #666666;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 650px) {
        color: #171717;
        font-size: 14px;
    }
`;

export const SwitchContainer = styled.div`
    &.mobile{
        display: none;
    }
    @media (max-width: 650px) {
        display: none;
        &.mobile{
        display: inline;
    }
    }
`

export const WrapperLabel = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 10px;
`;

export const OptionLabel = styled.div`
    border: 1px solid #e5e5e5;
    color: #171717;
    padding: 5px 10px;
    cursor: pointer;
    display: flex;
    justify-content: left;
    align-items: center;
    .ceklist{
        display: none;
    }
    &.active{
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        padding: 0px;
        .ceklist{
            position: relative;
            background: var(--primary-color);
            color: white;
            font-size: 12px;
            width: 24px;
            height: 24px;
            margin-top: -10px;
            display: flex;
            justify-content: left;
            align-items: start;
            border-top-left-radius: 0px;
            clip-path: polygon(0 0,100% 0,0 100%);
            padding-left: 2px;
        }
        p{
            position: relative;
            margin-left: -20px;
            padding: 5px 10px;
            font-weight: bold;
        }
        @media (min-width: 650px) {
            .ceklist{
        display: none;
    }
        }
    }
`;

export const InputFlex = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    @media (max-width: 650px) {
        display: grid;
        justify-content: normal;
    }
`

export const WrapperInput = styled.div`
    width: 100%;
    margin-bottom: 20px;
`;

export const LocationContainer = styled.div`
    background-image: url('/image/lokasi.png');
    background-size: 200px;
    height: 120px;
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const AddLocation = styled.div`
    background: #fff;
    color: #ccc;
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, .09);
    border-radius: 2px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .03);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 8px 12px;
    cursor: not-allowed;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
    margin-top: 40px;
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

export const MapsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;

  &:hover .show-maps-btn {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const ButtonMapsContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
`;

export const ButtonShowMaps = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &.show-maps-btn {
    /* ditandai agar bisa dikontrol lewat hover container */
  }
`;

export const ModalMapsContainer = styled.div`
    background: #fff;
    height: 550px;
    width: 80%;
    @media (max-width: 1000px) {
        width: 80%;
    }
    @media (max-width: 650px) {
        width: 100%;
        height: 100dvh;
    }
`;

export const HeaderMaps = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 20px;
    padding: 30px;
`;

export const InfoMap = styled.div`
   .title{
        color: #333;
        font-size: 20px;
        line-height: 15px;
   }

   .subtitle{
        font-size: .875rem;
        color: rgba(0, 0, 0, .54);
   }
`;

export const ModalAddAdressDescktop = styled.div`
    @media (max-width: 650px) {
        display: none;
    }
`;

interface ModalAddMobileProps {
    open: boolean;
}
export const ModalAddAdressMobile = styled.div<ModalAddMobileProps>`
    display: none;
    @media (max-width: 650px) {
      display: ${(props) => props?.open ? "inline" : "none"};
      position: absolute;
      top: 0;
      z-index: 3;
      width: 100%;
      background: red;
      left: 0;
      height: 100dvh;
    }
`