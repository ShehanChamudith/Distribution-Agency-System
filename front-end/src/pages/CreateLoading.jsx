import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  Modal,
  CardContent,
  CardMedia,
  Typography,
  Alert,
  Snackbar,
  Checkbox,
} from "@mui/material";
import Swal from "sweetalert2";
import porkIcon from "../assets/icons/pork.ico";
import chickenIcon from "../assets/icons/hen.ico";
import cpartIcon from "../assets/icons/food.ico";
import sausageIcon from "../assets/icons/sausages.ico";
import PropTypes from "prop-types";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const generatePDF = (invoiceData, addedItems) => {
  const doc = new jsPDF();

  console.log(invoiceData);

  const shopInfo = {
    name: "Distribution Agency",
    address: "Atakalanpanna, Kahawatta",
    tel: "077-4439693",
  };

  const pageWidth = doc.internal.pageSize.getWidth();
  const lineSpacing = 5;

  const currentDate = new Date();
  const orderDate = currentDate.toLocaleDateString();
  const orderTime = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const shopNameFontSize = 20;
  const addressFontSize = 16;
  const telFontSize = 14;

  // Shop Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(shopNameFontSize);
  const shopNameWidth = doc.getTextDimensions(shopInfo.name).w;
  doc.text(shopInfo.name, (pageWidth - shopNameWidth) / 2, 10);

  // Address
  doc.setFont("helvetica", "normal");
  doc.setFontSize(addressFontSize);
  const addressWidth = doc.getTextDimensions(shopInfo.address).w;
  doc.text(
    shopInfo.address,
    (pageWidth - addressWidth) / 2,
    10 + lineSpacing * 2
  );

  // Tel
  doc.setFontSize(telFontSize);
  const telWidth = doc.getTextDimensions(`Tel: ${shopInfo.tel}`).w;
  doc.text(
    `Tel: ${shopInfo.tel}`,
    (pageWidth - telWidth) / 2,
    10 + lineSpacing * 3
  );

  // Add title and basic information
  doc.setFontSize(13);
  let startY = 30 + lineSpacing * 3; // Adjust startY to prevent overlap with header

  doc.text(`Order Number: #0001`, 15, startY);
  doc.text(`Customer ID: ${invoiceData.customerID}`, 15, startY + lineSpacing);
  doc.text(`User ID: ${invoiceData.userID}`, 15, startY + lineSpacing * 2);
  doc.text(`Order Date: ${orderDate}`, 15, startY + lineSpacing * 3);
  doc.text(`Order Time: ${orderTime}`, 15, startY + lineSpacing * 4);

  // Add items table
  const headers = [["Product Name", "Quantity", "Unit Price", "Price"]];
  const data = addedItems.map((item) => [
    item.product_name,
    item.quantity,
    `${item.selling_price} LKR`,
    `${item.quantity * item.selling_price} LKR`,
  ]);

  let paymentAmount, paymentLabel;
  switch (invoiceData.payment_type) {
    case "cash":
      paymentAmount = invoiceData.cash_amount;
      paymentLabel = "Cash Amount Paid";
      break;
    case "cheque":
      paymentAmount = invoiceData.cheque_value;
      paymentLabel = "Cheque Value";
      break;
    case "credit":
      paymentAmount = invoiceData.credit_amount;
      paymentLabel = "Credited Value";
      break;
    default:
      paymentAmount = 0;
      paymentLabel = "Payment Amount";
  }

  doc.autoTable({
    startY: startY + lineSpacing * 7,
    head: headers,
    body: data,
    didDrawPage: function (data) {
      let tableHeight = data.cursor.y;

      doc.line(
        15,
        tableHeight + lineSpacing * 2,
        pageWidth - 15,
        tableHeight + lineSpacing * 2
      );

      doc.text(`Subtotal:`, 15, tableHeight + lineSpacing * 4.5);
      // Right align the sale amount
      const saleAmountValue = `${invoiceData.sale_amount}`;
      const saleAmountWidth = doc.getTextWidth(saleAmountValue);
      const saleAmountXPosition = pageWidth - saleAmountWidth - 15; // Right align, leaving a 15 unit margin
      doc.text(
        saleAmountValue,
        saleAmountXPosition,
        tableHeight + lineSpacing * 4.5
      );

      doc.text(`Discount:`, 15, tableHeight + lineSpacing * 6);
      // Right align the discount
      const discountValue = `${invoiceData.discount}`;
      const discountWidth = doc.getTextWidth(discountValue);
      const discountXPosition = pageWidth - discountWidth - 15; // Right align, leaving a 15 unit margin
      doc.text(discountValue, discountXPosition, tableHeight + lineSpacing * 6);

      doc.text(`${paymentLabel}:`, 15, tableHeight + lineSpacing * 7.5);
      // Right align the payment amount
      const paymentAmountValue = `${paymentAmount}`;
      const paymentAmountWidth = doc.getTextWidth(paymentAmountValue);
      const paymentAmountXPosition = pageWidth - paymentAmountWidth - 15; // Right align, leaving a 15 unit margin
      doc.text(
        paymentAmountValue,
        paymentAmountXPosition,
        tableHeight + lineSpacing * 7.5
      );

      doc.text(`Balance:`, 15, tableHeight + lineSpacing * 9);
      // Right align the balance
      const balanceValue = `${invoiceData.balance}`;
      const balanceWidth = doc.getTextWidth(balanceValue);
      const balanceXPosition = pageWidth - balanceWidth - 15; // Right align, leaving a 15 unit margin
      doc.text(balanceValue, balanceXPosition, tableHeight + lineSpacing * 9);

      doc.text(`Payment Type:`, 15, tableHeight + lineSpacing * 10.5);
      // Right align the payment type
      const paymentTypeValue = `${invoiceData.payment_type}`;
      const paymentTypeWidth = doc.getTextWidth(paymentTypeValue);
      const paymentTypeXPosition = pageWidth - paymentTypeWidth - 15; // Right align, leaving a 15 unit margin
      doc.text(
        paymentTypeValue,
        paymentTypeXPosition,
        tableHeight + lineSpacing * 10.5
      );
    },
  });

  // Save the PDF
  doc.save(`invoice_${new Date().toISOString()}.pdf`);
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function ItemCard({ item, setAddedItems, addedItems, restore, setRestore }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    severity: "",
    message: "",
  });
  const [stock, setStock] = useState(item.stock_total);

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (restore.productID !== "") {
      if (item.productID === restore.productID) {
        setStock((prevStock) => prevStock + restore.amount);
        setRestore({
          productID: "",
          amount: "",
        }); // Update restore state to null using setRestore
      }
    }
  }, [restore]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToBill = () => {
    const enteredQuantity = parseFloat(quantity); // Ensure quantity is treated as a number

    if (!enteredQuantity) {
      setAlert({
        show: true,
        severity: "error",
        message: "Quantity cannot be empty!",
      });
      return;
    }

    if (enteredQuantity > stock) {
      setAlert({
        show: true,
        severity: "error",
        message: "Entered quantity exceeds available stock!",
      });
      return;
    }

    const newItem = { ...item, quantity: enteredQuantity };

    const isItemAlreadyAdded = addedItems.some(
      (addedItem) => addedItem.productID === item.productID
    );

    if (isItemAlreadyAdded) {
      setAlert({
        show: true,
        severity: "error",
        message: "Item is already added to the bill!",
      });
      return;
    }

    setAddedItems((prevItems) => [...prevItems, newItem]);
    setStock((prevStock) => prevStock - enteredQuantity); // Update the stock

    setAlert({
      show: true,
      severity: "success",
      message: "Item added to the bill",
    });

    console.log(`Added ${enteredQuantity} ${item.product_name} to bill!`);
    setQuantity("");
    handleClose();
    // setItem({ product_name: '', image_path: '', selling_price: 0 });
  };

  const handleChange = (event) => {
    setQuantity(event.target.value);
  };

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, severity: "", message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div>
      {alert.show && (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ show: false, severity: "", message: "" })}
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: "100%",
            maxWidth: "350px",
          }}
        >
          {alert.message}
        </Alert>
      )}

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
          alt={item.product_name}
          image={`http://localhost:3001/${item.image_path}`}
          sx={{ height: 150 }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {item.product_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock: {stock} kg
          </Typography>
          <Button onClick={handleOpen} variant="contained" sx={{ mt: 2 }}>
            Add to Bill
          </Button>
        </CardContent>
      </Card>

      {/* Quantity Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Enter Quantity</h2>
          <TextField
            label="Quantity"
            variant="outlined"
            type="number"
            value={quantity}
            onChange={handleChange}
            sx={{ mt: 2, mb: 2, display: "block" }}
          />
          <Button onClick={handleAddToBill} variant="contained">
            Add
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

const CreateLoading = ({ userID }) => {
  const [alignment, setAlignment] = React.useState("All");
  const [category, setCategory] = useState("All");
  const [openExistingCustomerDialog, setOpenExistingCustomerDialog] =
    useState(true);
  const [selectedRep, setSelectedRep] = useState({
    repID: "",
    firstname: "",
  });
  const [selectedVehicle, setselectedVehicle] = useState({
    vehicleID: "",
    vehicle_number: "",
  });
  const [selectedRepInfo, setSelectedRepInfo] = useState("");
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState("");
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItems, setAddedItems] = useState([]);
  const [stock, setStock] = useState({
    productID: "",
    amount: "",
  });
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [preOrderID, setpreOrderID] = useState("");
  const [vehicle, setVehicle] = useState([]);
  const [existingRep, setExistingRep] = useState([]);
  const [pending, setPending] = useState(null);
  const [area, setArea] = useState([]);
  const [areaID, setSelectedArea] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/getarea")
      .then((response) => {
        setArea(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

  const checkPendingLoading = () => {
    // Assuming selectedRep contains the repID of the selected salesRep
    const repID = selectedRep.repID;
    console.log(repID);

    axios
      .post("http://localhost:3001/check-pending-loading", { repID })
      .then((response) => {
        setPending(response.data.hasPendingLoading);
        console.log(response.data.hasPendingLoading);
      })
      .catch((error) => {
        console.error("Error checking pending loading:", error);
        // Handle error
      });
  };

  useEffect(() => {
    if (selectedRep) {
      checkPendingLoading();
    }
  }, [selectedRep]);

  const handleCreateLoading = () => {
    checkPendingLoading(); // Check for pending loading first

    // Proceed only after the checkPendingLoading completes
    if (pending) {
      // Show a message or take any action when there is a pending loading
      Swal.fire({
        icon: "warning",
        title: "Please Complete the previous loading first !",
        text: "There is a pending loading for the selected salesRep. Complete it to create another loading for this sales representative",
        showCancelButton: true, // Show cancel button
        confirmButtonText: "Change Sales Rep", // Button for changing sales rep
        cancelButtonText: "Complete Previous Loading", // Button for completing previous loading
        customClass: {
          popup: "z-50",
        },
        didOpen: () => {
          document.querySelector(".swal2-container").style.zIndex = "9999";
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setOpenExistingCustomerDialog(true);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/get-loading");
        }
      });
      return;
    } else if (addedItems.length === 0) {
      setAlertMessage("Please add at least one item to the bill.");
      setOpen(true);
    } else {
      const loadingData = {
        total_value: subtotal,
        repID: selectedRep.repID,
        addedItems: addedItems,
        vehicleID: selectedVehicle.vehicleID,
        userID: userID,
        loading_status: "pending",
        availability: "no",
        areaID: areaID,
      };

      console.log(loadingData);

      axios
        .post("http://localhost:3001/addloading", loadingData)
        .then((response) => {
          console.log("Invoice created successfully:", response.data);

          // if (printBill) {
          //   generatePDF(invoiceData, addedItems);
          // }

          Swal.fire({
            icon: "success",
            title: "Loading Invoice Created Successfully!",
            customClass: {
              popup: "z-50",
            },
            didOpen: () => {
              document.querySelector(".swal2-container").style.zIndex = "9999";
            },
          }).then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error("Error creating invoice:", error);
          alert("Error creating invoice. Please try again.");
        });
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

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

  const handleExistingRepChange = (event) => {
    setSelectedRepInfo(event.target.value); // Update selected rep info
  };

  const handleVehicleChange = (event) => {
    setSelectedVehicleInfo(event.target.value);
  };

  const handleExistingCustomerDialogClose = () => {
    // Display SweetAlert confirmation dialog
    Swal.fire({
      icon: "warning",
      title: "Please select a Sale Representative, a Vehicle and a Area!",
      customClass: {
        popup: "z-50",
      },
      didOpen: () => {
        document.querySelector(".swal2-container").style.zIndex = "9999";
      },
    });
  };

  const handleExistingCustomerSubmit = () => {
    setOpenExistingCustomerDialog(false);
    const rep = existingRep.find((rep) => rep.firstname === selectedRepInfo);
    setSelectedRep(rep);
    console.log("Selected Customer after button click:", rep);

    const vehi = vehicle.find(
      (vehi) => vehi.vehicle_number === selectedVehicleInfo
    );
    setselectedVehicle(vehi);
    console.log("Selected Vehicle after button click:", vehi);
  };

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    setCategory(newAlignment);
  };

  const fetchsaleRep = () => {
    axios
      .get("http://localhost:3001/getsalerep")
      .then((response) => {
        setExistingRep(response.data);
      })
      .catch((error) => {
        console.error("Error fetching existing customers:", error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/getvehicle")
      .then((response) => {
        const vehicleData = response.data;

        setVehicle(vehicleData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (openExistingCustomerDialog) {
      fetchsaleRep();
    }
  }, [openExistingCustomerDialog]);

  function BillingItem({ item, onQuantityChange, onRemoveItem }) {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleQuantityChange = (e) => {
      const value = e.target.value;
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setQuantity(value);
        onQuantityChange(item.productID, parseFloat(value) || 0);
      }
    };

    const totalPrice = (quantity * item.selling_price).toFixed(2);

    return (
      <div className="w-full flex items-center justify-between p-2 border-b border-gray-300 hover:bg-gray-100 hover:scale-105 transition-transform duration-300 hover:rounded-lg hover:border-cyan-700">
        <div className="w-1/2 flex items-center ">
          <img
            src={`http://localhost:3001/${item.image_path}`}
            alt={item.product_name}
            className="w-12 h-12 object-cover rounded-xl"
          />
          <div className="ml-2">
            <h1 className="text-sm font-medium">{item.product_name}</h1>
            <h1 className="text-xs text-gray-500">
              {item.selling_price.toFixed(2)} LKR
            </h1>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-between">
          <div className="">
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20 p-1 border border-gray-400 rounded text-center"
            />
          </div>
          <div className=" flex justify-end items-center">
            <h1 className="text-sm ml-2">{totalPrice} LKR</h1>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onRemoveItem(item.productID, quantity)}
              sx={{
                ml: 1,
                minWidth: "auto",
                padding: "4px 12px",
                fontSize: "0.75rem",
              }}
            >
              X
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (productId, newQuantity) => {
    setAddedItems((prevItems) =>
      prevItems.map((item) =>
        item.productID === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  useEffect(() => {
    console.log("Updated addedItems:", addedItems);
  }, [addedItems]);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();

  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  // Time
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const calculateSubtotal = () => {
      return addedItems
        .reduce((total, item) => {
          return total + item.quantity * item.selling_price;
        }, 0)
        .toFixed(2);
    };

    const calculatedSubtotal = calculateSubtotal();
    setSubtotal(calculatedSubtotal);
  }, [addedItems]);

  const handleRemoveItem = (productId, amount) => {
    setAddedItems((prevItems) =>
      prevItems.filter((item) => item.productID !== productId)
    );
    setStock({ productID: productId, amount: amount });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/getloading")
      .then((response) => {
        const preloadID = response.data.uniqueloadingID;
        console.log(preloadID);
        if (preloadID === 0) {
          setpreOrderID(1);
        } else {
          setpreOrderID(parseFloat(preloadID) + 1);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="flex w-screen gap-4">
      {/* Select Existing Rep  */}
      <Dialog
        open={openExistingCustomerDialog}
        onClose={handleExistingCustomerDialogClose}
      >
        <DialogTitle>Select Sales Representative and Vehicle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select an Sales Representative and the Vehicle from the
            lists.
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel id="existing-rep-label">
              Sales Representative
            </InputLabel>
            <Select
              required
              labelId="existing-rep-label"
              value={selectedRepInfo}
              onChange={handleExistingRepChange}
              label="Sales Representative"
            >
              {existingRep.map((rep) => (
                <MenuItem key={rep.repID} value={rep.firstname}>
                  {rep.firstname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="vehicle-label">Select Vehicle</InputLabel>
            <Select
              required
              labelId="vehicle-label"
              value={selectedVehicleInfo}
              onChange={handleVehicleChange}
              label="Select Vehicle"
            >
              {vehicle.map((data) => (
                <MenuItem
                  key={data.vehicleID}
                  value={data.vehicle_number}
                  disabled={data.availability === "no"} // Disable if availability is "no"
                >
                  {data.vehicle_number}
                  {data.availability === "no" && " - Not Available"}{" "}
                  {/* Append "Not Available" */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="userarea-label">Select Area</InputLabel>
            <Select
              required
              labelId="userarea-label"
              value={areaID}
              onChange={handleAreaChange}
              label="Select Area"
            >
              {area.map((item) => (
                <MenuItem key={item.areaID} value={item.areaID}>
                  {item.area}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleExistingCustomerSubmit();
            }}
            disabled={!selectedRepInfo || !selectedVehicleInfo || !areaID}
            variant="contained"
            color="primary"
          >
            Select
          </Button>
        </DialogActions>
      </Dialog>

      <div className="w-3/5 flex flex-col ">
        {/* Filtering Bar */}
        <div className="flex pl-10 py-10 gap-10  ">
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

        {/* Items  */}
        <div className=" w-full pl-8 h-[67vh] overflow-y-auto">
          <div className="flex flex-wrap gap-3 justify-arround overflow-y-auto p-2">
            {data.map((item) => (
              <ItemCard
                key={item.productID}
                item={item}
                setAddedItems={setAddedItems}
                addedItems={addedItems}
                restore={stock}
                setRestore={setStock}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Billing Tabs */}
      <div className="w-2/5 h-[89vh]  pr-8 ">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-6 justify-between font-PoppinsM text-2xl rounded-lg p-2">
            <div className="flex justify-between mt-8  border-b-4 ">
              <div className="">Loading Details</div>
              <div className="">
                <h1>#00{preOrderID}</h1>
              </div>
            </div>
            <div className="">
              {selectedRep.firstname && (
                <h1 className="text-sm font-PoppinsL">
                  Sales Representative Name: {selectedRep.firstname}
                </h1>
              )}
              {selectedVehicle.vehicle_number && (
                <h1 className="text-sm font-PoppinsL">
                  Vehicle Number: {selectedVehicle.vehicle_number}
                </h1>
              )}
              <h1 className="text-sm font-PoppinsL">
                Loaded Date: {formattedDate}
              </h1>
              <h1 className="text-sm font-PoppinsL">
                Loaded Time: {currentTime}
              </h1>
            </div>
          </div>

          <div className="flex justify-between px-3">
            <div className="w-1/2">Item Name</div>
            <div className="flex justify-between w-1/2">
              <div>Quantity (kg)</div>
              <div>Price (LKR)</div>
            </div>
          </div>

          <div className="w-full px-4 h-64 overflow-y-auto ">
            {addedItems.map((item) => (
              <BillingItem
                key={item.productID}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>

          <div className="flex flex-col bg-slate-100 rounded-lg px-2 pt-5 gap-3 ">
            <div className="flex justify-between px-1">
              <p>Total Value of Loaded Quantity:</p>
              <p>{subtotal} LKR</p>
            </div>

            <div className="w-full flex items-center gap-5 justify-between px-1"></div>
            <div className="px-1">
              <Button
                variant="contained"
                sx={{ paddingY: 1, width: "100%", borderRadius: 2 }}
                onClick={handleCreateLoading}
              >
                Create a Loading
              </Button>
              <Snackbar
                open={open}
                autoHideDuration={1500}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  onClose={handleCloseAlert}
                  severity="warning"
                  sx={{ width: "100%" }}
                >
                  {alertMessage}
                </Alert>
              </Snackbar>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLoading;
