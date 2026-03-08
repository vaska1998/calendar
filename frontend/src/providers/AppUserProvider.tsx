import React, { type PropsWithChildren, useCallback, useRef, useState } from 'react';
import {
  type AuthCredentials,
  type AuthCredentialsWithClaims,
  CREDENTIALS_KEY,
  parseTokenClaims,
  saveTokenToCookie,
} from '../utils/token.ts';
import { createClientManager } from '../infrastructure/client/manager.ts';
import { AxiosProxy } from '../infrastructure/client/proxy/axios.proxy.ts';
import { API_URL } from '../utils/connections.ts';
import { setCookie } from '../utils/cookie.ts';
import { AppUserContext, type AppUserProviderProps } from '../contexts/user.context.tsx';

export const AppUserProvider: React.FC<PropsWithChildren<AppUserProviderProps>> = ({
  children,
  user,
}) => {
  const [reactUser, setReactUser] = useState<AuthCredentialsWithClaims | null>(user);
  const [isAuthorized, setIsAuthorized] = useState(!!user);

  const refreshTokenRef = useRef(user?.refreshToken ?? '');
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  const doRefreshRef = useRef<() => Promise<string | null>>(null!);

  const doRefresh = useCallback(async (): Promise<string | null> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const promise = (async () => {
      const storedRefreshToken = refreshTokenRef.current;
      if (!storedRefreshToken) return null;

      const tempProxy = new AxiosProxy(API_URL, '');
      const tempClient = createClientManager(tempProxy);
      const response = await tempClient.auth.refresh({ refreshToken: storedRefreshToken });

      if (response.type === 'SUCCESS') {
        const { accessToken, refreshToken } = response.result;
        const claims = parseTokenClaims(accessToken);
        refreshTokenRef.current = refreshToken;
        saveTokenToCookie({ accessToken, refreshToken }, true);
        setReactUser({ accessToken, refreshToken, claims });

        const newProxy = new AxiosProxy(API_URL, accessToken);
        newProxy.setOnUnauthorized(() => doRefreshRef.current());
        const newClient = createClientManager(newProxy);
        setReactClient(newClient);

        return accessToken;
      }
      return null;
    })();

    refreshPromiseRef.current = promise;
    try {
      return await promise;
    } finally {
      refreshPromiseRef.current = null;
    }
  }, []);

  doRefreshRef.current = doRefresh;

  const [reactClient, setReactClient] = useState(() => {
    const proxy = new AxiosProxy(API_URL, user?.accessToken ?? '');
    proxy.setOnUnauthorized(() => doRefreshRef.current());
    return createClientManager(proxy);
  });

  const signIn = (credentials: AuthCredentials, rememberMe: boolean) => {
    const { accessToken, refreshToken } = credentials;
    refreshTokenRef.current = refreshToken;
    saveTokenToCookie({ accessToken, refreshToken }, rememberMe);
    const claims = parseTokenClaims(accessToken);
    setReactUser({ accessToken, refreshToken, claims });
    setIsAuthorized(true);
    const proxy = new AxiosProxy(API_URL, accessToken);
    proxy.setOnUnauthorized(() => doRefreshRef.current());
    setReactClient(createClientManager(proxy));
  };

  const signOut = () => {
    if (!isAuthorized) {
      return;
    }

    refreshTokenRef.current = '';
    setCookie(CREDENTIALS_KEY, '', 0);
    localStorage.clear();
    setReactClient(createClientManager(new AxiosProxy(API_URL, '')));
    setReactUser(null);
    setIsAuthorized(false);
  };

  const refreshSession = async () => {
    const newToken = await doRefresh();
    if (!newToken) {
      signOut();
    }
  };

  return (
    <AppUserContext.Provider
      value={{
        user: reactUser,
        isAuthorized,
        client: reactClient,
        signIn,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AppUserContext.Provider>
  );
};
