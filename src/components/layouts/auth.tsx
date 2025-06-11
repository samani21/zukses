import styled from '@emotion/styled'
import { theme } from 'styles/theme';

export const Root = styled.div`
  background-color: ${theme?.colors?.background};
  color: ${theme?.colors?.textMain};
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 90dvh;
  font-family: ${theme?.font};
  @media (max-width: 650px) {
    display: none;
  }
`;


export const Logo = styled.img`
  width: 150px;
  margin-bottom: 24px;
`;

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
  width: 100%;
  gap: 40px;
  justify-content: center;
  align-items: center;

  @media (max-width: 850px) {
    display: grid;
  }
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const Left = styled.div`
  flex: 1;
  min-width: 280px;
  text-align: center;
`;

export const LeftImageContainer = styled.div`
  display: flex;
  justify-content:center;
`

export const LeftImage = styled.img`
  max-width: 300px;
  width: 100%;

  @media (max-width: 640px) {
    max-width: 200px;
  }

  @media (min-width: 641px) and (max-width: 768px) {
    max-width: 250px;
  }
`;

export const Title = styled.h2`
  font-size: 22px;
  margin-top: 1px;
  margin-left: 1px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${theme?.colors?.textMain};
  span{
    color: ${theme?.colors?.primary};
  }
  &.mobile{
    display: none;
  }
  @media (max-width: 650px) {
      &.mobile{
        display: block;
        font-size: 19px;
      }
      &.desktop{
        display: none;
      }
  }
`;

export const Description = styled.p`
  color: ${theme?.colors?.textSecondary};
  font-size: 14px;
`;

export const Right = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  background-color: ${theme?.colors?.cardBg};
  border: 1px solid ${theme?.colors?.border};
  border-radius: ${theme?.radius};
  padding: 32px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);

  @media (max-width: 640px) {
    padding: 24px;
  }
`;

export const CenteredText = styled.p`
  text-align: center;
  font-size: 14px;
  margin: 10px;
  @media (max-width: 650px) {
    display: none;
  }
`;

export const StyledLink = styled.a`
  color: ${theme?.colors?.primary};
  text-decoration: none;
  transition: ${theme?.transition};
  cursor: pointer;
  &:hover {
    color: ${theme?.colors?.primaryDark};
  }
`;

export const GoogleButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 16px;
  border: 1px solid ${theme?.colors?.borderSecondary};
  border-radius: ${theme?.radius};
  background-color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  transition: ${theme?.transition};
  color: #666666;
  &:hover {
    background-color: ${theme?.colors?.primaryLight};
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${theme?.colors?.border};
  }

  span {
    margin: 0 10px;
    color: ${theme?.colors?.textSecondary};
    font-size: 14px;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
  padding: 10px;
  border: 1px solid ${theme?.colors?.borderSecondary};
  border-radius: ${theme?.radius};
  margin-bottom: 8px;
  &.error{
    border: 1px solid ${theme?.colors?.error};
  }
  &:focus{
    border: 1px solid ${theme?.colors?.primary};
    &.error{
    border: 1px solid ${theme?.colors?.error};
  }
  }

`

export const Input = styled.input`
  outline: none;
  width: 100%;
  @media (max-width: 650px) {
    font-size: 14px;
  }
`;

export const ErrorMessage = styled.div`
  color: ${theme?.colors?.error};
  font-size: 12px;
  margin-bottom: 16px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${theme?.colors?.border};
  color: ${theme?.colors?.textSecondary};
  border: none;
  border-radius: ${theme?.radius};
  font-weight: bold;
  cursor: not-allowed;
  &:enabled{
    background-color: ${theme?.colors?.primary};
    color: #fff;
    cursor: pointer;
  }
    @media (max-width: 650px) {
    font-size: 14px;
  }
`;

export const Terms = styled.p`
  font-size: 12px;
  text-align: center;
  margin-top: 16px;

  a {
    color: ${theme?.colors?.primary};
    text-decoration: none;
    font-weight: bold;
    transition: ${theme?.transition};

    &:hover {
      color: ${theme?.colors?.primaryDark};
    }
  }
`;


export const RootMobile = styled.div`
  display: none;
  @media (max-width: 650px) {
    display: block;
    background-image: url('/image/background_auth.png');
    background-size: 100% 300px;
    background-repeat: no-repeat;
    background-position: top;
    height: 90dvh;
    font-family: ${theme?.font};
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-top: 10px;
`

export const IconHeader = styled.img`
  
`

export const IconAuth = styled.img`
  
`

export const Footer = styled.div`
  display: none;
  @media (max-width: 650px) {
    position: absolute;
    display: block;
    bottom: 0;
    width: 100%;
    background: #f0f3f8;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    font-size: 14px;
    span{
      color: ${theme?.colors?.primary};
      font-weight: 500;
      margin-left: 4px;
    }
  }

`;

export const ContentMobile = styled.div`
  padding: 20px;
`

