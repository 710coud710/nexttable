"use servers"


export const fetchData = async () => {
    try {
      const response = await fetch("http://27.72.246.67:8710/api/data1");
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      return result;
    } catch (err) {
     
      console.error("Error fetching data:", err);
    } 
  };
