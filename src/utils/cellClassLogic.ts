

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isMinValueInRange = (params: any) => {
    const rowData = params.data;
    const columns = ["5%", "10%", "15%", "20%", "25%", "30%", "35%", "40%", "45%", "50%", "55%", "60%", "65%", "70%", "75%", "80%", "85%", "90%", "95%"];
    // const values = columns.map(col => parseFloat(rowData[col]));
    // const allZero = values.every(value => value === 0);
    // if (allZero) {
    //   return params.colDef.field === "5%";
    // }
  
    // 0.4 đến 3.5
    const validValues = columns
      .map((col, index) => ({ value: parseFloat(rowData[col]), index, column: col }))
      .filter(item => item.value >= 0.4 && item.value <= 3.5);
  
    let minValueColumn;
  
    if (validValues.length > 0) {
      const minValue = Math.min(...validValues.map(item => item.value)); //lấy giá trị nhỏ nhất
      minValueColumn = validValues.find(item => item.value === minValue)?.column; // lấy giá trị ở ô % nhỏ nhất

    } else {  //lấy giá trị nhỏ nhất >0 nếu ko trong khoảng
      const positiveValues = columns
        .map((col, index) => ({ value: parseFloat(rowData[col]), index, column: col }))
        .filter(item => item.value > 0);
  
      if (positiveValues.length > 0) {
        const minValue = Math.min(...positiveValues.map(item => item.value));
        minValueColumn = positiveValues.find(item => item.value === minValue)?.column;
      } else {
        minValueColumn = "5%"; //điều kiện cuối nếu tất cả  = 0 thì trả về cột 5%
      }
    }
  
    // Trả về true nếu cột hiện tại là cột có giá trị nhỏ nhất
    return params.colDef.field === minValueColumn;
  };
  