import type { AuthCredentials, AuthCredentialsWithClaims } from '../utils/token.ts';
import type { ClientManagerType } from '../infrastructure/client/manager.ts';
import React, { useContext } from 'react';

export type AppUserProviderProps = {
  user: AuthCredentialsWithClaims | null;
};

type AppUserContextContent = {
  user: AuthCredentialsWithClaims | null;
  client: ClientManagerType;
  isAuthorized: boolean;
  signIn: (credentials: AuthCredentials, rememberMe: boolean) => void;
  signOut: () => void;
  refreshSession: () => Promise<void>;
};

export const AppUserContext = React.createContext<AppUserContextContent | null>(null);

export const useAppUser = () => useContext(AppUserContext)!;
