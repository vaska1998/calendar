import styled from '@emotion/styled';
import { useState } from 'react';
import { Card, Tabs, Tab } from '../../components/ui/index.ts';
import { LoginForm, RegisterForm } from '../../components/auth/index.ts';

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: #e8e8e8;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 24px;
`;

type TabType = 'login' | 'register';

const Login = () => {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [prefillEmail, setPrefillEmail] = useState('');

  const handleRegistered = (email: string) => {
    setPrefillEmail(email);
    setActiveTab('login');
  };

  return (
    <PageWrapper>
      <Card>
        <Title>📅 Calendar</Title>

        <Tabs>
          <Tab active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
            Sign In
          </Tab>
          <Tab active={activeTab === 'register'} onClick={() => setActiveTab('register')}>
            Create Account
          </Tab>
        </Tabs>

        {activeTab === 'login' ? (
          <LoginForm key={prefillEmail} prefillEmail={prefillEmail} />
        ) : (
          <RegisterForm onRegistered={handleRegistered} />
        )}
      </Card>
    </PageWrapper>
  );
};

export default Login;
