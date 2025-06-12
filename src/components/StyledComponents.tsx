// components/StyledComponents.tsx
import styled from 'styled-components';

export const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textMain};
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
`;

export const Navbar = styled.nav`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: ${({ theme }) => theme.radius};
  cursor: pointer;
  font-weight: 600;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: ${({ theme }) => theme.transition};

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`;

export const Link = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
