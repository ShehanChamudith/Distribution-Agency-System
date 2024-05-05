import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
//import DoughnutGraph from "../components/DoughnutGraph";
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

function ProductCatalog() {
  const [alignment, setAlignment] = React.useState("All");
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
                  onSubmit: (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    const email = formJson.email;
                    console.log(email);
                    handleClose();
                  },
                }}
              >
                <DialogTitle>Add Item</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To subscribe to this website, please enter your email
                    address here. We will send updates occasionally.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Subscribe</Button>
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
