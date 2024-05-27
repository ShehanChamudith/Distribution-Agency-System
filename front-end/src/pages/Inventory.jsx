import React, { useState, useEffect } from "react";
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
import BasicExampleDataGrid from "../components/FilterTable";
const { RangePicker } = DatePicker;

function Inventory() {
  const [open, setOpen] = React.useState(false);
  const [productS, setProductS] = React.useState("");
  const [supplierS, setsupplierS] = React.useState("");
  const [product, setProduct] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [formData, setFormData] = useState({ wstaffID: 2 });
  //const [dateRange, setDateRange] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/addstock", formData)
      .then((response) => {
        console.log("Form Data:", formData);
        console.log("Stock added successfully:", response.data);
        //console.log("Selected File:", selectedFile);

        setFormData({
          stock_arrival: "",
          supplierID: "",
          purchase_date: "",
          expire_date: "",
          productID: "",
          batch_no: "",
        });
        setProductS("");
        Swal.fire({
          icon: "success",
          title: "Stock Added Successfully!",
          customClass: {
            popup: "z-50",
          },
          didOpen: () => {
            document.querySelector(".swal2-container").style.zIndex = "9999";
          },
        }).then(() => {
          handleClose();
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error("Error adding stock:", error);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
                            <MenuItem
                              key={item.productID}
                              value={item.product_name}
                            >
                              {item.product_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

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

                  <div className="mt-3">
                    <InputLabel id="demo-simple-select-label">
                      Received Date
                    </InputLabel>
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
                    />
                  </div>
                  <div className="mt-3">
                    <InputLabel id="demo-simple-select-label">
                      Expire Date
                    </InputLabel>
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
                    />
                  </div>
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
                  <Button type="submit">Add Item</Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          </div>
        </div>
      </div>

      <div className="w-screen flex ">
        <div className="w-screen px-10 overflow-y-auto h-[70vh]">
          <BasicExampleDataGrid />
          {/* <Table dateRange={dateRange} /> */}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
