import React, { useState, useEffect } from "react";
import { LineGraph } from "../components/LineGraph";
import DoughnutGraph from "../components/DoughnutGraph";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Swal from "sweetalert2";

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
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const Admin = () => {
  const [value, setValue] = React.useState(0);
  const [users, setUsers] = useState([]);
  const [area, setArea] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [openNewCustomerDialog, setOpenNewCustomerDialog] = useState(false);
  const [customerData, setcustomerData] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    supplier_company: "",
    shop_name: "",
    
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedUserType, setselectedUserType] = useState("");
  const [usertypeID, setUsertypeID] = useState("");
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const [editUserID, setEditUserID] = useState("");
  const [areaID, setSelectedArea] = useState('');

  const handleChangeForm = (event) => {
    const { name, value } = event.target;
    let newValue = value;
    // If the field is "phone", limit the input to 10 characters
    if (name === "phone") {
      newValue = value.slice(0, 10); // Only take the first 10 characters
    }
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setcustomerData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    }
};


  const handleUserTypeChange = (event) => {
    setselectedUserType(event.target.value);
    // Map selectedUserType to usertypeID
    switch (event.target.value) {
      case "Office Staff":
        setUsertypeID(2);
        break;
      case "Sales Representative":
        setUsertypeID(3);
        break;
      case "Warehouse Staff":
        setUsertypeID(4);
        break;
      case "Supplier":
        setUsertypeID(5);
        break;
      case "Customer":
        setUsertypeID(6);
        break;
      default:
        setUsertypeID(null);
    }
  };

  const handleNewCustomerDialogClose = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to proceed without adding a new user?",
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (customerData.password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const newData = { ...customerData, usertypeID, areaID };

    const checkData = {
        username: newData.username,
        phone: newData.phone,
    };

    // Include userID if updating an existing user
    if (newData.userID) {
        checkData.userID = newData.userID;
    }

    // Check if the username or phone number already exists
    axios
        .post("http://localhost:3001/checkUserExistence", checkData)
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
                // Handle form submission, e.g., send data to the server
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
                            supplier_company: "",
                        });
                        setConfirmPassword("");

                        Swal.fire({
                            icon: "success",
                            title: "User Added Successfully!",
                            customClass: {
                                popup: "z-50",
                            },
                            didOpen: () => {
                                document.querySelector(".swal2-container").style.zIndex = "9999";
                            },
                        }).then(() => {
                            fetchUserData();
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


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

  const handleClick = (usertypeID) => {
    setOpenRow((prevOpenRow) =>
      prevOpenRow === usertypeID ? null : usertypeID
    );
  };

  const fetchUserData = () => {
    axios
      .get("http://localhost:3001/getuser")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/getuser")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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

  const ScrollableTableContainer = styled(TableContainer)({
    maxHeight: "75vh", // Adjust height as needed
    overflowY: "auto",
  });

  const FilterBox = styled(Box)({
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "15px", // Adjust padding as needed
    backgroundColor: "#f5f5f5",
    position: "sticky",
    top: 0,
    zIndex: 1,
    borderBottom: "1px solid #ddd",
  });

  useEffect(() => {
    if (customerData.usertypeID) {
      switch (customerData.usertypeID) {
        case 2:
          setselectedUserType("Office Staff");
          break;
        case 3:
          setselectedUserType("Sales Representative");
          break;
        case 4:
          setselectedUserType("Warehouse Staff");
          break;
        case 5:
          setselectedUserType("Supplier");
          break;
        case 6:
          setselectedUserType("Customer");
          break;
        default:
          setselectedUserType("");
      }
    }
  }, [customerData.usertypeID]);

  const handleEditUser = (event) => {
    event.preventDefault();

    axios
      .get(`http://localhost:3001/getuser/${editUserID}`)
      .then((response) => {
        const userData = response.data[0]; // Assuming response.data is an array

        // Map the fetched data to the state structure
        setcustomerData({
          userID: userData.userID,
          username: userData.username,
          password: "", // Usually, you wouldn't prefill the password for security reasons
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          area: userData.area || "",
          shop_name: userData.shop_name || "",
          supplier_company: userData.supplier_company || "",
        });

        console.log(userData);
        setOpenEditUserDialog(false);
        setOpenNewCustomerDialog(true);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  return (
    <div>
      <div className="w-screen px-20 py-5 h-[85vh]">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Overview" {...a11yProps(0)} />
              <Tab label="Users" {...a11yProps(1)} />
              {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="flex w-full ">
              <div className="flex w-full -300 gap-4">
                <div className="flex flex-col w-4/6 p-2 border rounded-xl ml-6 mt-5">
                  <h1 className=" font-PoppinsM text-xl pl-2"> Sales </h1>
                  <div>
                    <LineGraph />
                  </div>
                </div>

                <div className="flex flex-col w-2/6 p-2 border rounded-xl mr-6 mt-5">
                  <h1 className=" font-PoppinsM text-xl pl-2"> Inventory </h1>
                  <div>
                    <DoughnutGraph />
                  </div>
                </div>
              </div>
            </div>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <Paper>
              <FilterBox className="w-full p-3 justify-end">
                <Button
                  variant="contained"
                  onClick={() => setOpenNewCustomerDialog(true)}
                >
                  Add User
                </Button>

                <Button
                  variant="contained"
                  onClick={() => setOpenEditUserDialog(true)}
                >
                  Edit User
                </Button>
              </FilterBox>
              <ScrollableTableContainer
                style={{ maxHeight: "calc(80vh - 160px)" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>
                        Existing Users In the System
                      </StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Sales Representatives Section */}
                    <TableRow>
                      <TableCell>Sales Representatives</TableCell>
                      <TableCell align="right">
                        <Button
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleClick(3)} // Pass usertypeID for Sales Representatives
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          {openRow === 3 ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                          <span>User Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={4}
                      >
                        <Collapse
                          in={openRow === 3}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <TableContainer component={Paper}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                User Details:
                              </Typography>
                              <Table
                                sx={{ minWidth: 200 }}
                                size="small"
                                aria-label="user table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>User ID</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Address</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {users
                                    .filter((user) => user.usertypeID === 3) // Filter users where usertypeID equals 3 for Sales Representatives
                                    .map((user) => (
                                      <TableRow key={user.userID}>
                                        <TableCell>{user.userID}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.firstname}</TableCell>
                                        <TableCell>{user.lastname}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>

                    {/* Warehouse Staff Section */}
                    <TableRow>
                      <TableCell>Warehouse Staff</TableCell>
                      <TableCell align="right">
                        <Button
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleClick(4)} // Pass usertypeID for Warehouse Staff
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          {openRow === 4 ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                          <span>User Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={4}
                      >
                        <Collapse
                          in={openRow === 4}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <TableContainer component={Paper}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                User Details:
                              </Typography>
                              <Table
                                sx={{ minWidth: 200 }}
                                size="small"
                                aria-label="user table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>User ID</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Address</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {users
                                    .filter((user) => user.usertypeID === 4) // Filter users where usertypeID equals 4 for Warehouse Staff
                                    .map((user) => (
                                      <TableRow key={user.userID}>
                                        <TableCell>{user.userID}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.firstname}</TableCell>
                                        <TableCell>{user.lastname}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>

                    {/* Office Staff Section */}
                    <TableRow>
                      <TableCell>Office Staff</TableCell>
                      <TableCell align="right">
                        <Button
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleClick(2)} // Pass usertypeID for Office Staff
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          {openRow === 2 ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                          <span>User Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={4}
                      >
                        <Collapse
                          in={openRow === 2}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <TableContainer component={Paper}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                User Details:
                              </Typography>
                              <Table
                                sx={{ minWidth: 200 }}
                                size="small"
                                aria-label="user table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>User ID</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Address</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {users
                                    .filter((user) => user.usertypeID === 2) // Filter users where usertypeID equals 2 for Office Staff
                                    .map((user) => (
                                      <TableRow key={user.userID}>
                                        <TableCell>{user.userID}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.firstname}</TableCell>
                                        <TableCell>{user.lastname}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>

                    {/* Customers Section */}
                    <TableRow>
                      <TableCell>Customers</TableCell>
                      <TableCell align="right">
                        <Button
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleClick(6)} // Pass usertypeID for Customers
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          {openRow === 6 ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                          <span>User Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={4}
                      >
                        <Collapse
                          in={openRow === 6}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <TableContainer component={Paper}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                User Details:
                              </Typography>
                              <Table
                                sx={{ minWidth: 200 }}
                                size="small"
                                aria-label="user table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>User ID</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Address</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {users
                                    .filter((user) => user.usertypeID === 6) // Filter users where usertypeID equals 6 for Customers
                                    .map((user) => (
                                      <TableRow key={user.userID}>
                                        <TableCell>{user.userID}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.firstname}</TableCell>
                                        <TableCell>{user.lastname}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>

                    {/* Suppliers Section */}
                    <TableRow>
                      <TableCell>Suppliers</TableCell>
                      <TableCell align="right">
                        <Button
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleClick(5)} // Pass usertypeID for Suppliers
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          {openRow === 5 ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                          <span>User Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={4}
                      >
                        <Collapse
                          in={openRow === 5}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <TableContainer component={Paper}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                User Details:
                              </Typography>
                              <Table
                                sx={{ minWidth: 200 }}
                                size="small"
                                aria-label="user table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>User ID</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Address</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {users
                                    .filter((user) => user.usertypeID === 5) // Filter users where usertypeID equals 5 for Suppliers
                                    .map((user) => (
                                      <TableRow key={user.userID}>
                                        <TableCell>{user.userID}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.firstname}</TableCell>
                                        <TableCell>{user.lastname}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ScrollableTableContainer>
            </Paper>
          </CustomTabPanel>

          <Dialog
            open={openNewCustomerDialog}
            onClose={handleNewCustomerDialogClose}
            PaperProps={{
              component: "form",
              onSubmit: handleSubmit,
            }}
          >
            <DialogTitle>
              {customerData.userID ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {customerData.userID
                  ? "Edit the details of the user."
                  : "To add a new user, please enter the details here."}
              </DialogContentText>

              <div className="flex gap-5">
                <TextField
                  required
                  label="First Name"
                  name="firstname"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={customerData.firstname}
                  onChange={handleChangeForm}
                />
                <TextField
                  required
                  label="Last Name"
                  name="lastname"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={customerData.lastname}
                  onChange={handleChangeForm}
                />
              </div>

              <TextField
                required
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={customerData.email}
                onChange={handleChangeForm}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="usertype-label">Select User Type</InputLabel>
                <Select
                  required
                  labelId="usertype-label"
                  value={selectedUserType}
                  onChange={handleUserTypeChange}
                  label="Select User Type"
                >
                  <MenuItem value={"Sales Representative"}>
                    Sales Representative
                  </MenuItem>
                  <MenuItem value={"Warehouse Staff"}>Warehouse Staff</MenuItem>
                  <MenuItem value={"Office Staff"}>Office Staff</MenuItem>
                  <MenuItem value={"Customer"}>Customer</MenuItem>
                  <MenuItem value={"Supplier"}>Supplier</MenuItem>
                </Select>
              </FormControl>

              {selectedUserType !== "Supplier" && (
                <>
                  <TextField
                    required
                    label="Username"
                    name="username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customerData.username}
                    onChange={handleChangeForm}
                  />
                </>
              )}

              {selectedUserType === "Customer" && (
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
              )}

              {selectedUserType === "Customer" && (
                <TextField
                  required
                  label="Shop Name"
                  name="shop_name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={customerData.shop_name}
                  onChange={handleChangeForm}
                />
              )}

              {selectedUserType === "Supplier" && (
                <TextField
                  required
                  label="Company Name"
                  name="supplier_company"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={customerData.supplier_company}
                  onChange={handleChangeForm}
                />
              )}

              {selectedUserType !== "Supplier" && (
                <div className="flex gap-5">
                  <TextField
                    required
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
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
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={handleChangeForm}
                  />
                </div>
              )}

              <TextField
                required
                label="Phone"
                name="phone"
                variant="outlined"
                fullWidth
                margin="normal"
                value={customerData.phone}
                onChange={handleChangeForm}
              />
              <TextField
                required
                label="Address"
                name="address"
                variant="outlined"
                fullWidth
                margin="normal"
                value={customerData.address}
                onChange={handleChangeForm}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNewCustomerDialogClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {customerData.userID ? "Update User" : "Add New User"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openEditUserDialog}
            onClose={() => setOpenEditUserDialog(false)}
          >
            <DialogTitle>Enter User ID to Edit</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="User ID"
                type="text"
                fullWidth
                value={editUserID}
                onChange={(e) => setEditUserID(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenEditUserDialog(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={handleEditUser} color="primary">
                Edit
              </Button>
            </DialogActions>
          </Dialog>

          {/* <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel> */}
        </Box>
      </div>
    </div>
  );
};

export default Admin;
