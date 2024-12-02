export const DEFAULT_COL_DEF = {
    filter: true,
    sortable: true,
    resizable: true,
  };
  
  export const GRID_CONFIG = {
    PAGINATION_PAGE_SIZE: 20,
    CACHE_BLOCK_SIZE: 20,
    DEFAULT_MIN_EQUITY: 130000,
    DEFAULT_MIN_UPNL: -30,
  };
  
  export const GRID_FEATURES = {
    enableRangeSelection: true,
    enableCharts: true,
    pagination: true,
    domLayout: "autoHeight" as const,
    rowSelection: "multiple" as const,
  };