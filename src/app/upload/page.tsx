'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface DataRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}

const UploadPage = () => {
  const [data, setData] = useState<DataRow[]>([]); // Lưu trữ dữ liệu đọc từ file
  const [fileType, setFileType] = useState<string>(''); // Lưu kiểu file đã tải lên (XLSX/CSV)

  // Xử lý khi chọn file XLSX hoặc CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra định dạng file
      if (
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.csv')
      ) {
        const reader = new FileReader();

        reader.onload = (event) => {
          const fileContent = event.target?.result;

          if (file.name.endsWith('.xlsx')) {
            // Đọc file XLSX
            const wb = XLSX.read(fileContent, { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]]; // Lấy sheet đầu tiên
            const jsonData = XLSX.utils.sheet_to_json(ws); // Chuyển Sheet thành JSON
            setData(jsonData as DataRow[]); // Lưu dữ liệu vào state
            setFileType('xlsx');
            console.log('Data from XLSX:', jsonData);
          } else if (file.name.endsWith('.csv')) {
            // Đọc file CSV
            const wb = XLSX.read(fileContent, { type: 'binary' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(ws);
            setData(jsonData as DataRow[]);
            setFileType('csv');
            console.log('Data from CSV:', jsonData);
          }
        };

        // Đọc file
        if (file.name.endsWith('.xlsx')) {
          reader.readAsArrayBuffer(file); // Đọc file XLSX
        } else {
          reader.readAsBinaryString(file); // Đọc file CSV
        }
      } else {
        alert('Please upload a valid XLSX or CSV file!');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Data API:', data);

      const response = await fetch('http://127.0.0.1:8710/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Data saved successfully!');
      } else {
        alert('Error saving data');
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  return (
    <div>
      <h1>Upload Page</h1>
      <p>Upload file xlsx & csv here!</p>

      <div>
        {fileType === '' && (
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileUpload}
            style={{ margin: '30px' }}
          />
        )}

        {fileType && (
          <div>
            <p>{fileType === 'csv' ? 'CSV file selected' : 'XLSX file selected'}</p>
          </div>
        )}
        <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
          Upload Data
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
