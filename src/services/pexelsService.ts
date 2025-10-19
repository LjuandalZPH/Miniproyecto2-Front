import axios from "axios";

const API_URL = "http://localhost:3000/api/pexels/photos";

export const getPostersFromPexels = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        query: "movie poster", 
        per_page: 20,
        orientation: "portrait",
      },
    });
    return response.data.photos;
  } catch (error: any) {
    console.error("Error al obtener carteleras:", error.message);
    return [];
  }
};