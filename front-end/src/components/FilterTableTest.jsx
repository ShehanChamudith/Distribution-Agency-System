import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

export default function DataGridDemo() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getstock")
      .then((response) => {
        //console.log("Response Data:", response.data);
        const mappedRows = response.data.map((item) => ({
          id: item.inventoryID,
          Product_Name: item.product_name, 
          Stock_Arrival: item.stock_arrival + ' kg',
          Supplier: item.supplier_company,
          Purchase_Date: new Date(item.formatted_purchase_date),
          Expire_Date: new Date(item.formatted_expire_date),
          Batch_No: item.batch_no,
        }));
        setRows(mappedRows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEditClick = (rowId) => {
    // Implement edit logic here
    console.log("Edit clicked for row ID:", rowId);
  };

  const handleDeleteClick = (rowId) => {
    // Implement delete logic here
    console.log("Delete clicked for row ID:", rowId);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'Product_Name', headerName: 'Product Name', width: 200 },
    { field: 'Stock_Arrival', headerName: 'Stock Arrival', type: 'number', width: 100, align: 'left' },
    { field: 'Supplier', headerName: 'Supplier', width: 200 },
    { field: 'Purchase_Date', headerName: 'Received Date', type: 'date', width: 200 },
    { field: 'Expire_Date', headerName: 'Expire Date', type: 'date', width: 150 },
    { field: 'Batch_No', headerName: 'Batch Number', width: 150 },
    { field: 'actions', headerName: '', width: 300, renderCell: (params) => (
        <div className=' flex gap-3 items-center h-full'>
          <Button variant="outlined" onClick={() => handleEditClick(params.row.id)}>Edit</Button>
          <Button variant="outlined" onClick={() => handleDeleteClick(params.row.id)}>Delete</Button>
        </div>
      )}
  ];

  return (
    <Box sx={{ height: 480, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        //checkboxSelection
        disableSelectionOnClick
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Box>
  );
}
