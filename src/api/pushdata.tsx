import { API_ENDPOINTS, getApiUrl } from './apiConfig';

interface DataRow {
  [key: string]: unknown;
}

interface UploadPayload {
  data: DataRow[];
  fileName: string;
}

export const uploadData = async (payload: UploadPayload): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(getApiUrl(API_ENDPOINTS.UPLOAD), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { success: true, message: 'Data saved successfully!' };
    } else {
      return { success: false, message: 'Error saving data' };
    }
  } catch (error) {
    return { success: false, message: `Error: ${error}` };
  }
};