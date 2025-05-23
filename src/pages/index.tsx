// src/pages/index.tsx
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  margin-top: 50px;
`;



export default function Home() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return (
    <Container>
      <div onClick={handleLogout}>
        Logout
      </div>
    </Container>
  );
}
