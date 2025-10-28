import axios from "axios";

/**
 * pexelsService
 *
 * Small helper that proxies requests to a backend endpoint which in turn
 * queries the Pexels Videos API. Keeping the client-side logic here allows
 * the backend to centralize the Pexels API key and any rate-limiting or
 * caching behavior.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${API_BASE_URL}/api/pexels/videos`;

/**
 * Fetch a short list of videos (movie trailers) from the backend Pexels proxy.
 *
 * This function calls the server endpoint at `/api/pexels/videos`. The backend
 * is expected to forward the request to Pexels and return a JSON body that
 * includes a `videos` array. If the shape differs, the caller receives an
 * empty array as a safe fallback.
 *
 * Note: This client-side helper hardcodes basic Pexels query params (query,
 * per_page, min_duration, max_duration). Adjust the backend or this helper
 * if you need dynamic queries or paging.
 *
 * @returns Promise resolving to an array of video objects (or empty array)
 */
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

    console.log(" Videos from backend:", response.data);
    return response.data.videos || [];
  } catch (error: any) {
    console.error("Error fetching videos from Pexels:", error.message);
    return [];
  }
};