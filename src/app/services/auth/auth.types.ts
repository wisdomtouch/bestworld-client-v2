export interface SignInRequest {
  email: string;
  password: string;
  ip: string;
  location: string;
  browser: string;
  os: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiration: string;
}
