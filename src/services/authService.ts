import api from './api';

export interface LoginResponse {
  token?: string;
  user?: any;
  message?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post('/login', { email, password });
  return res.data;
};
