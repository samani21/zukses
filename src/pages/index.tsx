// src/pages/index.tsx
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const Title = styled.h1`
  color: #0070f3;
`;

export default function Home() {
    return (
        <Container>
            <Title>Halo, Styled Components Tanpa Babel!</Title>
        </Container>
    );
}
