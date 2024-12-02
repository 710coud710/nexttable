export const API_ENDPOINTS = {
    // BASE_URL: "http://127.0.0.1:8710",
    BASE_URL: "http://27.72.246.67:8710",
    UPLOAD: '/api/upload',
    DATA: '/api/data',
    DATA1: '/api/data1',
    DELETE: '/api/delete',
    COLLECTION: '/api/collections',
  };

export const getApiUrl = (endpoint: string) => `${API_ENDPOINTS.BASE_URL}${endpoint}`;