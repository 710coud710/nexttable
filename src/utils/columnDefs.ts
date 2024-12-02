import { ColDef, ValueGetterParams } from "ag-grid-community";
import { isMinValueInRange } from "./cellClassLogic";
import { DataRow } from "./pagetype";

// Tạo hàm helper để tạo cấu hình cho các cột số cần làm tròn 2 chữ số thập phân
const createNumberColumn = (headerName: string, field: string, options: Partial<ColDef> = {}): ColDef => ({
  headerName,
  field,
  valueGetter: (params: ValueGetterParams) => {
    const value = params.data[field];
    return Number(Number(value).toFixed(2));
  },
  valueFormatter: (params: { value: number }) => {
    if (params.value !== null && params.value !== undefined) {
      return params.value.toFixed(2);
    }
    return "";
  },
  ...options
});

// Danh sách các cột cần định dạng số
const percentageColumns = [
  "median_gain",
  "75% Gain",
  "95% Gain",
  "98% Gain",
  "99% Gain",
  "5%",
  "10%",
  "15%",
  "20%",
  "25%",
  "30%",
  "35%",
  "40%",
  "45%",
  "50%",
  "55%",
  "60%",
  "65%",
  "70%",
  "75%",
  "80%",
  "85%",
  "90%",
  "95%",
  "RR"
];

// Hàm helper cho cột final_balance (làm tròn đến số nguyên)
const createCurrencyColumn = (headerName: string, field: string): ColDef => ({
  headerName,
  field,
  valueGetter: (params: ValueGetterParams) => {
    const value = params.data[field];
    if (typeof value === "string") {
      return Math.round(parseFloat(value.replace(/[$,]/g, "")));
    }
    return Math.round(value);
  },
  valueFormatter: (params: { value: number }) => {
    if (params.value !== null && params.value !== undefined) {
      return `$${params.value.toLocaleString()}`;
    }
    return "";
  },
});

// Hàm helper cho cột max_upnl (làm tròn 2 chữ số thập phân và thêm %)
const createPercentageColumn = (headerName: string, field: string): ColDef => ({
  headerName,
  field,
  valueGetter: (params: ValueGetterParams) => {
    const value = params.data[field];
    if (typeof value === "string") {
      return Number(parseFloat(value.replace(/[%]/g, "")).toFixed(2));
    }
    return Number(value.toFixed(2));
  },
  valueFormatter: (params: { value: number }) => {
    if (params.value !== null && params.value !== undefined) {
      return `${params.value.toFixed(2)}%`;
    }
    return "";
  },
});

export const columnDefs: ColDef<DataRow>[] = [
  { headerName: "container", field: "container", filter: "agSetColumnFilter" },
  { headerName: "account_name", field: "account_name" },
  { headerName: "strategies", field: "strategies" },
  { headerName: "max_slots", field: "max_slots" },
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
  { headerName: "rsi_wma_day", field: "rsi_wma_day" },
  { headerName: "leverage", field: "leverage" },
  { headerName: "year", field: "year", filter: "agSetColumnFilter" },
  { headerName: "coin", field: "coin", filter: "agSetColumnFilter" },
  { headerName: "reserve", field: "reserve" },
  { headerName: "ir", field: "ir" },
  { headerName: "max_sizing", field: "max_sizing" },
  createCurrencyColumn("final_balance", "final_balance"),
  createPercentageColumn("max_upnl", "max_upnl"),
  
  // Tạo tự động các cột số
  ...percentageColumns.map(field => createNumberColumn(field, field, {
    cellClassRules: field.includes('%') ? {
      "min-value-cell": params => isMinValueInRange(params)
    } : undefined
  })),
  { headerName: "alpha_ruin", field: "alpha_ruin" },
  { headerName: "worst_ruin", field: "worst_ruin" },
];