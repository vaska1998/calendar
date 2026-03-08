import styled from '@emotion/styled';
import type { PropsWithChildren } from 'react';
import HeaderMenu from './HeaderMenu.tsx';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #e8e8e8;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <LayoutWrapper>
      <HeaderMenu />
      <Content>{children}</Content>
    </LayoutWrapper>
  );
};

export default AppLayout;
