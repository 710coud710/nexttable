"use servers"
import { getApiUrl, API_ENDPOINTS } from "./apiConfig";
import { DataRow } from "../utils/pagetype";

interface ApiResponse {
  data: DataRow[];
  message?: string;
}

export const fetchData = async () => {
    try {
      // const response = await fetch("http://27.72.246.67:8710/api/data1");
      const response = await fetch(getApiUrl(API_ENDPOINTS.DATA1));
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      return result;
    } catch (err) {
     
      console.error("Error fetching data:", err);
    } 
  };


export const fetchCollectionData = async (collectionName: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(getApiUrl(API_ENDPOINTS.DATA), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection_name: collectionName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch data");
    }

    const result = await response.json();
    return { data: result.data || [] };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error fetching data");
  }
};
