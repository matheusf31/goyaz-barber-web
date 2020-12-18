import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  font-size: 60px;

  html, body, #root {
    height: 100vh;
  }

  * {
    margin: 0;
    padding: 0;
    outline: 0;
  }

  body {
    background: #f5f5f5;
    color: #17181d;
    font-family: Arial, Helvetica, sans-serif;
  }

  #root {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  body, input, button, textarea {
    font: 500 1.6rem;
  }

  button {
    cursor: pointer;
  }

  @media (max-width: 700px) {
    :root {
      font-size: 80%;
    }
  }
`;
