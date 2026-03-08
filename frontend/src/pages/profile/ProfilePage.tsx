import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppUser } from '../../contexts/user.context.tsx';
import {
  Card,
  Input,
  Button,
  ButtonOutline,
  Label,
  HintText,
  FieldError,
  AlertError,
  AlertSuccess,
} from '../../components/ui';
import { passwordMinLength, passwordMaxLength } from '../../infrastructure/constants/fields.ts';
import { patternEmail, patternPassword } from '../../infrastructure/constants/patterns.ts';
import { extractError } from '../../utils/extractError.ts';
import type { UserCreateUpdateDto } from '../../infrastructure/dto/user/userCreateUpdateDto.ts';
import type { ClientResponse } from '../../infrastructure/client/response.ts';
import type { User } from '../../infrastructure/dto/user/user.ts';

const PageWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  overflow: auto;
`;

const ProfileCard = styled(Card)`
  width: 480px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
`;

const AvatarCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f29d38;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  flex-shrink: 0;
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserFullName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const UserEmail = styled.span`
  font-size: 13px;
  color: #888;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
`;

const DangerZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DangerTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #e53935;
`;

const DangerText = styled.span`
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
`;

const DeleteButton = styled(Button)`
  background: #e53935;
  &:hover {
    background: #c62828;
  }
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ConfirmCard = styled(Card)`
  width: 360px;
  text-align: center;
`;

const ConfirmTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
`;

const ConfirmText = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0 0 20px;
  line-height: 1.5;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const ProfilePage = () => {
  const { user, client, signOut, refreshSession } = useAppUser();
  const navigate = useNavigate();
  const claims = user?.claims;

  const [firstName, setFirstName] = useState(claims?.firstName ?? '');
  const [lastName, setLastName] = useState(claims?.lastName ?? '');
  const [email, setEmail] = useState(claims?.email ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fullName = `${claims?.firstName ?? ''} ${claims?.lastName ?? ''}`.trim();
  const initials = `${claims?.firstName?.[0] ?? ''}${claims?.lastName?.[0] ?? ''}`.toUpperCase();

  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserCreateUpdateDto>) => client.user.update(data),
    onSuccess: async (response: ClientResponse<User>) => {
      if (response.type === 'SUCCESS') {
        await refreshSession();
        setPassword('');
        setConfirmPassword('');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => client.user.delete(),
    onSuccess: (response: ClientResponse<void>) => {
      if (response.type === 'SUCCESS') {
        signOut();
        navigate('/login', { replace: true });
      }
    },
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<UserCreateUpdateDto> = {};
    if (firstName !== (claims?.firstName ?? '')) payload.firstName = firstName;
    if (lastName !== (claims?.lastName ?? '')) payload.lastName = lastName;
    if (email !== (claims?.email ?? '')) payload.email = email;
    if (password) {
      payload.password = password;
      payload.confirmPassword = confirmPassword;
    }
    updateMutation.mutate(payload);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    deleteMutation.mutate();
  };

  const hasChanges =
    firstName !== (claims?.firstName ?? '') ||
    lastName !== (claims?.lastName ?? '') ||
    email !== (claims?.email ?? '') ||
    password.length > 0;

  return (
    <PageWrapper>
      <ProfileCard>
        <Title>Profile</Title>

        <AvatarSection>
          <AvatarCircle>{initials || '?'}</AvatarCircle>
          <UserMeta>
            <UserFullName>{fullName || 'Unknown User'}</UserFullName>
            <UserEmail>{claims?.email ?? ''}</UserEmail>
          </UserMeta>
        </AvatarSection>

        <Form onSubmit={handleUpdate}>
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
            New Password
            <Input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Leave empty to keep current"
              minLength={passwordMinLength}
              maxLength={passwordMaxLength}
              pattern={password ? patternPassword.source : undefined}
            />
            <HintText>
              {passwordMinLength}–{passwordMaxLength} chars, uppercase, lowercase, digit &amp;
              special character
            </HintText>
            {password && !patternPassword.test(password) && (
              <FieldError>
                Must contain uppercase, lowercase, digit and special character
              </FieldError>
            )}
          </Label>

          {password && (
            <Label>
              Confirm New Password
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="••••••••"
                minLength={passwordMinLength}
                maxLength={passwordMaxLength}
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <FieldError>Passwords do not match</FieldError>
              )}
            </Label>
          )}

          {updateMutation.isError && <AlertError>{extractError(updateMutation.error)}</AlertError>}
          {updateMutation.isSuccess && updateMutation.data.type === 'SUCCESS' && (
            <AlertSuccess>Profile updated successfully!</AlertSuccess>
          )}

          <ButtonRow>
            <Button type="submit" disabled={!hasChanges || updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </ButtonRow>
        </Form>

        <Divider />

        <DangerZone>
          <DangerTitle>Danger Zone</DangerTitle>
          <DangerText>
            Permanently delete your account and all associated data. This action cannot be undone.
          </DangerText>

          {deleteMutation.isError && <AlertError>{extractError(deleteMutation.error)}</AlertError>}

          <DeleteButton
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete Account'}
          </DeleteButton>
        </DangerZone>
      </ProfileCard>

      {showDeleteConfirm && (
        <ConfirmOverlay onClick={() => setShowDeleteConfirm(false)}>
          <ConfirmCard onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <ConfirmTitle>Delete Account?</ConfirmTitle>
            <ConfirmText>
              This will permanently remove your account and all your tasks. You will be logged out
              immediately.
            </ConfirmText>
            <ConfirmButtons>
              <ButtonOutline type="button" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </ButtonOutline>
              <DeleteButton type="button" onClick={handleDelete}>
                Yes, Delete
              </DeleteButton>
            </ConfirmButtons>
          </ConfirmCard>
        </ConfirmOverlay>
      )}
    </PageWrapper>
  );
};

export default ProfilePage;
