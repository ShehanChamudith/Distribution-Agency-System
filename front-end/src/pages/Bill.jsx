import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";

export const Bill = () => {
  const [alignment, setAlignment] = React.useState("All");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [quantity, setQuantity] = React.useState("");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const styles = `
  .MuiDataGrid-cell:focus-within {
    outline: none !important;
    border: none !important;
  }
`;

  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/inventory")
      .then((response) => {
        //console.log("Response Data:", response.data);
        const mappedRows = response.data.map((item) => ({
          id: item.productID,
          Product_Name: item.product_name,
          Available_Stock: item.stock_total,
          Supplier: item.supplier_company,
          Selling_Price: item.selling_price,
          Image_URL: `http://localhost:3001/${item.image_path}`,
        }));
        setRows(mappedRows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const deleteRow = (inventoryID) => {
    axios
      .delete(`http://localhost:3001/deletestock/${inventoryID}`)
      .then((response) => {
        console.log(inventoryID, "Row deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting row:", error);
      });
  };

  const handleAddClick = (rowId, event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleAddToBill = () => {
    console.log("Quantity:", quantity);
    setQuantity("");
    setAnchorEl(null);
  };

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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const columns = [
    {
      field: "Image_URL",
      headerName: "Image",
      width: 100,
      renderHeader: (params) => (
        <div style={{ textAlign: "center" }}>{params.headerName}</div>
      ),
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={params.value}
            alt="Product"
            style={{ width: 50, height: 50 }}
          />
        </div>
      ),
    },
    { field: "Product_Name", headerName: "Product Name", width: 130 },
    { field: "Available_Stock", headerName: "Stock Qty (kg)", width: 130 },
    { field: "Supplier", headerName: "Supplier", width: 130 },
    { field: "Selling_Price", headerName: "Selling Price (LKR)", width: 130 },
    {
      field: "actions",
      headerName: "",
      width: 150,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className=" flex gap-3 items-center h-full">
          <Button
            variant="outlined"
            onClick={(event) => handleAddClick(params.row.id, event)}
          >
            Add to Bill
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            slotProps={{
              paper: {
                style: { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <div className="flex gap-5">
                <div>
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    value={quantity}
                    onChange={handleQuantityChange}
                    autoFocus
                  />
                </div>
                <div>
                  <Button
                    className="h-14"
                    variant="contained"
                    onClick={handleAddToBill}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </Box>
          </Popover>
        </div>
      ),
    },
  ];

  const CustomToolbar = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.5rem",
        }}
      >
        <GridToolbarFilterButton />
        <GridToolbarQuickFilter />
      </div>
    );
  };

  return (
    <div className="flex flex-col w-screen ">
      <div className="w-screen flex py-10">
        <div className="flex w-1/2 h-full pl-10 gap-10  ">
          <div>
            <Button
              variant="contained"
              className="h-12"
              disabled
              style={{
                pointerEvents: "none",
                backgroundColor: "#1976d2",
                color: "white",
              }}
            >
              Filter by Category
            </Button>
          </div>

          <div>
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
            >
              <ToggleButton value="All">All</ToggleButton>
              <ToggleButton value="Chicken">Chicken</ToggleButton>
              <ToggleButton value="Chicken Parts">Chicken Parts</ToggleButton>
              <ToggleButton value="Pork">Pork</ToggleButton>
              <ToggleButton value="Sausages">Sausages</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>

        <div className="flex w-1/2 pr-10 justify-end gap-9 "></div>
      </div>

      <div className="w-screen  px-10">
        <div className="w-3/5">
          <Box sx={{ height: 480, width: "100%" }}>
            <style>{styles}</style>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
              
              slots={{
                toolbar: CustomToolbar,
              }}
              sx={{
                "& .MuiDataGrid-cell": {
                  border: "none",
                },
              }}
            />
          </Box>
        </div>

        <div></div>
      </div>
    </div>
  );
};
