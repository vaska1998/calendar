import styled from '@emotion/styled';

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: #f29d38;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e08c2a;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const ButtonOutline = styled.button`
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }

  &:disabled {
    background: #f5f5f5;
    color: #aaa;
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 16px;
  color: #555;
  padding: 0;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover {
    background: #e8e8e8;
    border-color: #999;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ButtonGhost = styled.button`
  border: none;
  background: none;
  color: #999;
  font-size: 11px;
  cursor: pointer;
  padding: 2px 4px;
  text-align: left;
  border-radius: 3px;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: #f0f0f0;
    color: #555;
  }
`;
