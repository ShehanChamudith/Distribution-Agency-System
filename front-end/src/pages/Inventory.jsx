import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
//import moment from "moment";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

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

function Inventory({ userInfo }) {
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [productS, setProductS] = React.useState("");
  const [supplierS, setsupplierS] = React.useState("");
  const [product, setProduct] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [formData, setFormData] = useState({ wstaffID: 2 });
  //const [dateRange, setDateRange] = useState([]);
  const [rows, setRows] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);


  const getDataForRow = (rowId) => {
    return rows.find((row) => row.id === rowId);
  };
  

  const handleEditClick = (rowId) => {
    const rowData = getDataForRow(rowId);
  
    setFormData({
      id: rowData.id,
      productname: rowData.Product_Name,
      supplier: rowData.Supplier,
      stock_arrival: rowData.Stock_Arrival.replace(" kg", ""),
      purchase_date: rowData.Purchase_Date.toISOString().split("T")[0],
      expire_date: rowData.Expire_Date.toISOString().split("T")[0],
      batch_no: rowData.Batch_No,
    });
  
    setProductS(rowData.Product_Name);
    setsupplierS(rowData.Supplier);
    setIsEditMode(true);
    setOpenEdit(true);
  };
  

  const userRole = userInfo;

  useEffect(() => {
    axios
      .get("http://localhost:3001/getstock")
      .then((response) => {
        //console.log("Response Data:", response.data);
        const mappedRows = response.data.map((item) => ({
          id: item.inventoryID,
          Product_Name: item.product_name,
          Stock_Arrival: item.stock_arrival + " kg",
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

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeSelectP = (event) => {
    const selectedProduct = event.target.value;
    const selectedProductData = product.find(
      (item) => item.product_name === selectedProduct
    );
    if (selectedProductData) {
      setProductS(selectedProduct);
      setFormData({ ...formData, productID: selectedProductData.productID });
    }
  };

  const handleChangeSelectS = (event) => {
    const selectedSupplier = event.target.value;
    const selectedSupplierData = supplier.find(
      (item) => item.supplier_company === selectedSupplier
    );
    if (selectedSupplierData) {
      setsupplierS(selectedSupplier);
      setFormData({ ...formData, supplierID: selectedSupplierData.supplierID });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "Product_Name", headerName: "Product Name", width: 200 },
    { field: "Stock_Arrival", headerName: "Stock Arrival", width: 200 },
    { field: "Supplier", headerName: "Supplier", width: 150 },
    {
      field: "Purchase_Date",
      headerName: "Received Date",
      type: "date",
      width: 150,
    },
    {
      field: "Expire_Date",
      headerName: "Expire Date",
      type: "date",
      width: 150,
    },
    { field: "Batch_No", headerName: "Batch Number", width: 150 },
    {
      field: "actions",
      headerName: "",
      width: 300,
      disableColumnMenu: true,
      renderCell: (params) =>
        userRole === 1 && (
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Button
              variant="outlined"
              onClick={() => handleEditClick(params.row.id)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              onClick={() => deletePopup(params.row.id)}
              style={{ marginLeft: 8 }}
            >
              Delete
            </Button>
          </Box>
        ),
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const apiUrl = isEditMode ? `http://localhost:3001/updatestock/${formData.id}` : "http://localhost:3001/addstock";
    const method = isEditMode ? "put" : "post";
  
    axios({
      method: method,
      url: apiUrl,
      data: formData,
    })
      .then((response) => {
        console.log("Form Data:", formData);
        console.log(isEditMode ? "Stock updated successfully:" : "Stock added successfully:", response.data);
  
        setFormData({
          stock_arrival: "",
          supplierID: "",
          purchase_date: "",
          expire_date: "",
          productID: "",
          batch_no: "",
        });
        setProductS("");
        setsupplierS("");
        setIsEditMode(false);
        Swal.fire({
          icon: "success",
          title: isEditMode ? "Stock Updated Successfully!" : "Stock Added Successfully!",
          customClass: {
            popup: "z-50",
          },
          didOpen: () => {
            document.querySelector(".swal2-container").style.zIndex = "9999";
          },
        }).then(() => {
          isEditMode ? handleCloseEdit() : handleClose();
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error(isEditMode ? "Error updating stock:" : "Error adding stock:", error);
      });
  };
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEdit = () => {
    setProductS('');
    setsupplierS('');
    setOpenEdit(false);
   
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/inventory")
      .then((response) => {
        // Filter out duplicate product titles
        const uniqueProducts = response.data.reduce((acc, current) => {
          if (!acc.some((item) => item.product_name === current.product_name)) {
            acc.push(current);
          }
          return acc;
        }, []);
        setProduct(uniqueProducts);
      })
      .catch((error) => {
        console.error("Error fetching data from product table:", error);
      });

    axios
      .get("http://localhost:3001/getsupplier")
      .then((response) => {
        setSupplier(response.data); // Update state with fetched categories
      })
      .catch((error) => {
        console.error("Error fetching data from category table", error);
      });
  }, []);

  // const handleDateChange = (dates, dateStrings) => {
  //   // Check if dates is null
  //   if (dates === null) {
  //     // If dates is null, set an empty array or another default value
  //     setDateRange([]);
  //   } else {
  //     // dates is not null, so update date range
  //     console.log("Selected Dates:", dates);
  //     console.log("Selected Date Strings:", dateStrings);
  //     setDateRange(dates);
  //   }
  // };

  return (
    <div className=" w-screen">
      <div className="flex w-screen py-10 ">
        <div className="flex w-1/2 pl-10 gap-10 ">
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
            Filter by Date
          </Button>
          <div className="">
            <Space direction="vertical" size={12}>
              <RangePicker
                className="h-12"
                picker="date"
                id={{
                  start: "startInput",
                  end: "endInput",
                }}
                // onChange={handleDateChange}
              />
            </Space>
          </div>
        </div>

        <div className="flex w-1/2 pr-10 justify-end ">
          <div className="">
            <React.Fragment>
              <Button
                className=" h-12 gap-2"
                variant="contained"
                onClick={handleClickOpen}
              >
                Add Stock <AddCircleOutlineIcon />
              </Button>
            </React.Fragment>
          </div>
        </div>
      </div>

      <div className="w-screen flex ">
        <div className="w-screen px-10 overflow-y-auto h-[70vh]">
          <Box sx={{ height: 480, width: "100%" }}>
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
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add Stock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a stock arrival, please enter the details here.
          </DialogContentText>

          <div className="flex mt-3 mb-1 gap-4">
            {/* Product Select */}
            <div>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label">
                  Select the Product
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={productS}
                  autoWidth
                  label="Select the Product"
                  onChange={handleChangeSelectP}
                >
                  {product.map((item) => (
                    <MenuItem key={item.productID} value={item.product_name}>
                      {item.product_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Supplier Select */}
            <div>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label">
                  Select the Supplier
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={supplierS}
                  autoWidth
                  label="Select the Supplier"
                  onChange={handleChangeSelectS}
                >
                  {supplier.map((item) => (
                    <MenuItem
                      key={item.supplierID}
                      value={item.supplier_company}
                    >
                      {item.supplier_company}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Stock Arrival Input */}
          <div className="mt-5">
            <TextField
              autoFocus
              required
              margin="dense"
              id="sarrival"
              name="stock_arrival"
              label="Stock Arrival"
              type="number"
              fullWidth
              variant="filled"
              size="small"
              value={formData.productname}
              onChange={handleChangeForm}
            />
          </div>

          {/* Received Date */}
          <div className="mt-3">
            <InputLabel id="demo-simple-select-label">Received Date</InputLabel>
            <TextField
              autoFocus
              required
              margin="dense"
              id="pdate"
              name="purchase_date"
              label=""
              type="date"
              fullWidth
              variant="filled"
              size="small"
              value={formData.date}
              onChange={handleChangeForm}
              // Set min attribute to current date
              inputProps={{
                min: new Date(Date.now() + 86400000)
                  .toISOString()
                  .split("T")[0],
              }}
            />
          </div>

          {/* Expire Date */}
          <div className="mt-3">
            <InputLabel id="demo-simple-select-label">Expire Date</InputLabel>
            <TextField
              autoFocus
              required
              margin="dense"
              id="edate"
              name="expire_date"
              label=""
              type="date"
              fullWidth
              variant="filled"
              size="small"
              value={formData.date}
              onChange={handleChangeForm}
              // Set min attribute to current date
              inputProps={{
                min: new Date(Date.now() + 86400000)
                  .toISOString()
                  .split("T")[0],
              }}
            />
          </div>

          {/* Batch Number Input */}
          <div className="mt-4">
            <TextField
              autoFocus
              required
              margin="dense"
              id="batchno"
              name="batch_no"
              label="Batch Number"
              type="text"
              fullWidth
              variant="filled"
              size="small"
              value={formData.date}
              onChange={handleChangeForm}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Add Item</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Item */}
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Edit Stock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit a stock arrival, please enter the details here.
          </DialogContentText>

          <div className="flex mt-3 mb-1 gap-4">
            {/* Product Select */}
            <div>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="product-select-label">
                  Select the Product
                </InputLabel>
                <Select
                  labelId="product-select-label"
                  id="product-select"
                  value={productS}
                  autoWidth
                  label="Select the Product"
                  onChange={handleChangeSelectP}
                >
                  {product.map((item) => (
                    <MenuItem key={item.productID} value={item.product_name}>
                      {item.product_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Supplier Select */}
            <div>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="supplier-select-label">
                  Select the Supplier
                </InputLabel>
                <Select
                  labelId="supplier-select-label"
                  id="supplier-select"
                  value={supplierS}
                  autoWidth
                  label="Select the Supplier"
                  onChange={handleChangeSelectS}
                >
                  {supplier.map((item) => (
                    <MenuItem
                      key={item.supplierID}
                      value={item.supplier_company}
                    >
                      {item.supplier_company}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Stock Arrival Input */}
          <div className="mt-5">
            <TextField
              autoFocus
              required
              margin="dense"
              id="sarrival"
              name="stock_arrival"
              label="Stock Arrival"
              type="number"
              fullWidth
              variant="filled"
              size="small"
              value={formData.stock_arrival}
              onChange={handleChangeForm}
            />
          </div>

          {/* Received Date */}
          <div className="mt-3">
            <InputLabel id="received-date-label">Received Date</InputLabel>
            <TextField
              required
              margin="dense"
              id="pdate"
              name="purchase_date"
              type="date"
              fullWidth
              variant="filled"
              size="small"
              value={formData.purchase_date}
              onChange={handleChangeForm}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
            />
          </div>

          {/* Expire Date */}
          <div className="mt-3">
            <InputLabel id="expire-date-label">Expire Date</InputLabel>
            <TextField
              required
              margin="dense"
              id="edate"
              name="expire_date"
              type="date"
              fullWidth
              variant="filled"
              size="small"
              value={formData.expire_date}
              onChange={handleChangeForm}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
            />
          </div>

          {/* Batch Number Input */}
          <div className="mt-4">
            <TextField
              required
              margin="dense"
              id="batchno"
              name="batch_no"
              label="Batch Number"
              type="text"
              fullWidth
              variant="filled"
              size="small"
              value={formData.batch_no}
              onChange={handleChangeForm}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button type="submit" variant="contained">Update Item</Button>
        </DialogActions> 
      </Dialog>
    </div>
  );
}

export default Inventory;
