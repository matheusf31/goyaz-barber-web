import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Title, Form } from '../styles/pages/Home';

import { useAuth } from '../hooks/auth';

export default function Home(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useAuth();
  const { user } = useAuth();
  const router = useRouter();

  const login = useCallback(
    async (e) => {
      e.preventDefault();

      signIn({ email, password });
    },
    [email, password, signIn]
  );

  if (user) {
    router.push('dashboard');
  }

  return (
    <>
      <Container>
        <Title>Faça seu login</Title>

        <Form>
          <input
            type="email"
            placeholder="Enter your email address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input type="password" onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" onClick={login}>
            Sign in
          </button>
        </Form>
      </Container>
    </>
  );
}
