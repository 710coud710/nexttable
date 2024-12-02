// src/api/collections.ts
import { getApiUrl, API_ENDPOINTS } from './apiConfig';
// Hàm lấy danh sách collections

interface CollectionData {
  timestamp: string;
  name: string;
  collection_name: string;
}

export const fetchCollections = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.COLLECTION));
      const data = await response.json();
  
      if (data.status === 'success') {
        const formattedCollections = data.collections.map(
          (collection: CollectionData, index: number) => ({
            id: index + 1,
            name: collection.name,           // Tên file
            time: collection.timestamp,      // Timestamp
            collection_name: collection.collection_name  // Tên collection đầy đủ
          })
        );
        return formattedCollections;
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw new Error('Error fetching collections');
    }
  };
  
  // Hàm xóa collection
  export const deleteCollection = async (name: string) => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.DELETE), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collection_name: name }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return { success: true, message: `Successfully deleted collection: ${name}` };
      } else {
        return { success: false, message: data.message || 'Failed to delete collection' };
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw new Error('Error deleting collection');
    }
  };
  