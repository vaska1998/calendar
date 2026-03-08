import styled from '@emotion/styled';

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  color: #333;
  background: #fff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: #f29d38;
    box-shadow: 0 0 0 2px rgba(242, 157, 56, 0.2);
  }

  &::placeholder {
    color: #aaa;
  }
`;
