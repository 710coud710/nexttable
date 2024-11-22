"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { IRowNode, GridApi, GridReadyEvent } from "ag-grid-community";
import { fetchData } from "@/action/fetchdata";
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

  // const columnDefs: ColDef<DataRow>[] = [
  //   { headerName: "Year", field: "Year", filter: "agSetColumnFilter" },
  //   { headerName: "Coin", field: "Coin", filter: "agSetColumnFilter" },
  //   { headerName: "Container", field: "Container", filter: "agSetColumnFilter" },
  //   { headerName: "Max", field: "Max" },
  //   { headerName: "Leverage", field: "Leverage" },
  //   { headerName: "Reserve", field: "Reserve" },
  //   { headerName: "IR", field: "IR" },
  //   { headerName: "Account Name", field: "Account Name" },
  //   { headerName: "Status", field: "Status", filter: "agSetColumnFilter" },
  //   {
  //     headerName: "Final Equity",
  //     field: "Final Equity",
  //     filter: "agNumberColumnFilter",
  //     valueGetter: (params: ValueGetterParams) => {
  //       const finalEquity = params.data["Final Equity"];
  //       if (typeof finalEquity === "string") {
  //         return parseFloat(finalEquity.replace(/[$,]/g, ""));
  //       }
  //       return finalEquity;
  //     },
  //     valueFormatter: (params: { value: number }) => {
  //       if (params.value !== null && params.value !== undefined) {
  //         return `$${params.value.toLocaleString()}`;
  //       }
  //       return "";
  //     },
  //   },
  //   {
  //     headerName: "Max UPNL",
  //     field: "Max UPNL",
  //     valueGetter: (params: ValueGetterParams) => {
  //       const maxUpnl = params.data["Max UPNL"];
  //       if (typeof maxUpnl === "string") {
  //         //
  //         return parseFloat(maxUpnl.replace(/[%]/g, ""));
  //       }
  //       return maxUpnl;
  //     },
  //     valueFormatter: (params: { value: number }) => {
  //       if (params.value !== null && params.value !== undefined) {
  //         // Hiển thị dưới dạng phần trăm với 2 chữ số thập phân
  //         return `${(params.value ).toFixed(2)}%`;
  //       }
  //       return "";
  //     },
  //   },    
  //   { headerName: "Median Gain", field: "Median Gain" },
  //     { headerName: "75% Gain", field: "75% Gain" },
  //     { headerName: "95% Gain", field: "95% Gain" },
  //     { headerName: "98% Gain", field: "98% Gain" },
  //     { headerName: "99% Gain", field: "99% Gain" },
  //     { headerName: "5%", field: "5%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     },},
  //     { headerName: "10%", field: "10%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "15%", field: "15%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "20%", field: "20%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "25%", field: "25%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     },},
  //     { headerName: "30%", field: "30%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "35%", field: "35%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "40%", field: "40%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     },},
  //     { headerName: "45%", field: "45%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "50%", field: "50%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "55%", field: "55%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "60%", field: "60%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     },},
  //     { headerName: "65%", field: "65%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     },},
  //     { headerName: "70%", field: "70%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "75%", field: "75%",cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "80%", field: "80%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "85%", field: "85%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     },},
  //     { headerName: "90%", field: "90%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     },},
  //     { headerName: "95%", field: "95%", cellClassRules: {
  //       "min-value-cell": params => isMinValueInRange(params),
  //     }, },
  //     { headerName: "R:R", field: "R:R" },
  //     { headerName: "initial_risk", field: "initial_risk" },
  //     { headerName: "max_slots", field: "max_slots" },
  //     { headerName: "frame", field: "frame" },
  //     {
  //       headerName: "phases",
  //       field: "phases",
  //       valueGetter: (params: ValueGetterParams) => {
  //           try {
  //               return JSON.parse(params.data.phases).join(", ");
  //           } catch (error) {
  //               console.error("Error parsing phases:", error);
  //               return params.data.phases || "";
  //           }
  //       },
  //     },
  //     {
  //       headerName: "S",
  //       field: "S",
  //       valueGetter: (params: ValueGetterParams) => {
  //           try {
  //               return JSON.parse(params.data.S).join(", ");
  //           } catch (error) {
  //               console.error("Error parsing S:", error);
  //               return params.data.S || "";
  //           }
  //       },
  //     },
  // ];

  //fil màu cho các giá trị trị
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const isMinValueInRange = (params: any) => {
  //   const rowData = params.data;
  //   const columns = ["5%", "10%", "15%", "20%", "25%", "30%", "35%", "40%", "45%", "50%", "55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "95%"];
  //   // const values = columns.map(col => parseFloat(rowData[col]));
  //   // const allZero = values.every(value => value === 0);
  //   // if (allZero) {
  //   //   return params.colDef.field === "5%";
  //   // }
  
  //   // 0.4 đến 3.5
  //   const validValues = columns
  //     .map((col, index) => ({ value: parseFloat(rowData[col]), index, column: col }))
  //     .filter(item => item.value >= 0.4 && item.value <= 3.5);
  
  //   let minValueColumn;
  
  //   if (validValues.length > 0) {
  //     const minValue = Math.min(...validValues.map(item => item.value)); //lấy giá trị nhỏ nhất
  //     minValueColumn = validValues.find(item => item.value === minValue)?.column; // lấy giá trị ở ô % nhỏ nhất

  //   } else {  //lấy giá trị nhỏ nhất >0 nếu ko trong khoảng
  //     const positiveValues = columns
  //       .map((col, index) => ({ value: parseFloat(rowData[col]), index, column: col }))
  //       .filter(item => item.value > 0);
  
  //     if (positiveValues.length > 0) {
  //       const minValue = Math.min(...positiveValues.map(item => item.value));
  //       minValueColumn = positiveValues.find(item => item.value === minValue)?.column;
  //     } else {
  //       minValueColumn = "5%"; //điều kiện cuối nếu tất cả  = 0 thì trả về cột 5%
  //     }
  //   }
  
  //   // Trả về true nếu cột hiện tại là cột có giá trị nhỏ nhất
  //   return params.colDef.field === minValueColumn;
  // };
  
  
  //filter lọc các giá trị 
  const isExternalFilterPresent = () => {
    return filterEnabled; 
  };

  const doesExternalFilterPass = (node: IRowNode) => {
    if (!filterEnabled) return true; 
    const finalEquity = node.data["Final Equity"];
    const equityValue =
      typeof finalEquity === "string"
        ? parseFloat(finalEquity.replace(/[$,]/g, "")) || 0
        : finalEquity || 0;

    const maxUpnl = node.data["Max UPNL"];
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
