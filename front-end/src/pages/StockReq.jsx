import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Card,
  Modal,
  CardContent,
  CardMedia,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { jwtDecode } from "jwt-decode";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const generatePDF = (preOrderData, addedItems) => {
  const doc = new jsPDF();

  console.log(preOrderData);

  const shopInfo = {
    name: "Distribution Agency - Stock Request",
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

  doc.text(`Request Date: ${orderDate}`, 15, startY);

  // Add items table
  const headers = [["Product Name", "Quantity"]];
  const data = addedItems.map((item) => [item.product_name, item.quantity]);

  let finalY; // Variable to store the final Y-coordinate after the table

  doc.autoTable({
    startY: startY + lineSpacing * 3,
    head: headers,
    body: data,
    didDrawPage: function (data) {
      finalY = data.cursor.y; // Capture the final y-coordinate
    },
  });

  // Add notes
  doc.setFontSize(12);
  doc.text(`Notes: ${preOrderData.note}`, 15, finalY + lineSpacing * 4);

  // Save the PDF
  doc.save(`invoice_stock_request_${new Date().toISOString()}.pdf`);
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

function ItemCard({
  item,
  setAddedItems,
  addedItems,
  restore,
  setRestore,
  restock,
  setRestock,
}) {
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

  useEffect(() => {
    if (restock.productID !== "") {
      if (item.productID === restock.productID) {
        setStock((prevStock) => prevStock - restock.amount);
        setRestock({
          productID: "",
          amount: "",
        }); // Update restore state to null using setRestore
      }
    }
  }, [restock]);

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

          <Button onClick={handleOpen} variant="contained" sx={{ mt: 2 }}>
            Add to Invoice
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

const StockReq = ({ userID }) => {

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItems, setAddedItems] = useState([]);
  const [stock, setStock] = useState({
    productID: "",
    amount: "",
  });
  const [restock, setRestock] = useState({
    productID: "",
    amount: "",
  });
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [supplierID, setsupplierID] = useState(1);
  const [supplier, setSupplier] = useState([]);
  const [alignment, setAlignment] = useState("");

  const [openNote, setOpenNote] = useState(false);
  const [additionalNote, setAdditionalNote] = useState('');
  const [proceedWithNote, setProceedWithNote] = useState(false);

  const handleCreateLoading = () => {
    if (addedItems.length === 0) {
        setAlertMessage("Please add at least one item to the bill.");
        setOpen(true);
      }else
    setOpenNote(true);
  };

  const handleClose = () => {
    setOpenNote(false);
  };

  const handleProceedWithNote = () => {
    setProceedWithNote(true);
    setOpen(false);
    createPreOrder();
  };


  const createPreOrder = () => {
    
      const preOrderData = {
        addedItems: addedItems,
        supplierID: supplierID,
        note: additionalNote // Include additional note in pre-order data
      };

      console.log(preOrderData);

      axios
        .post("http://localhost:3001/addstockreq", preOrderData)
        .then((response) => {
          console.log("Stock Req Invoice created successfully:", response.data);
          Swal.fire({
            icon: "success",
            title: "Stock Request Invoice Created Successfully!",
            customClass: {
              popup: "z-50",
            },
            didOpen: () => {
              document.querySelector(".swal2-container").style.zIndex = "9999";
            },
          }).then(() => {
            generatePDF(preOrderData, addedItems);
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error("Error creating invoice:", error);
          alert("Error creating invoice. Please try again.");
        });
    
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
        const defaultCategory = supplierID || 1;

        // Apply filter based on category
        if (defaultCategory) {
          filteredData = filteredData.filter(
            (item) => item.supplierID === defaultCategory
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
  }, [supplierID, searchQuery]);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    setsupplierID(newAlignment);
  };

  

  function BillingItem({ item, onQuantityChange, onRemoveItem }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [basequantity, setbaseQuantity] = useState(item.quantity);

    const handleQuantityChange = (e) => {
      const value = e.target.value;
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setQuantity(value);
        setRestock({ productID: item.productID, amount: value - basequantity });
        setbaseQuantity(value);
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



  // Decode the token to get user role
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setFName(decodedToken.firstname);
      setLName(decodedToken.lastname);
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getsupplier")
      .then((response) => {
        setSupplier(response.data); // Update state with fetched categories
      })
      .catch((error) => {
        console.error("Error fetching data from category table", error);
      });
  }, []);

  return (
    <div className="flex w-screen gap-4">
        <Dialog open={openNote} onClose={handleClose}>
        <DialogTitle>Additional Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add any additional note for this pre-order:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="additional-note"
            label="Additional Note"
            type="text"
            fullWidth
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleProceedWithNote}>Proceed</Button>
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
              Filter by Supplier
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
              {supplier.map((supplier) => (
                <ToggleButton
                  key={supplier.supplierID}
                  value={supplier.supplierID}
                >
                  {supplier.supplier_company}
                </ToggleButton>
              ))}
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
                restock={restock}
                setRestock={setRestock}
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
              <div className="">Stock Request Details</div>
            </div>
            <div className="">
              <h1 className="text-sm font-PoppinsL">
                Customer Name: {fName} {lName}
              </h1>
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
            </div>
          </div>

          <div className="w-full px-4 h-72 overflow-y-auto ">
            {addedItems.map((item) => (
              <BillingItem
                key={item.productID}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                setRestock={setRestock}
              />
            ))}
          </div>

          <div className="flex flex-col bg-slate-100 rounded-lg p-7 gap-3 ">
            <div className="px-1">
              <Button
                variant="contained"
                sx={{ paddingY: 1, width: "100%", borderRadius: 2 }}
                onClick={handleCreateLoading}
              >
                Send the request to the supplier
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

export default StockReq;
