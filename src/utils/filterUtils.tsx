import { IRowNode } from "ag-grid-community";

export const parseNumericValue = (value: string | number): number => {
  if (typeof value === "string") {
    const cleanValue = value.replace(/[$,%]/g, "");
    return parseFloat(cleanValue) || 0;
  }
  return value || 0;
};

export const createExternalFilterFunctions = (
  filterEnabled: boolean,
  minEquity: number,
  minUpnl: number
) => ({
  isExternalFilterPresent: () => filterEnabled,
  
  doesExternalFilterPass: (node: IRowNode) => {
    if (!filterEnabled) return true;
    if (!node.data) return false;
    
    const equityValue = parseNumericValue(node.data["final_balance"]);
    const upnlValue = parseNumericValue(node.data["max_upnl"]);
    
    return equityValue >= minEquity && upnlValue >= minUpnl;
  }
});