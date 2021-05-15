import styled, { css } from 'styled-components';

interface ImageProps {
  active?: boolean;
}

export const Container = styled.div`
  display: flex;

  position: absolute;
  left: 0;

  margin-left: 10px;

  button {
    border: 0;
    outline: none;
    background-color: #f5f5f5;
    -webkit-tap-highlight-color: transparent;
  }
`;

export const Avatar = styled.img<ImageProps>`
  width: 50px;
  height: 50px;
  border-radius: 50%;

  object-fit: cover;

  margin-top: 1rem;
  margin-left: 5px;

  border: 2px solid #f5f5f5;

  ${(props) =>
    props.active &&
    css`
      width: 54px;
      height: 54px;
      border: 2px solid #0070f3;
    `}
`;
