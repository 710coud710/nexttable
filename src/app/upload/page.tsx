'use client';
import { uploadData } from '@/api/pushdata';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface DataRow {
  [key: string]: unknown;
}

const UploadPage = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [fileType, setFileType] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // Xử lý khi chọn file XLSX hoặc CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);

      if (file.name.endsWith('.xlsx') || file.name.endsWith('.csv')) {
        const reader = new FileReader();

        reader.onload = (event) => {
          const fileContent = event.target?.result;

          if (file.name.endsWith('.xlsx')) {
            // Đọc file XLSX
            const wb = XLSX.read(fileContent, { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(ws);
            setData(jsonData as DataRow[]);
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

        if (file.name.endsWith('.xlsx')) {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsBinaryString(file);
        }
      } else {
        alert('Please upload a valid XLSX or CSV file!');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        data: data,
        fileName: fileName
      };
      const result = await uploadData(payload);
      alert(result.message);
      console.log(fileName);
      console.log(data);
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
            <p>File name: {fileName}</p>
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
