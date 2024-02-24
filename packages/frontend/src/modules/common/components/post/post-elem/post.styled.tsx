import styled from 'styled-components';

export const PostTextStyled = styled.div`
  a {
    color: blue;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  code {
    background: gray;
    border-radius: 2px;
    padding: 0.1em 0.2em;
    color: #d6d6d6;
    font-family: 'Source Code Pro', monospace;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
  }
`;
