import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TextField from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

// Custom styles for the table headers
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#6573c3", // Change to your desired color
  color: "white", // Text color
}));

const FilterBox = styled(Box)({
  display: "flex",
  gap: "10px",
  alignItems: "center",
  padding: "5px", // Adjust padding as needed
  backgroundColor: "#f5f5f5",
  position: "sticky",
  top: 0,
  zIndex: 1,
  borderBottom: "1px solid #ddd",
});

const ScrollableTableContainer = styled(TableContainer)({
  maxHeight: "75vh", // Adjust height as needed
  overflowY: "auto",
});

function GetPreOrderSent() {
  const [loadings, setLoadings] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [userID, setUserID] = useState(null);
  const [ccustomerID, setcustomerID] = useState("");

  const decodeTokenFromLocalStorage = () => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo(decodedToken.usertypeID);
        setUserID(decodedToken.userID);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  useEffect(() => {
    // Decode token when component mounts
    decodeTokenFromLocalStorage();
  }, []);

  useEffect(() => {
    if (userID && userInfo === 6) {
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
  }, [userID, userInfo]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getpreorder")
      .then((response) => {
        const loadingData = response.data.loadingResults;
        setLoadings(loadingData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Extract unique loading IDs
  const uniqueLoadings = Array.from(
    new Set(loadings.map((loading) => loading.preorderID))
  ).map((preorderID) => {
    return loadings.find((loading) => loading.preorderID === preorderID);
  });

  // Group products under each loading ID
  const loadingProductsMap = loadings.reduce((acc, loading) => {
    if (!acc[loading.preorderID]) {
      acc[loading.preorderID] = [];
    }
    acc[loading.preorderID].push(loading);
    return acc;
  }, {});

  const handleClick = (preorderID) => {
    setOpenRow((prevOpenRow) => (prevOpenRow === preorderID ? null : preorderID));
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDateFilterChange = (newValue) => {
    setDateFilter(newValue);
  };

  const handleClearFilters = () => {
    setFilter("");
    setDateFilter(null);
  };

  // Filter unique loadings based on the filter
  const filteredLoadings = uniqueLoadings.filter((loading) => {
    const preorderID = loading.preorderID.toString().toLowerCase();
    const cus_firstname = loading.customer_firstname.toString().toLowerCase();
    const customerID = loading.customerID;
    const matchesTextFilter =
    preorderID.includes(filter.toLowerCase()) ||
    cus_firstname.includes(filter.toLowerCase());

    if (userInfo === 6) {
      if (dateFilter) {
        const selectedDate = dayjs(dateFilter).startOf("day");
        const loadingDate = dayjs(new Date(loading.date)).startOf("day");
        return (
          matchesTextFilter &&
          selectedDate.isSame(loadingDate) &&
          customerID === ccustomerID
        );
      }
      return matchesTextFilter && customerID === ccustomerID;
    } else {
      if (dateFilter) {
        const selectedDate = dayjs(dateFilter).startOf("day");
        const loadingDate = dayjs(new Date(loading.date)).startOf("day");
        return matchesTextFilter && selectedDate.isSame(loadingDate);
      }
      return matchesTextFilter;
    }
  });

  const handleCompleteLoading = (preorderID) => {
    axios
      .put("http://localhost:3001/update-loading-status", { preorderID })
      .then((response) => {
        console.log("Loading status updated successfully:", response.data);
        // Handle success, such as updating UI or showing a confirmation message
      })
      .catch((error) => {
        console.error("Error updating loading status:", error);
        // Handle error
      });

    window.location.reload();
  };

  const handleEditLoading = (preorderID) => {
    // Fetch the previously created loading information using the loadingID
    axios
      .get(`http://localhost:3001/getloadingID/${preorderID}`)
      .then((response) => {
        const loadingData = response.data; // Assuming the response contains the loading data
        console.log(loadingData);

        // Navigate to "/edit-loading" and pass the data as state
        navigate("/edit-loading", { state: { loadingData } });
      })
      .catch((error) => {
        console.error("Error fetching loading information:", error);
        // Handle error
      });
  };

  return (
    <div>
      <div className="w-screen px-20 py-5 h-[87vh]">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Paper>
            <FilterBox>
              <TextField
                className="w-72"
                label="Filter by Loading ID or Rep Name"
                variant="outlined"
                value={filter}
                onChange={handleFilterChange}
              />
              <DatePicker
                label="Filter by Date"
                value={dateFilter}
                onChange={handleDateFilterChange}
                slotProps={{
                  textField: { style: { width: "200px" } },
                }}
              />
              <Button className="h-14" variant="outlined" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </FilterBox>
            <ScrollableTableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Pre Order ID</StyledTableCell>
                    <StyledTableCell>Customer</StyledTableCell>
                    <StyledTableCell>Pre Order Status</StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLoadings.map((loading) => (
                    <React.Fragment key={loading.preorderID}>
                      <TableRow>
                        <TableCell>
                          {new Date(loading.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{loading.preorderID}</TableCell>
                        <TableCell>{loading.customer_firstname}</TableCell>
                        <TableCell align="right">
                          <Box display="flex" gap={2}>
                            {loading.pre_order_status}
                            {/* <Button
                              variant="contained"
                              disabled={loading.loading_status === "completed"}
                              onClick={() =>
                                handleEditLoading(loading.loadingID)
                              }
                            >
                              Edit Loading
                            </Button> */}
                            {/* <Button
                              variant="contained"
                              color="success"
                              onClick={() =>
                                handleCompleteLoading(loading.loadingID)
                              } // Pass loadingID as argument
                              disabled={loading.loading_status === "completed"}
                            >
                              {loading.loading_status === "completed"
                                ? "Completed"
                                : "Complete Loading"}
                            </Button> */}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleClick(loading.preorderID)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }} // Added styles for alignment
                          >
                            {openRow === loading.preorderID ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                            <span>Pre Order Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={4}
                        >
                          <Collapse
                            in={openRow === loading.preorderID}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box margin={1}>
                              <TableContainer component={Paper}>
                                <Table
                                  sx={{ minWidth: 200 }}
                                  size="small"
                                  aria-label="product table"
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Product</TableCell>
                                      <TableCell>Quantity</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {loadingProductsMap[loading.preorderID].map(
                                      (product) => (
                                        <TableRow key={product.productID}>
                                          <TableCell component="th" scope="row">
                                            {product.product_name}
                                          </TableCell>
                                          <TableCell>
                                            {product.quantity}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </ScrollableTableContainer>
          </Paper>
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default GetPreOrderSent;
