import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100vh;  
`;

export const Title = styled.h1``;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 10px;


  width: 90vw;
  max-width: 600px;

  position: relative;

  input {
    padding: 1rem 1rem;
    margin: 5px 0;
    border-radius: 10px;
    border: 0;
    box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1);
  }

  button {
    margin: 10px 0;
    padding: 0 3.5rem;
    line-height: 2.8rem;
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