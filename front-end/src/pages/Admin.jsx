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
import WhatshotIcon from "@mui/icons-material/Whatshot";
import CountUp from "react-countup";

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
    backgroundColor: "#6573c3",
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
  const [vehicle, setVehicle] = useState([]);
  const [areaActive, setAreaActive] = useState([]);
  const [vehicleActive, setVehicleActive] = useState([]);
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
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);
  const [editUserID, setEditUserID] = useState("");
  const [deleteUserID, setDeleteUserID] = useState("");
  const [areaID, setSelectedArea] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const [bestArea, setBestArea] = useState(null);
  const [totalMonth, settotalMonth] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [areas, setAreas] = useState([]);
  const [openAddAreaDialog, setOpenAddAreaDialog] = useState(false);
  const [openAddVehicleDialog, setOpenAddVehicleDialog] = useState(false);
  const [openEditAreaDialog, setOpenEditAreaDialog] = useState(false);
  const [openEditVehicleDialog, setOpenEditVehicleDialog] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [editArea, setEditArea] = useState(null);
  const [editVehicle, setEditVehicle] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/gettopsales");
        setTopProducts(response.data);
      } catch (error) {
        console.error("Error fetching top selling products:", error);
      }
    };

    fetchTopProducts();
  }, []);

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
                  document.querySelector(".swal2-container").style.zIndex =
                    "9999";
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

  // Define a function to fetch user data
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

  const fetchArea = () => {
    axios
      .get("http://localhost:3001/getarea")
      .then((response) => {
        setArea(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchAreaActive = () => {
    axios
      .get("http://localhost:3001/getareaactive")
      .then((response) => {
        setAreaActive(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchVehicleActive = () => {
    axios
      .get("http://localhost:3001/getvehicleactive")
      .then((response) => {
        setVehicleActive(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Call the fetchUserData function inside useEffect
  useEffect(() => {
    fetchUserData();
    fetchArea();
    fetchAreaActive();
    fetchVehicleActive();
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

    // Check if the user exists by sending a request to the backend
    axios
      .post("http://localhost:3001/checkUserExistence2", { userID: editUserID })
      .then((response) => {
        if (response.data.exists) {
          // If the user exists, fetch their data for editing
          axios
            .get(`http://localhost:3001/getuser/${editUserID}`)
            .then((userDataResponse) => {
              const userData = userDataResponse.data[0]; // Assuming response.data is an array

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
              fetchUserData();
              setOpenEditUserDialog(false);
              setOpenNewCustomerDialog(true);
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        } else {
          // If the user doesn't exist, show an error message using SweetAlert
          Swal.fire({
            icon: "error",
            title: "User Not Found!",
            text: "The user with the provided ID does not exist.",
            customClass: {
              popup: "z-50",
            },
            didOpen: () => {
              document.querySelector(".swal2-container").style.zIndex = "9999";
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error checking user existence:", error);
      });
  };

  const handleDeleteUser = (event) => {
    event.preventDefault();

    // Check if the user exists by sending a request to the backend
    axios
      .post("http://localhost:3001/checkUserExistence3", {
        userID: deleteUserID,
      })
      .then((response) => {
        if (response.data.exists) {
          const { usertypeID, firstname } = response.data;

          if (usertypeID === 1) {
            // If usertypeID is 1, show an error message using SweetAlert
            Swal.fire({
              icon: "error",
              title: "Admin Cannot Be Removed!",
              text: "The user with admin privileges cannot be deleted.",
              customClass: {
                popup: "z-50",
              },
              didOpen: () => {
                document.querySelector(".swal2-container").style.zIndex =
                  "9999";
              },
            });
          } else {
            // Show confirmation dialog using SweetAlert
            Swal.fire({
              icon: "warning",
              title: `Are you sure you want to delete ${firstname}?`,
              text: "This action cannot be undone.",
              showCancelButton: true,
              confirmButtonText: "Yes, delete it!",
              cancelButtonText: "Cancel",
              customClass: {
                popup: "z-50",
              },
              didOpen: () => {
                document.querySelector(".swal2-container").style.zIndex =
                  "9999";
              },
            }).then((result) => {
              if (result.isConfirmed) {
                // If user confirms, proceed with deletion
                axios
                  .put(`http://localhost:3001/deleteuser/${deleteUserID}`)
                  .then((response) => {
                    // Show success alert
                    Swal.fire({
                      icon: "success",
                      title: "User Deleted",
                      text: "The user has been deleted successfully.",
                    });

                    fetchUserData();
                    setOpenDeleteUserDialog(false);
                  })
                  .catch((error) => {
                    console.error("Error deleting user:", error);
                  });
              }
            });
          }
        } else {
          // If the user doesn't exist, show an error message using SweetAlert
          Swal.fire({
            icon: "error",
            title: "User Not Found!",
            text: "The user with the provided ID does not exist.",
            customClass: {
              popup: "z-50",
            },
            didOpen: () => {
              document.querySelector(".swal2-container").style.zIndex = "9999";
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error checking user existence:", error);
      });
  };

  useEffect(() => {
    const fetchBestArea = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getbestarea"); // Replace with your actual endpoint
        setBestArea(response.data);
      } catch (error) {
        console.error("Error fetching best area:", error);
      }
    };

    fetchBestArea();
  }, []);

  useEffect(() => {
    const fetchTotalMonth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/gettotalofmonth"
        ); // Replace with your actual endpoint
        settotalMonth(response.data);
      } catch (error) {
        console.error("Error fetching best area:", error);
      }
    };

    fetchTotalMonth();
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/getemp")
      .then((response) => response.json())
      .then((data) => {
        setTotalEmployees(data.totalEmployees);
        setTotalCustomers(data.totalCustomers);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleOpenAddAreaDialog = () => {
    setOpenAddAreaDialog(true);
  };

  const handleCloseAddAreaDialog = () => {
    // Reset the areaName state variable
    setAreaName("");
    // Close both add and edit dialogs
    setOpenAddAreaDialog(false);
    setOpenEditAreaDialog(false);
  };

  const handleCloseAddVehicleDialog = () => {
    // Reset the areaName state variable
    setVehicleName("");
    // Close both add and edit dialogs
    setOpenAddVehicleDialog(false);
    setOpenEditVehicleDialog(false);
  };

  const handleCloseEditAreaDialog = () => {
    setOpenEditAreaDialog(false);
  };

  const handleAddArea = () => {
    // Make sure areaName is not empty
    if (!areaName.trim()) {
      alert("Area Name cannot be empty");
      return;
    }

    // Show a confirmation dialog
    Swal.fire({
      icon: "info",
      title: "Add Area",
      text: "Are you sure you want to add this area?",
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      customClass: {
        popup: "z-50",
      },
      didOpen: () => {
        document.querySelector(".swal2-container").style.zIndex = "9999";
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with adding the area
        axios
          .post("http://localhost:3001/addarea", { area: areaName })
          .then((response) => {
            if (response.status === 201) {
              // Area added successfully
              fetchAreaActive();
              Swal.fire({
                icon: "success",
                title: "Area Added",
                text: "The area has been successfully added.",
                timer: 2000, // Show alert for 3 seconds
                showConfirmButton: false, // Hide the "OK" button
              });
              handleCloseAddAreaDialog();
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              // Area already exists
              Swal.fire({
                icon: "error",
                title: "Area Already Exists",
                text: "The area you are trying to add already exists.",
                customClass: {
                  popup: "z-50",
                },
                didOpen: () => {
                  document.querySelector(".swal2-container").style.zIndex =
                    "9999";
                },
              });
            } else {
              console.error("Error adding area:", error);
              alert("Failed to add area");
            }
          });
      }
    });
  };

  const handleAddVehicle = () => {
    // Make sure areaName is not empty
    if (!vehicleName.trim()) {
      alert("Vehicle Number cannot be empty");
      return;
    }

    // Show a confirmation dialog
    Swal.fire({
      icon: "info",
      title: "Add Vehicle",
      text: "Are you sure you want to add this Vehicle?",
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      customClass: {
        popup: "z-50",
      },
      didOpen: () => {
        document.querySelector(".swal2-container").style.zIndex = "9999";
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with adding the area
        axios
          .post("http://localhost:3001/addvehicle", { vehicle_number: vehicleName })
          .then((response) => {
            if (response.status === 201) {
              // Area added successfully
              fetchVehicleActive();
              Swal.fire({
                icon: "success",
                title: "Vehicle Added",
                text: "The Vehicle has been successfully added.",
                timer: 2000, // Show alert for 3 seconds
                showConfirmButton: false, // Hide the "OK" button
              });
              handleCloseAddVehicleDialog();
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              // Area already exists
              Swal.fire({
                icon: "error",
                title: "Vehicle Already Exists",
                text: "The Vehicle you are trying to add already exists.",
                customClass: {
                  popup: "z-50",
                },
                didOpen: () => {
                  document.querySelector(".swal2-container").style.zIndex =
                    "9999";
                },
              });
            } else {
              console.error("Error adding Vehicle:", error);
              alert("Failed to add Vehicle");
            }
          });
      }
    });
  };

  const handleEditArea = (areaID) => {
    // Find the area to edit
    const areaToEdit = area.find((a) => a.areaID === areaID);
    if (areaToEdit) {
      // Set the areaName state variable to the existing area's name
      setAreaName(areaToEdit.area);
      // Set the editArea state variable to the areaID
      setEditArea(areaID);
      // Open the edit dialog
      setOpenEditAreaDialog(true);
    }
  };

  const handleEditVehicle = (vehicleID) => {
    // Find the area to edit
    const vehicleToEdit = vehicleActive.find((a) => a.vehicleID === vehicleID);
    if (vehicleToEdit) {
      // Set the areaName state variable to the existing area's name
      setVehicleName(vehicleToEdit.vehicle_number);
      // Set the editArea state variable to the areaID
      setEditVehicle(vehicleID);
      // Open the edit dialog
      setOpenEditVehicleDialog(true);
    }
  };

  const handleEditAreaSubmit = () => {
    const url = `http://localhost:3001/editarea/${editArea}`;
    axios.put(url, { area_name: areaName })
      .then((response) => {
        console.log(response.data); // Handle response from the server
  
        // Close the edit dialog
        setOpenEditAreaDialog(false);
        fetchAreaActive();
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Area updated successfully',
        });
  
        // Optionally, update the areas list or notify the user
      })
      .catch((error) => {
        console.error('Error updating area:', error);
  
        // Check if error is due to existing area
        if (error.response && error.response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Area with the same name already exists',
            customClass: {
              popup: "z-50",
            },
            didOpen: () => {
              document.querySelector(".swal2-container").style.zIndex =
                "9999";
            },
          });
        } else {
          // Handle other errors
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update area',
            customClass: {
              popup: "z-50",
            },
            didOpen: () => {
              document.querySelector(".swal2-container").style.zIndex =
                "9999";
            },
          });
        }
      });
  };

  const handleEditVehicleSubmit = () => {
    const url = `http://localhost:3001/editvehicle/${editVehicle}`;
    axios.put(url, { vehicle_number: vehicleName })
      .then((response) => {
        console.log(response.data); // Handle response from the server
  
        // Close the edit dialog
        setOpenEditVehicleDialog(false);
        fetchVehicleActive();
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Vehicle updated successfully',
        });
  
        // Optionally, update the areas list or notify the user
      })
      .catch((error) => {
        console.error('Error updating vehicle:', error);
  
        // Check if error is due to existing area
        if (error.response && error.response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Vehicle with the same name already exists',
            customClass: {
              popup: "z-50",
            },
            didOpen: () => {
              document.querySelector(".swal2-container").style.zIndex =
                "9999";
            },
          });
        } else {
          // Handle other errors
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update vehicle',
            customClass: {
              popup: "z-50",
            },
            didOpen: () => {
              document.querySelector(".swal2-container").style.zIndex =
                "9999";
            },
          });
        }
      });
  };
  

  const handleDeleteArea = (areaID) => {
    // Show a confirmation dialog before deleting the area
    Swal.fire({
      icon: "warning",
      title: "Delete Area",
      text: "Are you sure you want to delete this area?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deleting the area
        axios
          .put(`http://localhost:3001/deletearea/${areaID}`)
          .then((response) => {
            if (response.status === 200) {
              // Area deleted successfully
              fetchAreaActive();
              Swal.fire({
                icon: "success",
                title: "Area Deleted",
                text: "The area has been successfully deleted.",
                timer: 2000,
                showConfirmButton: false,
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting area:", error);
            alert("Failed to delete area");
          });
      }
    });
  };

  const handleDeleteVehicle = (vehicleID) => {
    // Show a confirmation dialog before deleting the area
    Swal.fire({
      icon: "warning",
      title: "Delete Vehicle",
      text: "Are you sure you want to delete this vehicle?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deleting the area
        axios
          .put(`http://localhost:3001/deletevehicle/${vehicleID}`)
          .then((response) => {
            if (response.status === 200) {
              // Area deleted successfully
              fetchVehicleActive();
              Swal.fire({
                icon: "success",
                title: "Vehicle Deleted",
                text: "The vehicle has been successfully deleted.",
                timer: 2000,
                showConfirmButton: false,
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting vehicle:", error);
            alert("Failed to delete vehicle");
          });
      }
    });
  };

  return (
    <div>
      <div className="w-screen px-10 py-5 h-[85vh]">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Overview" {...a11yProps(0)} />
              <Tab label="Users" {...a11yProps(1)} />
              <Tab label="Selling Areas" {...a11yProps(2)} />
              <Tab label="Vehicles of the Agency" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="flex w-full  ">
              <div className="flex flex-col w-full gap-4 ">
                <div className="w-full h-[20vh] rounded-xl flex justify-between gap-14">
                  <div className="bg-white p-4 rounded-lg shadow-lg w-1/4 flex flex-col justify-center items-center">
                    <h2 className="text-center font-PoppinsR">
                      Total Sales This Month
                    </h2>
                    {totalMonth !== null ? (
                      <p className="text-center text-3xl font-PoppinsB">
                        <CountUp
                          end={totalMonth.total_amount}
                          duration={2}
                          separator=","
                        />{" "}
                        LKR
                      </p>
                    ) : (
                      <p className="text-center">Loading...</p>
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-lg w-1/4 flex flex-col justify-center items-center">
                    <h2 className="text-center font-PoppinsR">
                      Total Employees
                    </h2>
                    {totalEmployees !== null ? (
                      <p className="text-center text-3xl font-PoppinsB">
                        {totalEmployees}
                      </p>
                    ) : (
                      <p className="text-center">Loading...</p>
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-lg w-1/4 flex flex-col justify-center items-center">
                    <h2 className="text-center font-PoppinsR">
                      Total Customers
                    </h2>
                    {totalCustomers !== null ? (
                      <p className="text-center text-3xl font-PoppinsB">
                        {totalCustomers}
                      </p>
                    ) : (
                      <p className="text-center">Loading...</p>
                    )}
                  </div>
                  <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg w-1/4 justify-center items-center">
                    <h2 className="text-center font-PoppinsR">
                      Best Sales Area
                    </h2>
                    {bestArea ? (
                      <div>
                        <p className="text-center font-PoppinsM">
                          {bestArea.area}
                        </p>
                        <p className="text-center text-3xl font-PoppinsB">
                          <CountUp
                            end={bestArea.total_sale_amount}
                            duration={2}
                            separator=","
                          />{" "}
                          LKR
                        </p>
                      </div>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </div>

                <div className="w-full flex h-[50vh] gap-5">
                  <div className="flex w-4/6 border rounded-xl">
                    <div className=" w-[70%] ">
                      <h1 className=" font-PoppinsM text-md pl-6 pt-2">
                        {" "}
                        Sales of Last 7 Days{" "}
                      </h1>
                      <div>
                        <LineGraph />
                      </div>
                    </div>

                    <div className=" w-[30%] ">
                      <div>
                        <h1 className="font-PoppinsM text-md pt-2">
                          Top Selling Products{" "}
                          <WhatshotIcon
                            style={{ fontSize: "16px", color: "red" }}
                          />
                        </h1>
                      </div>
                      <div className="h-[38vh] rounded-lg bg-slate-100 mt-5 mr-5 mb-96 p-5">
                        <div className="flex justify-between text-sm font-PoppinsB pt-4">
                          <span>Product Name</span>
                          <span>Sold Quantity</span>
                        </div>
                        <ul className="font-PoppinsR space-y-2 pt-9">
                          {topProducts.map((product) => (
                            <li
                              key={product.productID}
                              className="flex justify-between"
                            >
                              <span>{product.product_name}</span>
                              <span>
                                {parseFloat(product.total_quantity).toFixed(2)}
                                kg
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-2/6 border rounded-xl">
                    <h1 className=" font-PoppinsM text-md pl-6 pt-2">
                      {" "}
                      Inventory{" "}
                    </h1>
                    <div className="flex justify-center h-[45vh]">
                      <DoughnutGraph />
                    </div>
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
                <Button
                  variant="contained"
                  onClick={() => setOpenDeleteUserDialog(true)}
                >
                  Delete User
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

          <CustomTabPanel value={value} index={2}>
            <Paper>
              <FilterBox className="w-full p-3 justify-end">
                <Button
                  variant="contained"
                  onClick={() => setOpenAddAreaDialog(true)}
                >
                  Add Area
                </Button>
              </FilterBox>
              <ScrollableTableContainer
                style={{ maxHeight: "calc(80vh - 160px)" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Area ID
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Area Name
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Actions
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {areaActive.map((area) => (
                      <TableRow key={area.areaID}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {area.areaID}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {area.area}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Button
                            variant="contained"
                            onClick={() => handleEditArea(area.areaID)}
                            sx={{ marginRight: 1 }} // Add margin to the right of the Edit button
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => handleDeleteArea(area.areaID)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollableTableContainer>
            </Paper>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={3}>
            <Paper>
              <FilterBox className="w-full p-3 justify-end">
                <Button
                  variant="contained"
                  onClick={() => setOpenAddVehicleDialog(true)}
                >
                  Add Vehicle
                </Button>
              </FilterBox>
              <ScrollableTableContainer
                style={{ maxHeight: "calc(80vh - 160px)" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                      Vehicle ID
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                      Vehicle Number
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Actions
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicleActive.map((vehicle) => (
                      <TableRow key={vehicle.vehicleID}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {vehicle.vehicleID}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {vehicle.vehicle_number}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Button
                            variant="contained"
                            onClick={() => handleEditVehicle(vehicle.vehicleID)}
                            sx={{ marginRight: 1 }} // Add margin to the right of the Edit button
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => handleDeleteVehicle(vehicle.vehicleID)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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

          <Dialog
            open={openDeleteUserDialog}
            onClose={() => setOpenDeleteUserDialog(false)}
          >
            <DialogTitle>Enter User ID to Delete</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="User ID Delete"
                type="text"
                fullWidth
                value={deleteUserID}
                onChange={(e) => setDeleteUserID(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDeleteUserDialog(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteUser} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openAddAreaDialog || openEditAreaDialog}
            onClose={handleCloseAddAreaDialog}
          >
            <DialogTitle>
              {openEditAreaDialog ? "Edit Area" : "Add Area"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Area Name"
                type="text"
                fullWidth
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddAreaDialog} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={openEditAreaDialog ? handleEditAreaSubmit : handleAddArea}
                color="primary"
              >
                {openEditAreaDialog ? "Edit" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>


          <Dialog
            open={openAddVehicleDialog || openEditVehicleDialog}
            onClose={handleCloseAddVehicleDialog}
          >
            <DialogTitle>
              {openEditVehicleDialog ? "Edit Vehicle" : "Add Vehicle"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Vehicle Number"
                type="text"
                fullWidth
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddVehicleDialog} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={openEditVehicleDialog ? handleEditVehicleSubmit : handleAddVehicle}
                color="primary"
              >
                {openEditVehicleDialog ? "Edit" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </div>
  );
};

export default Admin;
