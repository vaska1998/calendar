import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppUser } from '../../contexts/user.context.tsx';
import { passwordMinLength, passwordMaxLength } from '../../infrastructure/constants/fields.ts';
import { patternEmail } from '../../infrastructure/constants/patterns.ts';
import type {
  AuthLoginSignInRequest,
  AuthTokenResponse,
} from '../../infrastructure/dto/auth/login.ts';
import type { ClientResponse } from '../../infrastructure/client/response.ts';
import { Input, Button, Label, HintText, AlertError } from '../ui';
import { extractError } from '../../utils/extractError.ts';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

interface LoginFormProps {
  prefillEmail?: string;
}

const LoginForm = ({ prefillEmail = '' }: LoginFormProps) => {
  const { client, signIn } = useAppUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: (data: AuthLoginSignInRequest) => client.auth.signIn(data),
    onSuccess: (response: ClientResponse<AuthTokenResponse>) => {
      if (response.type === 'SUCCESS') {
        signIn(
          { accessToken: response.result.accessToken, refreshToken: response.result.refreshToken },
          true,
        );
        navigate('/calendar', { replace: true });
      }
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        Email
        <Input
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="you@example.com"
          pattern={patternEmail.source}
          required
        />
      </Label>

      <Label>
        Password
        <Input
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="••••••••"
          minLength={passwordMinLength}
          maxLength={passwordMaxLength}
          required
        />
        <HintText>
          {passwordMinLength}–{passwordMaxLength} characters
        </HintText>
      </Label>

      {mutation.isError && <AlertError>{extractError(mutation.error)}</AlertError>}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Signing in…' : 'Sign In'}
      </Button>
    </Form>
  );
};

export default LoginForm;
