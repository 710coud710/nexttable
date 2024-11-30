"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { IRowNode, GridApi, GridReadyEvent } from "ag-grid-community";
import { fetchData } from "@/api/fetchdata";
import { columnDefs } from "./columnDefs";


import { DataRow } from "./pagetype";

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
    params.api.sizeColumnsToFit(); // Automatically adjust columns to fit grid size
  };



  const onFilterChanged = () => {
    if (gridApiRef.current) {
      setResultCount(gridApiRef.current.getDisplayedRowCount());
    }
  };

  const defaultColDef = useMemo(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
    }),
    []
  );

  //filter lọc các giá trị 
  const isExternalFilterPresent = () => {
    return filterEnabled; 
  };

  const doesExternalFilterPass = (node: IRowNode) => {
    if (!filterEnabled) return true; 
    const finalEquity = node.data["fina_balance"];
    const equityValue =
      typeof finalEquity === "string"
        ? parseFloat(finalEquity.replace(/[$,]/g, "")) || 0
        : finalEquity || 0;

    const maxUpnl = node.data["max_upnl"];
    const upnlValue =
      typeof maxUpnl === "string"
        ? parseFloat(maxUpnl.replace(/[%]/g, "").replace(/,/g, "")) || 0
        : maxUpnl || 0;
    
    return equityValue >= minEquity && upnlValue >= minUpnl;
  };

  const toggleFilter = () => {
    setFilterEnabled((prev) => !prev);
  };
  
  
  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

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
      {/* {filterEnabled && (
        <span style={{ marginLeft: "16px" ,fontSize: "22px"}}>
           results found: {resultCount}
        </span>
      )} */}
      
      <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
        <AgGridReact<DataRow>
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          enableCharts={true}
          pagination={true}
          paginationPageSize={20}
          domLayout="autoHeight"
          cacheBlockSize={20}
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

export default DataTable;
