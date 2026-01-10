export interface TokenPayload {
  sub: string; // user ID
  email: string;
  name: string | null | undefined;
}

export interface AuthTokens {
  accessToken: string;
  accessExpiresIn: number; // in seconds
  refreshToken: string;
  refreshExpiresIn: number; // in seconds
}

export interface SignupInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
