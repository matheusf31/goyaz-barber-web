import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100vh;
`;

export const LogoutButton = styled.button`
  position: absolute;
  right: 0;
  margin: 20px;

  padding: 0.2rem 1rem;
  line-height: 2.2rem;
  border-radius: 10px;
  background-color: #0070f3;
  box-shadow: 0 4px 14px 0 rgba(0, 118, 244, 0.39);
  color: white;

  border: 0;
  transition: background 0.2s;

  &:hover {
    background-color: #0065f3;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  top: 0;
  margin: 20px 0 40px;

  h1 {
    margin: 0 40px;
  }

  button {
    margin: 10px;
    padding: 0 1.6rem;
    line-height: 2.4rem;
    border-radius: 10px;
    background-color: #0070f3;
    box-shadow: 0 4px 14px 0 rgba(0, 118, 244, 0.39);
    color: white;

    border: 0;
    transition: background 0.2s;

    &:hover {
      background-color: #0065f3;
    }
  }
`;

export const ClientNumberContainer = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    display: flex;
    justify-content: center;
  }
`;

export const ClientGraphsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;
