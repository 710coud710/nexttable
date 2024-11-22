import { ColDef, ValueGetterParams } from "ag-grid-community";
import { isMinValueInRange } from "./cellClassLogic";
import { DataRow } from "./pagetype";

export const columnDefs: ColDef<DataRow>[] = [
    { headerName: "Year", field: "Year", filter: "agSetColumnFilter" },
    { headerName: "Coin", field: "Coin", filter: "agSetColumnFilter" },
    { headerName: "Container", field: "Container", filter: "agSetColumnFilter" },
    { headerName: "Max", field: "Max" },
    { headerName: "Leverage", field: "Leverage" },
    { headerName: "Reserve", field: "Reserve" },
    { headerName: "IR", field: "IR" },
    { headerName: "Account Name", field: "Account Name" },
    { headerName: "Status", field: "Status", filter: "agSetColumnFilter" },
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
          //
          return parseFloat(maxUpnl.replace(/[%]/g, ""));
        }
        return maxUpnl;
      },
      valueFormatter: (params: { value: number }) => {
        if (params.value !== null && params.value !== undefined) {
          // Hiển thị dưới dạng phần trăm với 2 chữ số thập phân
          return `${(params.value ).toFixed(2)}%`;
        }
        return "";
      },
    },    
    { headerName: "Median Gain", field: "Median Gain" },
      { headerName: "75% Gain", field: "75% Gain" },
      { headerName: "95% Gain", field: "95% Gain" },
      { headerName: "98% Gain", field: "98% Gain" },
      { headerName: "99% Gain", field: "99% Gain" },
      { headerName: "5%", field: "5%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      },},
      { headerName: "10%", field: "10%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "15%", field: "15%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "20%", field: "20%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "25%", field: "25%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      },},
      { headerName: "30%", field: "30%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "35%", field: "35%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "40%", field: "40%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      },},
      { headerName: "45%", field: "45%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "50%", field: "50%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "55%", field: "55%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "60%", field: "60%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      },},
      { headerName: "65%", field: "65%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      },},
      { headerName: "70%", field: "70%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "75%", field: "75%",cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "80%", field: "80%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
      { headerName: "85%", field: "85%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      },},
      { headerName: "90%", field: "90%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      },},
      { headerName: "95%", field: "95%", cellClassRules: {
        "min-value-cell": params => isMinValueInRange(params),
      }, },
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