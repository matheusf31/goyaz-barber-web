import { useCallback } from 'react';

export default function Dashboard(): JSX.Element {
  const logout = useCallback(() => {
    alert('logout 2');
  }, []);

  return (
    <>
      <h1>Hello Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </>
  );
}
