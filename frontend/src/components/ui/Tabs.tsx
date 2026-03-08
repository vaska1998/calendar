import styled from '@emotion/styled';

export const Tabs = styled.div`
  display: flex;
  margin-bottom: 24px;
  border-bottom: 2px solid #eee;
`;

export const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${({ active }) => (active ? '#f29d38' : '#888')};
  border-bottom: 2px solid ${({ active }) => (active ? '#f29d38' : 'transparent')};
  margin-bottom: -2px;
  transition:
    color 0.2s,
    border-color 0.2s;

  &:hover {
    color: #f29d38;
  }
`;
