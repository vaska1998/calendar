export type AuthLoginSignInRequest = {
  email: string;
  password: string;
};

export type AuthRefreshRequest = {
  refreshToken: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
};
