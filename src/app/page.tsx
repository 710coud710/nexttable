"use client";

import React, { useEffect, useState,  useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import {  GridApi, GridReadyEvent } from "ag-grid-community";
import { fetchData } from "@/api/fetchdata";
import { columnDefs } from "../utils/columnDefs";
import { DEFAULT_COL_DEF, GRID_CONFIG, GRID_FEATURES } from "../utils/gridConstants";
import { DataRow } from "../utils/pagetype";
import {  createExternalFilterFunctions } from "../utils/filterUtils";

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEnabled, setFilterEnabled] = useState<boolean>(false);
  const [minEquity, setMinEquity] = useState<number>(130000); 
  const [minUpnl, setMinUpnl] = useState<number|string>(-30); 
  const [resultCount, setResultCount] = useState(0)
  const gridApiRef = useRef<GridApi | null>(null)

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData();
        setData(data);

      } catch (err) {
        setError("Error fetching data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    setResultCount(params.api.getDisplayedRowCount()); 
    // Auto-size all columns
    params.api.sizeColumnsToFit(); 
  };

  const onFilterChanged = () => {
    if (gridApiRef.current) {
      setResultCount(gridApiRef.current.getDisplayedRowCount());
    }
  };

  const toggleFilter = () => {
    setFilterEnabled((prev) => !prev);
  };

  const { isExternalFilterPresent, doesExternalFilterPass } = createExternalFilterFunctions(
    filterEnabled,
    minEquity as number,
    Number(minUpnl)
  );
  
  
  if (loading) return <p style={{fontSize: '20px', color: 'red', textAlign: 'center', padding: '50px'}}>Loading data...</p>;
  if (error) return <p style={{fontSize: '20px', color: 'red', textAlign: 'center', padding: '50px'}}>{error}</p>;

  return (
    <div className="container-fluid">
      {/* <div style={{ marginBottom: "1rem" }}>
        
      </div> */}
      <div style={{ marginBottom: "1rem", marginLeft: "16px"}}>
        <label>
          <span style={{ marginRight: "8px" }}> Final Equity ≥ </span>
          <input
            type="number"
            value={minEquity}
            onChange={(e) => setMinEquity(Number(e.target.value))}
          />
        </label>
        <label style={{ marginLeft: "16px" }}>
          <span style={{ marginRight: "8px" }}> Max UPNL ≥ </span>
          <input
            type="number"
            step="0.01"
            value={minUpnl}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || value === "-" || !isNaN(Number(value))) {
                setMinUpnl(value); // Lưu  dưới dạng chuỗi
              }
            }}
            onBlur={() => {
              if (!isNaN(Number(minUpnl)) && minUpnl !== "") {
                setMinUpnl(Number(minUpnl));
              } else if (minUpnl === "-") {
                setMinUpnl(0); 
              }
            }}
          />
        </label>
        <button
          onClick={toggleFilter}
          className={`filter-button ${filterEnabled ? "filter-disabled" : "filter-enabled"}`}
          style={{ marginLeft: "20px", fontSize: "10px" }}
        >
          {filterEnabled ? "Filter Disabled ✕" : "Filter Enabled ✓"}
        </button>
      </div>
      <div style={{ marginBottom: "1rem", marginLeft: "16px" }}>
        <strong>Total Results: {resultCount}</strong>
      </div>
      <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
        <AgGridReact<DataRow>
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={DEFAULT_COL_DEF}
          paginationPageSize={GRID_CONFIG.PAGINATION_PAGE_SIZE}
          cacheBlockSize={GRID_CONFIG.CACHE_BLOCK_SIZE}
          {...GRID_FEATURES}

          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          onGridReady={onGridReady}
          onFilterChanged={onFilterChanged}
          
        />
      </div>
    </div>
  );
};

export default DataTable;
