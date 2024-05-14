import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,FormControl,InputLabel,MenuItem,Select,TextField,} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

const deleteRow = (productId) => {
  axios
    .delete(`http://localhost:3001/deleteItem/${productId}`)
    .then((response) => {
      console.log("Row deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting row:", error);
    });
};

const popup = (productId) => {
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
      deleteRow(productId);
      Swal.fire({
        title: "Deleted!",
        text: "Row has been deleted.",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    }
  });
};

function ItemCard({ item }) {
  const [selectedFile, setSelectedFile] = useState(null);
  //const [selectedCategoryGet, setSelectedCategoryGet] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryS, setCategoryS] = React.useState("");
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    productID: "",
    product_name: "",
    wholesale_price: "",
    selling_price: "",
    date_added: "",
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleChangeSelect = (event) => {
    const selectedCategory = event.target.value;
    const selectedCategoryData = categories.find(
      (item) => item.category === selectedCategory
    );
    if (selectedCategoryData) {
      setCategoryS(selectedCategory);
      setEditData({ ...editData, categoryID: selectedCategoryData.categoryID });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCategoryS('');

  };

  const handleEdit = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/editItemDataGet/${productId}`
      );
      const data = response.data;
      const formattedDate = new Date(data.date_added)
        .toISOString()
        .split("T")[0];
      setEditData({
        productID: data.productID,
        product_name: data.product_name,
        //category: data.category,
        wholesale_price: data.wholesale_price,
        selling_price: data.selling_price,
        date_added: formattedDate,
      });

      // const categoryResponse = await axios.get(
      //   `http://localhost:3001/editItemCategoryGet/${productId}`
      // );
      // setSelectedCategoryGet(categoryResponse.data);
      

      const categoriesResponse = await axios.get(
        "http://localhost:3001/category"
      );
      setCategories(categoriesResponse.data);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching item data for editing:", error.response);
    }
  };

 
  const handleEditSubmit = async (productId, e) => {
    e.preventDefault();

    console.log("Form submitted for editing:", editData);
    console.log(productId);
    
    axios.put(`http://localhost:3001/edititem/${productId}`, editData)
    
      .then(response => {
        console.log('Edit request successful:', response.data);
        // Handle successful response if needed
      })
      .catch(error => {
        console.error('Error editing item:', error);
        // Handle error if needed
      });
     
    handleClose();
    window.location.reload(); 
  };
  

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
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
    
    <Card
      sx={{
        width: 200,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardMedia
        component="img"
        alt={item.name}
        image={`http://localhost:3001/${item.image_path}` }
        sx={{ height: 150 }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {item.product_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stock: {item.stock_total} kg
        </Typography>
      </CardContent>
      <CardActions className="flex justify-between">
        <Button
          size="small"
          variant="outlined"
          onClick={() => popup(item.productID)}
        >
          <DeleteIcon />
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleEdit(item.productID)}
        >
          <EditIcon />
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (e) => handleEditSubmit(item.productID, e),
          }}
        >
          <DialogTitle>Edit Item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit an item, please update the details here.
            </DialogContentText>

            <TextField
              required
              autoFocus
              margin="dense"
              id="product_name"
              name="product_name"
              label="Product Name"
              type="text"
              fullWidth
              variant="filled"
              size="small"
              value={editData.product_name}
              onChange={handleChangeForm}
            />

            <div className="mt-3 mb-1">
              <FormControl sx={{ minWidth: 120 }} required>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={categoryS} //selectedCategoryGet.category
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
              value={editData.wholesale_price}
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
              value={editData.selling_price}
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
              value={editData.date_added}
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
            <Button type="submit">Save</Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
}

export default function DynamicItemCard({ category, searchQuery }) {
  const [data, setData] = useState([]);

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

        // Filter items based on search query
        if (searchQuery) {
          filteredData = filteredData.filter((item) =>
            item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setData(filteredData); // Set the filtered data to the state
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [category, searchQuery]);

  return (
    <div className="flex flex-wrap gap-4 justify-arround">
      {data.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
