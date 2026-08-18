export interface LoginRequest {
  employee_code: string;
  password: string;
  remember: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
}