import api from './api';

export interface LoginResponse {
  token?: string;
  user?: any;
  message?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post('/api/login', { email, password });
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
  const res = await api.post('/api/users', userData);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/api/profile"); 
  return res.data.user; 
};

export const updateUser = async (id: string, updatedData: any) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
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
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Error al eliminar usuario:", error);
    throw error.response?.data || { message: "Error al eliminar usuario" };
  }
};

/**
 * Obtener las películas favoritas de un usuario (helper centralizado).
 * Retorna el array `favorites` que viene desde el backend.
 */
export const getUserFavorites = async (userId: string) => {
  try {
    const res = await api.get(`/api/users/${userId}/favorites`);
    // backend devuelve { message, favorites }
    return res.data?.favorites ?? res.data;
  } catch (error: any) {
    console.error("Error al obtener favoritos del usuario:", error);
    throw error?.response?.data || { message: "Error al obtener favoritos" };
  }
};

/**
 * Alterna (add/remove) una película en los favoritos del usuario.
 * Llama a PATCH /api/users/:userId/favorites/:movieId
 */
export const toggleFavorite = async (userId: string, movieId: string) => {
  try {
    const res = await api.patch(`/api/users/${userId}/favorites/${movieId}`);
    return res.data;
  } catch (error: any) {
    console.error("Error al alternar favorito:", error);
    throw error?.response?.data || { message: "Error al alternar favorito" };
  }
};