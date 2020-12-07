import { useRouter } from 'next/router';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface ISignInCredential {
  email: string;
  password: string;
}

interface IAuthContextData {
  user: Record<string, unknown>;
  signIn(credential: ISignInCredential): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

function AuthProvider({ children }): JSX.Element {
  const router = useRouter();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('@GoyazBarber:token');
    const user = localStorage.getItem('@GoyazBarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      setProfile({ token, user: JSON.parse(user) });
    }
  }, []);

  const signIn = useCallback(async ({ email, password }: ISignInCredential) => {
    try {
      const response = await api.post('/sessions', {
        email,
        password,
        device_id: 'web',
      });

      const { token, user } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('@GoyazBarber:token', token);
        localStorage.setItem('@GoyazBarber:user', JSON.stringify(user));
      }

      api.defaults.headers.authorization = `Bearer ${token}`;

      setProfile({ token, user });
    } catch (error) {
      alert(error.response.data.message);
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoyazBarber:token');
    localStorage.removeItem('@GoyazBarber:user');

    setProfile({});

    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user: profile?.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth most be use within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
