"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { IRowNode, GridApi, GridReadyEvent } from "ag-grid-community";
import { columnDefs } from "../../columnDefs"; 
import { DataRow } from "../../pagetype";

// Interface cho Params
interface Params {
  collectionName: string;
  name: string;
}

// Kiểu cho Props của ViewDataPage
interface ViewDataPageProps {
  params: Params;
}

const ViewDataPage: React.FC<ViewDataPageProps> = ({ params }) => {
  const { collectionName, name } = params;

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
      const response = await fetch("http://27.72.246.67:8710/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection_name: name }),
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch data");
      }
    } catch (err) {
      setError("Error fetching data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [name]);

  // Fetch dữ liệu khi collectionName hoặc name thay đổi
  useEffect(() => {
    fetchData();
  }, [collectionName, name, fetchData]);

  // Sự kiện khi Grid đã sẵn sàng
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

  // Default column definition cho AgGrid
  const defaultColDef = useMemo(() => ({
    filter: true,
    sortable: true,
    resizable: true,
  }), []);

  // Kiểm tra có bộ lọc ngoài hay không
  const isExternalFilterPresent = () => filterEnabled;

  // Hàm kiểm tra bộ lọc ngoài
  const doesExternalFilterPass = (node: IRowNode) => {
    if (!filterEnabled) return true;

    const finalEquity = node.data["fina_balance"];
    const equityValue = typeof finalEquity === "string"
      ? parseFloat(finalEquity.replace(/[$,]/g, "")) || 0
      : finalEquity || 0;

    const maxUpnl = node.data["max_upnl"];
    const upnlValue = typeof maxUpnl === "string"
      ? parseFloat(maxUpnl.replace(/[%]/g, "").replace(/,/g, "")) || 0
      : maxUpnl || 0;

    return equityValue >= minEquity && upnlValue >= minUpnl;
  };

  // Toggle bộ lọc
  const toggleFilter = () => setFilterEnabled((prev) => !prev);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="container-fluid">
      <div style={{ marginBottom: "1rem", marginLeft: "16px" }}>
        <h2>Collection: {collectionName}</h2>
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

export default ViewDataPage;
