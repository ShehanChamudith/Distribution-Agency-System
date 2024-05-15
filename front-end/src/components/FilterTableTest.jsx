import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function DataGridDemo() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getstock")
      .then((response) => {
        console.log("Response Data:", response.data);
        const mappedRows = response.data.map((item) => ({
            id: item.inventoryID, // Assuming inventoryID is unique
            Product_Name: item.product_name, 
            Stock_Arrival: item.stock_arrival,
            Supplier: item.supplier_company,
            Purchase_Date: new Date(item.formatted_purchase_date), // Transform to Date object
          Expire_Date: new Date(item.formatted_expire_date),
            Batch_No: item.batch_no,
          // Assuming other columns are not needed for now
        }));
        setRows(mappedRows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'Product_Name', headerName: 'Product Name', width: 150 },
    { field: 'Stock_Arrival', headerName: 'Stock Arrival', type: 'number', width: 150 },
    { field: 'Supplier', headerName: 'Supplier', width: 150 },
    { field: 'Purchase_Date', headerName: 'Received Date', type: 'date', width: 150 },
    { field: 'Expire_Date', headerName: 'Expire Date', type: 'date', width: 150 },
    { field: 'Batch_No', headerName: 'Batch Number', width: 150 },
  ];

  return (
    <Box sx={{ height: 450, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5} // Use pageSize instead of initialState for simplicity
        checkboxSelection
        disableSelectionOnClick
        slots={{
          toolbar: GridToolbar, // Use GridToolbar for the filter toolbar
        }}
      />
    </Box>
  );
}



