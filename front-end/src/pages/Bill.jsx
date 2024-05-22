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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import porkIcon from "../assets/icons/pork.ico";
import chickenIcon from "../assets/icons/hen.ico";
import cpartIcon from "../assets/icons/food.ico";
import sausageIcon from "../assets/icons/sausages.ico";

export const Bill = () => {
  const [alignment, setAlignment] = React.useState("All");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [quantity, setQuantity] = React.useState("");
  const [category, setCategory] = useState("All");
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(true);
  const [openNewCustomerDialog, setOpenNewCustomerDialog] = useState(false);
  const [openExistingCustomerDialog, setOpenExistingCustomerDialog] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [customerData, setcustomerData] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    usertypeID: 6,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState({});

  const handleChangeForm = (event) => {
    const { name, value } = event.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setcustomerData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleExistingCustomerChange = (event) => {
    setSelectedCustomer(event.target.value);
  };

  const handleDialogClose = () => {
    // Do nothing if the new or existing customer dialogs are not open
    if (!openNewCustomerDialog && !openExistingCustomerDialog) {
      Swal.fire({
        icon: "warning",
        title: "Please select a customer type",
        text: "You need to select either 'New Customer' or 'Existing Customer' to proceed.",
        customClass: {
          popup: "z-50",
        },
        didOpen: () => {
          document.querySelector(".swal2-container").style.zIndex = "9999";
        },
      });
      return;
    }
    setOpenDialog(false);
  };

  const handleExistingCustomer = () => {
    console.log("Existing customer selected");
    setOpenDialog(false);
    setOpenExistingCustomerDialog(true);
  };

  const handleNewCustomer = () => {
    console.log("New customer selected");
    setOpenDialog(false);
    setOpenNewCustomerDialog(true);
  };

  const handleNewCustomerDialogClose = () => {
    setOpenNewCustomerDialog(false);
  };

  const handleExistingCustomerDialogClose = () => {
    setOpenExistingCustomerDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (customerData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Handle form submission, e.g., send data to the server
    axios
      .post("http://localhost:3001/adduser", customerData)
      .then((response) => {
        console.log("Customer added successfully:", response.data);
        setOpenNewCustomerDialog(false);
        // Clear form fields
        setcustomerData({
          username: "",
          password: "",
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          address: "",
          area: "",
          usertypeID: 6,
        });
        setConfirmPassword("");

        Swal.fire({
          icon: "success",
          title: "Customer Added Successfully!",
          customClass: {
            popup: "z-50",
          },
          didOpen: () => {
            document.querySelector(".swal2-container").style.zIndex = "9999";
          },
        }).then(() => {
          handleClose();
          fetchCustomer(); // Call fetchCustomer to update the existing customers
        });
      })
      .catch((error) => {
        console.error("Error adding customer:", error);
      });
  };

  const handleExistingCustomerSubmit = () => {
    console.log("Selected customer:", selectedCustomer);
    setOpenExistingCustomerDialog(false);
    // Find the selected customer's information based on the selectedCustomer value
    const customer = existingCustomers.find(
      (customer) => customer.shop_name === selectedCustomer
    );
    setSelectedCustomerInfo(customer); // Update the selected customer's information
  };

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    setCategory(newAlignment);
  };

  const styles = `
  .MuiDataGrid-cell:focus-within {
    outline: none !important;
    border: none !important;
  }
`;

  useEffect(() => {
    axios
      .get("http://localhost:3001/inventory")
      .then((response) => {
        let filteredData = response.data;

        // Filter items based on category
        if (category && category !== "All") {
          filteredData = filteredData.filter(
            (item) => item.category === category
          );
        }

        const mappedRows = filteredData.map((item) => ({
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
  }, [category]);

  const fetchCustomer = () => {
    axios
      .get("http://localhost:3001/getcustomer") // Adjust the endpoint as needed
      .then((response) => {
        setExistingCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching existing customers:", error);
      });
  };

  useEffect(() => {
    if (openExistingCustomerDialog) {
      fetchCustomer();
    }
  }, [openExistingCustomerDialog]);

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
    { field: "Product_Name", headerName: "Product Name", width: 150 },
    { field: "Available_Stock", headerName: "Stock Qty (kg)", width: 150 },
    { field: "Supplier", headerName: "Supplier", width: 150 },
    { field: "Selling_Price", headerName: "Selling Price (LKR)", width: 150 },
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
    <div className="flex w-screen ">
      {/* Dialog for customer selection */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Customer Selection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select whether the customer is an existing customer or a new
            customer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleExistingCustomer}
            sx={{ margin: 1 }}
          >
            Existing Customer
          </Button>
          <Button
            variant="contained"
            onClick={handleNewCustomer}
            sx={{ margin: 1 }}
          >
            New Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Customer  */}
      <Dialog
        open={openNewCustomerDialog}
        onClose={handleNewCustomerDialogClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new customer, please enter the details here.
          </DialogContentText>

          <TextField
            label="Username"
            name="username"
            variant="filled"
            fullWidth
            margin="normal"
            value={customerData.username}
            onChange={handleChangeForm}
          />
          <div className="flex gap-5">
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="filled"
              fullWidth
              margin="normal"
              value={customerData.password}
              onChange={handleChangeForm}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="filled"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={handleChangeForm}
            />
          </div>
          <div className="flex gap-5">
            <TextField
              label="First Name"
              name="firstname"
              variant="filled"
              fullWidth
              margin="normal"
              value={customerData.firstname}
              onChange={handleChangeForm}
            />
            <TextField
              label="Last Name"
              name="lastname"
              variant="filled"
              fullWidth
              margin="normal"
              value={customerData.lastname}
              onChange={handleChangeForm}
            />
          </div>

          <TextField
            label="Email"
            name="email"
            type="email"
            variant="filled"
            fullWidth
            margin="normal"
            value={customerData.email}
            onChange={handleChangeForm}
          />
          <TextField
            label="Phone"
            name="phone"
            variant="filled"
            fullWidth
            margin="normal"
            value={customerData.phone}
            onChange={handleChangeForm}
          />
          <TextField
            label="Address"
            name="address"
            variant="filled"
            fullWidth
            margin="normal"
            value={customerData.address}
            onChange={handleChangeForm}
          />
          <TextField
            label="Area (Delivery Route)"
            name="area"
            variant="filled"
            fullWidth
            margin="normal"
            value={customerData.area}
            onChange={handleChangeForm}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewCustomerDialogClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add New Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Select Existing Customer  */}
      <Dialog
        open={openExistingCustomerDialog}
        onClose={handleExistingCustomerDialogClose}
      >
        <DialogTitle>Select Existing Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select an existing customer from the list.
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel id="existing-customer-label">Customer</InputLabel>
            <Select
              labelId="existing-customer-label"
              value={selectedCustomer}
              onChange={handleExistingCustomerChange}
              label="Customer"
            >
              {existingCustomers.map((customer) => (
                <MenuItem key={customer.customerID} value={customer.shop_name}>
                  {customer.shop_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExistingCustomerDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleExistingCustomerSubmit();
              console.log("Selected Customer:", selectedCustomer);
            }}
            variant="contained"
            color="primary"
          >
            Select Customer
          </Button>
        </DialogActions>
      </Dialog>

      <div className="w-3/5 flex flex-col  ">
        <div className="flex h-full pl-10 py-10 gap-10  ">
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
              <ToggleButton value="Chicken">
                <Box
                  component="img"
                  src={chickenIcon}
                  alt="chicken"
                  sx={{ width: 24, height: 24, marginRight: 1 }}
                />
                Chicken
              </ToggleButton>
              <ToggleButton value="Chicken Parts">
                <Box
                  component="img"
                  src={cpartIcon}
                  alt="chicken_part"
                  sx={{ width: 24, height: 24, marginRight: 1 }}
                />
                Chicken Parts
              </ToggleButton>
              <ToggleButton value="Pork">
                <Box
                  component="img"
                  src={porkIcon}
                  alt="pork"
                  sx={{ width: 24, height: 24, marginRight: 1 }}
                />
                Pork
              </ToggleButton>
              <ToggleButton value="Sausages">
                <Box
                  component="img"
                  src={sausageIcon}
                  alt="sausages"
                  sx={{ width: 24, height: 24, marginRight: 1 }}
                />
                Sausages
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>

        <div className=" flex w-full pl-10 ">
          <Box sx={{ height: 480, width: "100%" }}>
            <style>{styles}</style>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
              hideFooter
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
      </div>

      <div className="w-2/5 h-[84vh]  px-10 pt-10">
        <div className=" rounded-md bg-slate-200 w-full h-full border border-red-500 p-5">
          <div className="border border-green-500">
            {selectedCustomerInfo && (
              <p className="text-md font-PoppinsM">Customer: {selectedCustomerInfo.shop_name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
