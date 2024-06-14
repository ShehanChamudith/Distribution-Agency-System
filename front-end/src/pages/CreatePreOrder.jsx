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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
import porkIcon from "../assets/icons/pork.ico";
import chickenIcon from "../assets/icons/hen.ico";
import cpartIcon from "../assets/icons/food.ico";
import sausageIcon from "../assets/icons/sausages.ico";
import PropTypes from "prop-types";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { jwtDecode } from "jwt-decode";

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

function ItemCard({ item, setAddedItems, addedItems, restore, setRestore, restock, setRestock }) {
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

    // if (enteredQuantity > stock) {
    //   setAlert({
    //     show: true,
    //     severity: "error",
    //     message: "Entered quantity exceeds available stock!",
    //   });
    //   return;
    // }

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
    const value = event.target.value;
    // Ensure the input is not negative
    if (value >= 0) {
      setQuantity(value);
    }
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
          {/* <Typography variant="body2" color="text.secondary">
            Stock: {stock} kg
          </Typography> */}
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

const CreatePreOrder = ({ userID, userInfo }) => {
  const [alignment, setAlignment] = React.useState("All");
  const [category, setCategory] = useState("All");  
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
  const [preOrderID, setpreOrderID] = useState("");
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [customerID, setcustomerID] = useState("");
  const [openDialog, setOpenDialog] = useState(userInfo !== 6);
  const [openNewCustomerDialog, setOpenNewCustomerDialog] = useState(false);
  const [openExistingCustomerDialog, setOpenExistingCustomerDialog] =
    useState(false);
  const [customerData, setcustomerData] = useState({
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      address: "",
      shop_name: "",
      usertypeID: 6,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [area, setArea] = useState([]);
  const [areaID, setSelectedArea] = useState('');
  //const [userInfo, setUserInfo] = useState('');
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState("");
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({
    customerID: "",
    shop_name: "",
  });



  const fetchCustomer = () => {
    axios
      .get("http://localhost:3001/getcustomer")
      .then((response) => {
        setExistingCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching existing customers:", error);
      });
  };

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

  useEffect(() => {
    if (openExistingCustomerDialog) {
      fetchCustomer();
    }
  }, [openExistingCustomerDialog]);

  useEffect(() => {
    console.log("userID in useEffect:", userID);
    if (userID) {
      axios
        .get(`http://localhost:3001/getcustomerID/${userID}`)
        .then((response) => {
          const cusData = response.data;
          //console.log(repData);
          setcustomerID(cusData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [userID]);

  
  const handleCreateLoading = () => {
    const hasZeroQuantity = addedItems.some((item) => item.quantity === 0);
  
    console.log(customerID);
  
    if (addedItems.length === 0 || hasZeroQuantity) {
      setAlertMessage("Please add items with a quantity greater than 0.");
      setOpen(true);
    } else {
      let finalCustomerID;
      
      if (userInfo === 3) {
        finalCustomerID = selectedCustomer.customerID;
      } else if (userInfo === 6) {
        finalCustomerID = customerID;
      } else {
        // Handle cases where userInfo is neither 3 nor 6, if necessary
        finalCustomerID = null;
      }
  
      if (!finalCustomerID) {
        setAlertMessage("Invalid customer information.");
        setOpen(true);
        return;
      }
  
      const preOrderData = {
        total_value: subtotal,
        addedItems: addedItems,
        pre_order_status: "pending",
        customerID: finalCustomerID,
      };
  
      console.log(preOrderData);
  
      axios
        .post("http://localhost:3001/addpreorder", preOrderData)
        .then((response) => {
          console.log("Pre Order Invoice created successfully:", response.data);
  
          // if (printBill) {
          //   generatePDF(invoiceData, addedItems);
          // }
  
          Swal.fire({
            icon: "success",
            title: "Pre Order Request Sent Successfully!",
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


  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    setCategory(newAlignment);
  };


  function BillingItem({ item, onQuantityChange, onRemoveItem }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [basequantity, setbaseQuantity] = useState(item.quantity);

    const handleQuantityChange = (e) => {
      const value = e.target.value;
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setQuantity(value);
        setRestock({ productID: item.productID, amount: value-basequantity });
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

  const handleExistingCustomerSubmit = () => {
    setOpenExistingCustomerDialog(false);
    const customer = existingCustomers.find(
      (customer) => customer.shop_name === selectedCustomerInfo
    );
    setSelectedCustomer(customer);
    console.log("Selected Customer after button click:", customer);
  };

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

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
    setSelectedCustomerInfo(event.target.value); // Update temporary state
    //console.log("Temporarily selected shop name:", event.target.value);
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
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to proceed without adding a new customer? There won't be a customer name on the bill!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, go back",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      customClass: {
        popup: "z-50",
      },
      didOpen: () => {
        document.querySelector(".swal2-container").style.zIndex = "9999";
      },
    }).then((result) => {
      // If user confirms, close the dialog
      if (result.isConfirmed) {
        setOpenNewCustomerDialog(false);
      }
    });
  };

  const handleExistingCustomerDialogClose = () => {
    // Display SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to proceed without selecting a customer?  There won't be a customer name on the bill!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "No, go back",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      customClass: {
        popup: "z-50",
      },
      didOpen: () => {
        document.querySelector(".swal2-container").style.zIndex = "9999";
      },
    }).then((result) => {
      // If user confirms, close the dialog
      if (result.isConfirmed) {
        setOpenExistingCustomerDialog(false);
      }
    });
  };

  const checkUserExistence = () => {
    // Check if the username or phone number already exists
    return axios.post("http://localhost:3001/checkUserExistence", { username: customerData.username, phone: customerData.phone });
  };

  const newData = { ...customerData, areaID };


  const handleSubmit = (event) => {
    event.preventDefault();
    if (customerData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    checkUserExistence()
      .then((response) => {
        if (response.data.exists) {
          // If username or phone already exists, show an alert using SweetAlert
          Swal.fire({
            icon: "error",
            title: "Username or phone number already exists!",
            customClass: {
              popup: "z-50",
            },
            didOpen: () => {
              document.querySelector(".swal2-container").style.zIndex = "9999";
            },
          });
        } else {
          // If username and phone are unique, proceed with adding the user
          //Handle form submission, e.g., send data to the server
          console.log(newData);
          axios
            .post("http://localhost:3001/adduser", newData)
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
                areaID: "",
                shop_name: "",
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
                fetchCustomer();
                setOpenExistingCustomerDialog(true);
              });
            })
            .catch((error) => {
              console.error("Error adding customer:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking user existence:", error);
      });
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
      .get("http://localhost:3001/getpreorder")
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

  // Decode the token to get user role
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setFName(decodedToken.firstname);
      setLName(decodedToken.lastname);
      //setUserInfo(decodedToken.usertypeID);
    }
  }, []);



  return (
    <div className="flex w-screen gap-4">

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
            required
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
              required
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
              required
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
              required
              label="First Name"
              name="firstname"
              variant="filled"
              fullWidth
              margin="normal"
              value={customerData.firstname}
              onChange={handleChangeForm}
            />
            <TextField
              required
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
            required
            label="Shop Name"
            name="shop_name"
            variant="filled"
            fullWidth
            margin="normal"
            value={customerData.shop_name}
            onChange={handleChangeForm}
          />
          <TextField
            required
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
            required
            label="Phone"
            name="phone"
            variant="filled"
            fullWidth
            margin="normal"
            value={customerData.phone}
            onChange={handleChangeForm}
          />
          <TextField
            required
            label="Address"
            name="address"
            variant="filled"
            fullWidth
            margin="normal"
            value={customerData.address}
            onChange={handleChangeForm}
          />
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
              required
              labelId="existing-customer-label"
              value={selectedCustomerInfo}
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
          <Typography
            variant="body2"
            color="primary"
            onClick={handleNewCustomer}
            sx={{ cursor: "pointer", marginTop: 2 }}
          >
            Customer doesn't exist? Add New Customer Here
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExistingCustomerDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleExistingCustomerSubmit();
            }}
            disabled={!selectedCustomerInfo}
            variant="contained"
            color="primary"
          >
            Select Customer
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
                restock = {restock}
                setRestock = {setRestock}
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
              <div className="">Pre Order Details</div>
              <div className="">
                <h1>#00{preOrderID}</h1>
              </div>
            </div>
            <div className="">
                <h1 className="text-sm font-PoppinsL">
                  Customer Name: {selectedCustomer.shop_name}
                </h1>
              <h1 className="text-sm font-PoppinsL">
                Date: {formattedDate}
              </h1>
              <h1 className="text-sm font-PoppinsL">
                Time: {currentTime}
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
                setRestock = {setRestock}
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
                Create a Pre Order
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

export default CreatePreOrder;
