export const API_ENDPOINTS = {
    BASE_URL: "https://jojectbe.onrender.com",
    // BASE_URL: "http://27.72.246.67:8710",
    UPLOAD: '/api/upload',
    DATA: '/api/data',
    DATA1: '/api/data1',
    DELETE: '/api/delete',
    COLLECTION: '/api/collections',
  };

export const getApiUrl = (endpoint: string) => `${API_ENDPOINTS.BASE_URL}${endpoint}`;