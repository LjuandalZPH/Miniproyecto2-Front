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

export interface RegisterData {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
}

export const register = async (userData: RegisterData): Promise<any> => {
  const res = await api.post('/users', userData);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/profile"); 
  return res.data.user; 
};

export const updateUser = async (id: string, updatedData: any) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar usuario");
  }

  return await response.json();
};

export const deleteUser = async (id: string) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Error al eliminar usuario:", error);
    throw error.response?.data || { message: "Error al eliminar usuario" };
  }
};

