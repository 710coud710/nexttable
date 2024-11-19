"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { ValueGetterParams, ColDef, IRowNode } from "ag-grid-community";
import { fetchData } from "@/action/fetchdata";

import { DataRow } from "./pagetype";

// type DataRow = {
//   [key: string]: string | number; 
// };

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEnabled, setFilterEnabled] = useState<boolean>(false); 


  
  // Fetch data từ API
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData()
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

  const defaultColDef = useMemo(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
    }),
    []
  );

  const columnDefs: ColDef<DataRow>[] = [    //thieu eny ở sau datarow
    { headerName: "Year", field: "Year", filter: "agSetColumnFilter" },
      { headerName: "Coin", field: "Coin" ,  filter: "agSetColumnFilter"},
      { headerName: "Container", field: "Container", filter: "agSetColumnFilter" },
      { headerName: "Max", field: "Max"  },
      { headerName: "Leverage", field: "Leverage" },
      { headerName: "Reserve", field: "Reserve" },
      { headerName: "IR", field: "IR" },
      { headerName: "Account Name", field: "Account Name" },
      { headerName: "Status", field: "Status" , filter: "agSetColumnFilter"},
      {
        headerName: "Final Equity",
        field: "Final Equity",
        filter: "agNumberColumnFilter",
        valueGetter: (params: ValueGetterParams) => {
          const finalEquity = params.data["Final Equity"];
          if (typeof finalEquity === "string") {
            return parseFloat(finalEquity.replace(/[$,]/g, ""));
          }
          return finalEquity;
        },
        valueFormatter: (params: { value: number }) => {
          if (params.value !== null && params.value !== undefined) {
            return `$${params.value.toLocaleString()}`;
          }
          return "";
        },
      },
      {
        headerName: "Max UPNL",
        field: "Max UPNL",
        valueGetter: (params: ValueGetterParams) => {
          const maxUpnl = params.data["Max UPNL"];
          if (typeof maxUpnl === "string") {
            return (
              parseFloat(maxUpnl.replace(/[%]/g, "").replace(/,/g, "")) / 100
            );
          }
          return maxUpnl;
        },
        valueFormatter: (params: { value: number }) => {
          if (params.value !== null && params.value !== undefined) {
            return `${(params.value * 100).toFixed(2)}%`;
          }
          return "";
        },
      },
      { headerName: "Median Gain", field: "Median Gain" },
      { headerName: "75% Gain", field: "75% Gain" },
      { headerName: "95% Gain", field: "95% Gain" },
      { headerName: "98% Gain", field: "98% Gain" },
      { headerName: "99% Gain", field: "99% Gain" },
      { headerName: "5%", field: "5%" },
      { headerName: "10%", field: "10%" },
      { headerName: "15%", field: "15%" },
      { headerName: "20%", field: "20%" },
      { headerName: "25%", field: "25%" },
      { headerName: "30%", field: "30%" },
      { headerName: "35%", field: "35%" },
      { headerName: "40%", field: "40%" },
      { headerName: "45%", field: "45%" },
      { headerName: "50%", field: "50%" },
      { headerName: "55%", field: "55%" },
      { headerName: "60%", field: "60%" },
      { headerName: "65%", field: "65%" },
      { headerName: "70%", field: "70%" },
      { headerName: "75%", field: "75%" },
      { headerName: "80%", field: "80%" },
      { headerName: "85%", field: "85%" },
      { headerName: "90%", field: "90%" },
      { headerName: "95%", field: "95%" },
      { headerName: "R:R", field: "R:R" },
      { headerName: "initial_risk", field: "initial_risk" },
      { headerName: "max_slots", field: "max_slots" },
      { headerName: "frame", field: "frame" },
      {
        headerName: "phases",
        field: "phases",
        valueGetter: (params: ValueGetterParams) => {
            try {
                return JSON.parse(params.data.phases).join(", ");
            } catch (error) {
                console.error("Error parsing phases:", error);
                return params.data.phases || "";
            }
        },
      },
      {
        headerName: "S",
        field: "S",
        valueGetter: (params: ValueGetterParams) => {
            try {
                return JSON.parse(params.data.S).join(", ");
            } catch (error) {
                console.error("Error parsing S:", error);
                return params.data.S || "";
            }
        },
      },
  ];

  const isExternalFilterPresent = () => {
    return filterEnabled; // Kích hoạt khi bộ lọc được bật
  };

  const doesExternalFilterPass = (node: IRowNode) => {
    if (!filterEnabled) return true; // Nếu không bật bộ lọc, trả về tất cả

    const finalEquity = node.data["Final Equity"];
    const equityValue =
      typeof finalEquity === "string"
        ? parseFloat(finalEquity.replace(/[$,]/g, "")) || 0
        : finalEquity || 0; // Tránh giá trị null/undefined

    const maxUpnl = node.data["Max UPNL"];
    const upnlValue =
      typeof maxUpnl === "string"
        ? parseFloat(maxUpnl.replace(/[%]/g, "").replace(/,/g, "")) / 100 || 0
        : maxUpnl || 0; // Tránh giá trị null/undefined

    return equityValue >= 120000 && upnlValue >= -0.30;
  };



  const toggleFilter = () => {
    setFilterEnabled((prev) => !prev); 
  };


  // const toggleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilterEnabled(event.target.checked); 
  // };
  
  
  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid">
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={toggleFilter}  style={{ fontSize:"15px" }}>
          {filterEnabled
            ? "Final Equity (>=120,000) & MAX UPNL(>=-30%) ✓"
            : "Final Equity (>=120,000) & MAX UPNL(>=-30%) ✕ "
            }
        </button>
      </div>
      {/* <div style={{ marginBottom: "1rem" }}>
        <label >
         <a style={{ color: "black", marginRight: "8px", fontSize:"20px" }}>     Final Equity >= 120,000 & MAX UPNL >= -30% </a>
            
          <input
            type="checkbox"
            checked={filterEnabled}
            onChange={toggleFilter}
            
          />
          
        </label>
      </div> */}

      <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
        <AgGridReact<DataRow>
          // rowData={data}
          // columnDefs={columnDefs}
          // defaultColDef={defaultColDef}
          // pagination={true}
          // domLayout="autoHeight"
          // rowSelection="single"
          // isExternalFilterPresent={isExternalFilterPresent}
          // doesExternalFilterPass={doesExternalFilterPass}
          // onFilterChanged={() => {
          //   console.log("External filter changed");
          // }}
       
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
        />
      </div>
    </div>
  );
};

export default DataTable;