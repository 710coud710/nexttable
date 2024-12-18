"use client";

import React, { useEffect, useState,  useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import {  GridApi, GridReadyEvent } from "ag-grid-community";
import { columnDefs } from "../../../utils/columnDefs"; 
import { DataRow } from "../../../utils/pagetype";
import { useParams } from "next/navigation";
import { fetchCollectionData } from "../../../api/fetchdata";
import { createExternalFilterFunctions } from "../../../utils/filterUtils";
import { DEFAULT_COL_DEF, GRID_CONFIG, GRID_FEATURES } from "../../../utils/gridConstants";

const ViewDataPage = () => {
  const params = useParams();
  const name = params.name as string;

  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEnabled, setFilterEnabled] = useState<boolean>(false);
  const [minEquity, setMinEquity] = useState<number>(130000);
  const [minUpnl, setMinUpnl] = useState<number | string>(-30);
  const [resultCount, setResultCount] = useState<number>(0);
  const gridApiRef = useRef<GridApi | null>(null);

  // Hàm fetch dữ liệu
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchCollectionData(name);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [name]);

  // Fetch dữ liệu khi collectionName hoặc name thay đổi
  useEffect(() => {
    fetchData();
  }, [name, fetchData]);


  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    setResultCount(params.api.getDisplayedRowCount());
    params.api.sizeColumnsToFit();
  };

  // Sự kiện khi bộ lọc thay đổi
  const onFilterChanged = () => {
    if (gridApiRef.current) {
      setResultCount(gridApiRef.current.getDisplayedRowCount());
    }
  };

  const { isExternalFilterPresent, doesExternalFilterPass } = createExternalFilterFunctions(
    filterEnabled,
    minEquity as number,
    Number(minUpnl)
  );


  // Toggle bộ lọc
  const toggleFilter = () => setFilterEnabled((prev) => !prev);


  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="container-fluid">
      <div style={{ marginBottom: "1rem", marginLeft: "16px" }}>
  
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
                setMinUpnl(value);
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
          className={`filter-button ${
            filterEnabled ? "filter-disabled" : "filter-enabled"
          }`}
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
          cacheBlockSize={GRID_CONFIG.CACHE_BLOCK_SIZE}
          {...GRID_FEATURES}
          paginationPageSize={GRID_CONFIG.PAGINATION_PAGE_SIZE}
          domLayout="autoHeight"
          rowSelection="multiple"
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          onGridReady={onGridReady}
          onFilterChanged={onFilterChanged}
        />
      </div>
    </div>
  );
};

export default ViewDataPage;
