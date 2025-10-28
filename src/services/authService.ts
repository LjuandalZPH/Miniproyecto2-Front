import api from './api';

/**
 * Shape of the response returned by the `login` endpoint.
 *
 * token: optional JWT token string when login succeeds.
 * user: optional user payload returned by the API.
 * message: optional human-readable message from the server.
 */
export interface LoginResponse {
  token?: string;
  user?: any;
  message?: string;
}

/**
 * Perform a login request.
 *
 * Sends credentials to the API and returns the parsed response data.
 * The caller should persist the returned token (if any) to localStorage
 * or handle it according to the application's auth flow.
 *
 * @param email - User's email
 * @param password - User's password
 * @returns Promise resolving to LoginResponse (raw API response data)
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post('/api/login', { email, password });
  return res.data;
};

/**
 * Data required to register a new user.
 */
export interface RegisterData {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
}

/**
 * Register a new user.
 *
 * @param userData - Object containing registration fields.
 * @returns Promise resolving to the server response (usually created user or message)
 */
export const register = async (userData: RegisterData): Promise<any> => {
  const res = await api.post('/api/users', userData);
  return res.data;
};

/**
 * Fetch the current user's profile.
 *
 * Returns the `user` object from the API response. If the API shape changes,
 * callers may need to adapt to the new structure.
 */
export const getProfile = async () => {
  const res = await api.get("/api/profile");
  return res.data.user;
};

/**
 * Update a user's data using a direct fetch call.
 *
 * Note: this function uses the Fetch API instead of the shared `api` axios
 * instance. It expects the token to be stored in localStorage under 'token'.
 *
 * @param id - User id to update
 * @param updatedData - Partial or full user payload to update
 * @returns Parsed JSON response from the server
 * @throws Error when the response is not ok
 */
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

/**
 * Delete a user by id.
 *
 * Uses the shared axios `api` instance and returns the server response.
 * Errors from the backend are re-thrown in a consistent format.
 *
 * @param id - User id to delete
 */
export const deleteUser = async (id: string) => {
  try {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw error.response?.data || { message: "Error deleting user" };
  }
};

/**
 * Get a user's favorite movies.
 *
 * The backend typically returns an object like { message, favorites } — this
 * helper extracts and returns the `favorites` array when present, otherwise
 * it returns the full response data.
 *
 * @param userId - Id of the user whose favorites to fetch
 */
export const getUserFavorites = async (userId: string) => {
  try {
    const res = await api.get(`/api/users/${userId}/favorites`);
    // backend may return { message, favorites }
    return res.data?.favorites ?? res.data;
  } catch (error: any) {
    console.error("Error fetching user favorites:", error);
    throw error?.response?.data || { message: "Error fetching favorites" };
  }
};

/**
 * Toggle a movie in the user's favorites (add or remove).
 *
 * Calls PATCH /api/users/:userId/favorites/:movieId and returns server data.
 * @param userId - Id of the user
 * @param movieId - Id of the movie to toggle
 */
export const toggleFavorite = async (userId: string, movieId: string) => {
  try {
    const res = await api.patch(`/api/users/${userId}/favorites/${movieId}`);
    return res.data;
  } catch (error: any) {
    console.error("Error toggling favorite:", error);
    throw error?.response?.data || { message: "Error toggling favorite" };
  }
};