import { type } from 'os';
import React, { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';

interface ISignInCredential { 
  email: string; 
  password: string;
}

interface IAuthContextData {
  user: object;
  signIn(credential: ISignInCredential): Promise<void>;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

function AuthProvider({ children }): JSX.Element {
  const [profile, setProfile] = useState(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('@GoyazBarber:token');
      const user = localStorage.getItem('@GoyazBarber:user');
    
      if (token && user) {
        return { token, user: JSON.parse(user)};
      }

      return undefined;
    }
  });
  
  const signIn = useCallback(async ({ email, password }: ISignInCredential) => {
    try {
      const response = await api.post('/sessions', {
        email,
        password,
        device_id: 'web'
      });

      const { token, user } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('@GoyazBarber:token', token);
        localStorage.setItem('@GoyazBarber:user', JSON.stringify(user));
      }
      
      console.log(token, user);

      setProfile({ token, user });

      alert('sucesso');
    } catch (error) {
      alert(error.response.data.message);  
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user: profile?.user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth most be use within an AuthProvider')
  }

  return context;
}

export { AuthProvider, useAuth };