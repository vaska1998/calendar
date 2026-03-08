import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAppUser } from '../../contexts/user.context.tsx';
import { passwordMinLength, passwordMaxLength } from '../../infrastructure/constants/fields.ts';
import { patternEmail, patternPassword } from '../../infrastructure/constants/patterns.ts';
import type { UserCreateUpdateDto } from '../../infrastructure/dto/user/userCreateUpdateDto.ts';
import type { ClientResponse } from '../../infrastructure/client/response.ts';
import type { User } from '../../infrastructure/dto/user/user.ts';
import { Input, Button, Label, HintText, FieldError, AlertError, AlertSuccess } from '../ui';
import { extractError } from '../../utils/extractError.ts';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

interface RegisterFormProps {
  onRegistered: (email: string) => void;
}

const RegisterForm = ({ onRegistered }: RegisterFormProps) => {
  const { client } = useAppUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const mutation = useMutation({
    mutationFn: (data: UserCreateUpdateDto) => client.user.create(data),
    onSuccess: (response: ClientResponse<User>) => {
      if (response.type === 'SUCCESS') {
        onRegistered(email);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        First Name
        <Input
          type="text"
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
          placeholder="John"
          required
        />
      </Label>

      <Label>
        Last Name
        <Input
          type="text"
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
          placeholder="Doe"
          required
        />
      </Label>

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
        {email && !patternEmail.test(email) && (
          <FieldError>Please enter a valid email address</FieldError>
        )}
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
          pattern={patternPassword.source}
          required
        />
        <HintText>
          {passwordMinLength}–{passwordMaxLength} chars, uppercase, lowercase, digit &amp; special
          character
        </HintText>
        {password && !patternPassword.test(password) && (
          <FieldError>
            Must contain uppercase, lowercase, digit and special character (!@#$%^&amp;*…)
          </FieldError>
        )}
      </Label>

      <Label>
        Confirm Password
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          minLength={passwordMinLength}
          maxLength={passwordMaxLength}
          required
        />
        {confirmPassword && password !== confirmPassword && (
          <FieldError>Passwords do not match</FieldError>
        )}
      </Label>

      {mutation.isError && <AlertError>{extractError(mutation.error)}</AlertError>}
      {mutation.isSuccess && mutation.data.type === 'SUCCESS' && (
        <AlertSuccess>Account created! You can sign in now.</AlertSuccess>
      )}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating…' : 'Create Account'}
      </Button>
    </Form>
  );
};

export default RegisterForm;
