import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DynamicItemCard from "../components/DynamicItemCard";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

function ProductCatalog() {
  const [alignment, setAlignment] = React.useState("All");
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = React.useState(false);
  const [categoryS, setCategoryS] = React.useState("");
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    // productname: "",
    // wholesaleprice: "",
    // sellingprice: "",
    // date: "",
    stock_total: 0,
  });

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  useEffect(() => {
    // Make a GET request to fetch data from the API endpoint
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
        setData(uniqueProducts); // Set the filtered data to the state
      })
      .catch((error) => {
        console.error("Error fetching data from product table:", error);
      });

    axios
      .get("http://localhost:3001/category")
      .then((response) => {
        setCategories(response.data); // Update state with fetched categories
        //console.log("Data from another endpoint:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from category table", error);
      });
  }, []);

  const handleChangeSelect = (event) => {
    const selectedCategory = event.target.value;
    const selectedCategoryData = categories.find(
      (item) => item.category === selectedCategory
    );
    if (selectedCategoryData) {
      setCategoryS(selectedCategory);
      setFormData({ ...formData, categoryID: selectedCategoryData.categoryID });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/additem", formData)
      .then((response) => {
        console.log("Item added successfully:", response.data);
        console.log("Form Data:", formData);
        //console.log("Selected File:", selectedFile);
        // Optionally, you can reset the form fields and selected category here
        setFormData({
          productname: "",
          wholesaleprice: "",
          sellingprice: "",
          date: "",
          stock_total: 0,
        });
        setCategoryS("");
        setSelectedFile(null);
        handleClose(); // Close the dialog after successful submission
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        // Handle errors here
      });
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
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
      <div className="flex w-screen py-10  ">
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
              Select Category
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

        <div className="flex w-1/2 pr-10   justify-between pl-64  ">
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
                    value={formData.productname}
                    onChange={handleChangeForm}
                  />
                  <div className="mt-3 mb-1">
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-label">
                        Category
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={categoryS}
                        autoWidth
                        label="Category"
                        onChange={handleChangeSelect}
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
                    value={formData.wholesaleprice}
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
                    value={formData.sellingprice}
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
                    value={formData.date}
                    onChange={handleChangeForm}
                  />
                  <div className="mt-3">
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload file
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

      <div className="flex w-screen px-10 py-5 gap-5 ">
        <div
          className=" w-4/6 py-5 px-11 bg-slate-100 rounded-lg  "
          style={{ overflowY: "auto", maxHeight: "65vh" }}
        >
          <DynamicItemCard category={alignment} searchQuery={searchQuery} />
        </div>
        <div className="w-2/6  bg-slate-100 rounded-lg">
          {/* <DoughnutGraph/> */}
        </div>
      </div>
    </div>
  );
}

export default ProductCatalog;

// const uniqueCategories = response.data.reduce((acc, current) => {
//   // Check if the category already exists in the accumulator
//   if (!acc.some((item) => item.category === current.category)) {
//     acc.push(current);
//   }
//   return acc;
// }, []);
// setData(uniqueCategories);
