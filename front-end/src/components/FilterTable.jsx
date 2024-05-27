import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Swal from "sweetalert2";

const deleteRow = (inventoryID) => {
  axios
    .delete(`http://localhost:3001/deletestock/${inventoryID}`)
    .then((response) => {
      console.log(inventoryID,"Row deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting row:", error);
    });
};

const styles = `
  .MuiDataGrid-cell:focus-within {
    outline: none !important;
    border: none !important;
  }
`;

const deletePopup = (inventoryID) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteRow(inventoryID); // Call the callback function after confirmation
      Swal.fire({
        title: "Deleted!",
        text: "Row has been deleted.",
        icon: "success",
      }).then(() => {
        window.location.reload(); // Reload the page after successful deletion
      });
    }
  });
};

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

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'Product_Name', headerName: 'Product Name', width: 200 },
    { field: 'Stock_Arrival', headerName: 'Stock Arrival', width: 200 },
    { field: 'Supplier', headerName: 'Supplier', width: 150 },
    { field: 'Purchase_Date', headerName: 'Received Date', type: 'date', width: 150 },
    { field: 'Expire_Date', headerName: 'Expire Date', type: 'date', width: 150 },
    { field: 'Batch_No', headerName: 'Batch Number', width: 150 },
    { 
      field: 'actions', 
      headerName: '', 
      width: 300, 
      disableColumnMenu: true, 
      renderCell: (params) => (
        <Box display="flex" justifyContent="flex-end" width="100%">
          <Button variant="outlined" onClick={() => handleEditClick(params.row.id)}>Edit</Button>
          <Button variant="outlined" onClick={() => deletePopup(params.row.id)} style={{ marginLeft: 8 }}>Delete</Button>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ height: 480, width: '100%' }}>
      <style>{styles}</style>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
}
