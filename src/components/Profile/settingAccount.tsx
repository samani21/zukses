import styled from "@emotion/styled";

export const SettingAccountContainer = styled.div`
    background: #e5e5e5;
    font-family: "Roboto", sans-serif;    
    @media (max-width: 650px) {
        height: 99dvh;
        /* overflow: auto; */
        &::-webkit-scrollbar{
            display: none;
        }
    }
`;

export const HeaderSetting = styled.div`
  display:flex;
  justify-content: left;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: white;
  font-size: 18px;
  color: black;
`;
export const HeaderSettingOrders = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: white;
  font-size: 18px;
  color: black;
    .left{
        display: flex;
        justify-content: left;
        align-items: center;
        gap: 10px;
    }
    .right{
        gap: 10px;
        display: flex;
        justify-content: left;
        align-items: center;
  }
`;

export const Content = styled.div`
    overflow: auto;
    background: #e5e5e5;
`;

export const Title = styled.p`
    color: #666666;
    padding: 10px;
`;

export const MenuSetting = styled.div`
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 18px;
    color: #171717;
    padding: 10px;
    margin-bottom: 10px;
`;

export const TItleMobile = styled.div`
    width: 100%;
    padding: 10px;
    color: #666666;
`