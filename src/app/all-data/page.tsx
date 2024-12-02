'use client';

import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { fetchCollections, deleteCollection } from '@/api/collection'; // Import các hàm API
import Link from 'next/link';

interface Collection {
  id: number;
  name: string;
  time: string;
  collection_name: string;
}

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  // const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionsData = await fetchCollections(); // Gọi hàm lấy dữ liệu
        setCollections(collectionsData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert('Error fetching collections');
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (name: string) => {
    try {
      const { success, message } = await deleteCollection(name); // Gọi hàm xóa collection

      if (success) {
        alert(message);
        // update lại dS sau khi xóa
        setCollections((prevCollections) =>
          prevCollections.filter((collection) => collection.name !== name)
        );
      } else {
        alert(message);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection.');
    }
  };

  // const handleView = (name: string) => {
  //   router.push(`/all-data/${name}`);
  // };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Collections</h1>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.headerCell}>STT</th>
            <th style={styles.headerCell}>Name Collection</th>
            <th style={styles.headerCell}>Time</th>
            <th style={styles.headerCell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => (
            <tr key={collection.id} style={styles.bodyRow}>
              <td style={styles.bodyCell}>{collection.id}</td>
              <td style={styles.bodyCell}>{collection.name}</td>
              <td style={styles.bodyCell}>
                {collection.time.replace('_', ' ')}
              </td>
              <td>
                <Link 
                  href={`/all-data/${collection.collection_name}`}
                  style={styles.viewButton}
                >
                  View
                </Link>
                <button 
                  onClick={() => handleDelete(collection.collection_name)} 
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  headerRow: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    textAlign: 'left',
  },
  headerCell: {
    padding: '10px',
    fontWeight: 'bold',
  },
  bodyRow: {
    backgroundColor: '#f9f9f9',
    transition: 'background-color 0.3s ease',
  },
  bodyCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  viewButton: {
    padding: '5px 10px',
    marginRight: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#FF4D4F',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default CollectionsPage;
