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
          lastName: item.product_name,
          firstName: item.supplier_company,
          age: item.stock_arrival,
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
    { field: 'lastName', headerName: 'Product Name', width: 150 },
    { field: 'firstName', headerName: 'Supplier Company', width: 150 },
    { field: 'age', headerName: 'Stock Arrival', type: 'number', width: 110 },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
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
