import React, { useState, useEffect } from "react";
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Autocomplete,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Swal from "sweetalert2";
import defImg from "../assets/images/defimg.png";
import DynamicItemCard from "../components/DynamicItemCard";
import DoughnutGraph from "../components/DoughnutGraph";

function ProductCatalog() {
  const [alignment, setAlignment] = React.useState("All");
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = React.useState(false);
  const [categoryS, setCategoryS] = React.useState("");
  const [supplierS, setSupplierS] = React.useState("");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [itemData, setFormData] = useState({
    product_name: "",
    wholesale_price: "",
    selling_price: "",
    date_added: "",
    stock_total: 0,
  });

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
        setData(uniqueProducts);
      })
      .catch((error) => {
        console.error("Error fetching data from product table:", error);
      });

    axios
      .get("http://localhost:3001/category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from category table", error);
      });

    axios
      .get("http://localhost:3001/getsupplier")
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from category table", error);
      });
  }, []);

  const handleChangeSelect = (event, type) => {
    const selectedValue = event.target.value;
    const selectedItem =
      type === "category"
        ? categories.find((item) => item.category === selectedValue)
        : suppliers.find((item) => item.supplier_company === selectedValue);

    if (selectedItem) {
      if (type === "category") {
        setCategoryS(selectedValue);
        setFormData({ ...itemData, categoryID: selectedItem.categoryID });
      } else if (type === "supplier") {
        setSupplierS(selectedValue);
        setFormData({ ...itemData, supplierID: selectedItem.supplierID });
      }
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the product already exists
    axios
      .post("http://localhost:3001/checkitem", {
        product_name: itemData.product_name,
        supplierID: itemData.supplierID,
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.message === "Product already exists") {
          console.log("Product already exists.");
          Swal.fire({
            icon: "error",
            title: "Product already exists.",
            text: "An item cannot be added with the same Product Name and the same Supplier",
            customClass: {
              popup: "z-50",
            },
            didOpen: () => {
              document.querySelector(".swal2-container").style.zIndex = "9999";
            },
          });
        } else {
          console.log("Product does not exist. Proceeding with insertion.");

          // Proceed with inserting the product
          const formData = new FormData();

          if (selectedFile) {
            formData.append("image", selectedFile);
          } else {
            // If no file is selected, append the default image
            const defaultImage = new File([defImg], "defimg.png", {
              type: "image/png",
            });
            formData.append("image", defaultImage);
          }

          formData.append("product_name", itemData.product_name);
          formData.append("stock_total", itemData.stock_total);
          formData.append("categoryID", itemData.categoryID);
          formData.append("wholesale_price", itemData.wholesale_price);
          formData.append("selling_price", itemData.selling_price);
          formData.append("date_added", itemData.date_added);
          formData.append("supplierID", itemData.supplierID);

          axios
            .post("http://localhost:3001/additem", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              console.log("Item added successfully:", response.data);
              console.log("Form Data:", formData);

              Swal.fire({
                icon: "success",
                title: "Product Added Successfully!",
                customClass: {
                  popup: "z-50",
                },
                didOpen: () => {
                  document.querySelector(".swal2-container").style.zIndex =
                    "9999";
                },
              }).then(() => {
                handleClose();
                window.location.reload();
              });
            })
            .catch((error) => {
              console.error("Error adding item:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking product existence:", error);
      });
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...itemData, [name]: value });
  };

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      product_name: "",
      wholesale_price: "",
      selling_price: "",
      date_added: "",
      stock_total: 0,
    });
    setCategoryS("");
    setSelectedFile(null);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div className="flex-col items-center w-screen">
      {topdiv(
        alignment,
        handleChange,
        data,
        handleSearchInputChange,
        handleClickOpen,
        open,
        handleClose,
        handleSubmit,
        itemData,
        handleChangeForm,
        categoryS,
        supplierS,
        handleChangeSelect,
        categories,
        suppliers,
        VisuallyHiddenInput,
        handleFileChange,
        selectedFile
      )}

      <div className="flex w-screen px-10 py-5 gap-5 ">
        <div
          className=" w-4/6 py-5 px-11 bg-slate-200 rounded-lg  "
          style={{ overflowY: "auto", height: "65vh" }}
        >
          <DynamicItemCard category={alignment} searchQuery={searchQuery} />
        </div>
        <div className="w-2/6  bg-slate-200 rounded-lg">
          <div className="flex h-full w-full">
            <div className="border border-red-500 w-1/2"></div>
            <div className="border border-red-500 w-1/2 h-full">
              <DoughnutGraph showLegend={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function topdiv(
  alignment,
  handleChange,
  data,
  handleSearchInputChange,
  handleClickOpen,
  open,
  handleClose,
  handleSubmit,
  formData,
  handleChangeForm,
  categoryS,
  supplierS,
  handleChangeSelect,
  categories,
  suppliers,
  VisuallyHiddenInput,
  handleFileChange,
  selectedFile
) {
  return (
    <div className="flex w-screen py-10 ">
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

      <div className="flex w-1/2 pr-10   justify-end gap-9  ">
        <div className="flex justify-end ">
          <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={data.map((item) => item.product_name)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Items"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                    sx: { height: 48 },
                    onChange: handleSearchInputChange,
                  }}
                />
              )}
            />
          </Stack>
        </div>

        <div className="">
          <React.Fragment>
            <Button
              className=" h-12 gap-2"
              variant="contained"
              onClick={handleClickOpen}
            >
              Add Item <AddCircleOutlineIcon />
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              PaperProps={{
                component: "form",
                onSubmit: handleSubmit,
              }}
            >
              <DialogTitle>Add Item</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To add a item, please enter the details here.
                </DialogContentText>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="pname"
                  name="product_name"
                  label="Product Name"
                  type="text"
                  fullWidth
                  variant="filled"
                  size="small"
                  value={formData.product_name}
                  onChange={handleChangeForm}
                />
                <div className="mt-3 mb-1 gap-8 flex">
                  <div>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-label">
                        Category
                      </InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={categoryS}
                        autoWidth
                        label="Category"
                        onChange={(event) =>
                          handleChangeSelect(event, "category")
                        }
                      >
                        {categories.map((category) => (
                          <MenuItem
                            key={category.categoryID}
                            value={category.category}
                          >
                            {category.category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-label">
                        Supplier
                      </InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={supplierS}
                        autoWidth
                        label="Supplier"
                        onChange={(event) =>
                          handleChangeSelect(event, "supplier")
                        }
                      >
                        {suppliers.map((supplier) => (
                          <MenuItem
                            key={supplier.categoryID}
                            value={supplier.supplier_company}
                          >
                            {supplier.supplier_company}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="wprice"
                  name="wholesale_price"
                  label="Wholesale Price"
                  type="number"
                  fullWidth
                  variant="filled"
                  size="small"
                  value={formData.wholesale_price}
                  onChange={handleChangeForm}
                />
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="sprice"
                  name="selling_price"
                  label="Selling Price"
                  type="number"
                  fullWidth
                  variant="filled"
                  size="small"
                  value={formData.selling_price}
                  onChange={handleChangeForm}
                />
                <TextField
                  autoFocus
                  required
                  margin="normal"
                  id="date"
                  name="date_added"
                  label=""
                  type="date"
                  fullWidth
                  variant="filled"
                  size="small"
                  value={formData.date_added}
                  onChange={handleChangeForm}
                />
                <div className="mt-3">
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload a Image of the Product
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png"
                    />
                  </Button>
                  {selectedFile && <p>{selectedFile.name}</p>}
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
  );
}

export default ProductCatalog;
