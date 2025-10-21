import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${API_BASE_URL}/api/pexels/videos`;

export const getVideosFromPexels = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        query: "movie trailer",
        per_page: 10,
        min_duration: 5,
        max_duration: 30,
      },
    });

    console.log("🎥 Videos desde backend:", response.data);
    return response.data.videos || [];
  } catch (error: any) {
    console.error("Error al obtener videos desde Pexels:", error.message);
    return [];
  }
};