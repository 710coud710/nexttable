// src/api/collections.ts

// Hàm lấy danh sách collections
export const fetchCollections = async () => {
    try {
      const response = await fetch('http://27.72.246.67:8710/api/collections'); // Endpoint API
      const data = await response.json();
  
      if (data.status === 'success') {
        const formattedCollections = data.collections.map(
          (name: string, index: number) => ({
            id: index + 1,
            name,
            time: new Date().toLocaleString(), // Tạm dùng thời gian hiện tại
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
      const response = await fetch('http://27.72.246.67:8710/api/delete', {
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
  