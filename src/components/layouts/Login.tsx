import styled from '@emotion/styled'
import { theme } from 'styles/theme';

export const RootLogin = styled.div`
    background-color: ${theme?.colors?.background};
    color: ${theme?.colors?.textMain};
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100dvh;
    font-family: ${theme?.font};
`;

export const Header = styled.div`
  display: none;
  @media (max-width: 650px) {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
`

export const Logo = styled.img`
    width: 150px;
    margin-bottom: 24px;
    @media (max-width: 650px) {
      display: none;
    }
`;

export const Card = styled.div`
  background: #fff;
  margin-top: 30px;
  width: 380px;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  @media (max-width: 650px) {
    box-shadow: none;
    width: 100%;
    padding: 0px;
    background: none;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-left: 1px;
`;

export const DaftarLink = styled.a`
  color: ${theme?.colors?.primary};
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  @media (max-width: 650px) {
    display: none;
  }
`;

export const InputGroup = styled.div`
  margin-top: 24px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid ${theme?.colors?.primary};
  border-radius: 8px;
  font-size: 16px;
`;

export const InputHint = styled.small`
  font-size: 12px;
  color: #888;
  display: block;
  margin-top: 6px;
`;

export const HelpText = styled.div`
  text-align: right;
  margin-top: 8px;
  font-size: 14px;
  color: ${theme?.colors?.primary};
  cursor: pointer;
`;

export const ButtonNext = styled.button`
  margin-top: 24px;
  width: 100%;
  padding: 14px;
  font-size: 16px;
  background-color: #e0e0e0;
  color: #bdbdbd;
  border: none;
  border-radius: 8px;
  cursor: not-allowed;
  background: ${theme?.colors?.border};
  &:enabled{
    background: ${theme?.colors?.primary};
  }
`;

export const Divider = styled.div`
  margin: 24px 0;
  text-align: center;
  position: relative;

  &::before,
  &::after {
    content: "";
    height: 1px;
    background: #ccc;
    position: absolute;
    top: 50%;
    width: 40%;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  span {
    background: #fff;
    padding: 0 10px;
    font-size: 14px;
    color: #888;
    position: relative;
    z-index: 1;
  }
`;

export const LoginOption = styled.div`
  border: 1px solid ${theme?.colors?.borderSecondary};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: ${theme?.colors?.border};
  }

  img {
    width: 20px;
    height: 20px;
  }

  span {
    font-size: 14px;
    color: #333;
  }
`;

export const FooterImage = styled.div`
  position: fixed;
  bottom: 30px;
  left: 30px;

  img {
    width: 80px;
  }

  @media (max-height: 700px) {
    display: none;
  }
`;