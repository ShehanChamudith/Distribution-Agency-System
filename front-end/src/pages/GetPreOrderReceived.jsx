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

function GetPreOrderReceived() {
  const [loadings, setLoadings] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const navigate = useNavigate();
  const [rrepID, setrepID] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [userID, setUserID] = useState(null);

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
    if (userID && userInfo === 3) {
      axios
        .get(`http://localhost:3001/getrepID/${userID}`)
        .then((response) => {
          const repData = response.data;
          setrepID(repData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [userID, userInfo]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getloading")
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
    new Set(loadings.map((loading) => loading.loadingID))
  ).map((loadingID) => {
    return loadings.find((loading) => loading.loadingID === loadingID);
  });

  // Group products under each loading ID
  const loadingProductsMap = loadings.reduce((acc, loading) => {
    if (!acc[loading.loadingID]) {
      acc[loading.loadingID] = [];
    }
    acc[loading.loadingID].push(loading);
    return acc;
  }, {});

  const handleClick = (loadingID) => {
    setOpenRow((prevOpenRow) => (prevOpenRow === loadingID ? null : loadingID));
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
    const loadingID = loading.loadingID.toString().toLowerCase();
    const rep_firstname = loading.rep_firstname.toString().toLowerCase();
    const repID = loading.repID;
    const matchesTextFilter =
      loadingID.includes(filter.toLowerCase()) ||
      rep_firstname.includes(filter.toLowerCase());

    if (userInfo === 3) {
      if (dateFilter) {
        const selectedDate = dayjs(dateFilter).startOf("day");
        const loadingDate = dayjs(new Date(loading.date)).startOf("day");
        return (
          matchesTextFilter &&
          selectedDate.isSame(loadingDate) &&
          repID === rrepID
        );
      }
      return matchesTextFilter && repID === rrepID;
    } else {
      if (dateFilter) {
        const selectedDate = dayjs(dateFilter).startOf("day");
        const loadingDate = dayjs(new Date(loading.date)).startOf("day");
        return matchesTextFilter && selectedDate.isSame(loadingDate);
      }
      return matchesTextFilter;
    }
  });

  const handleCompleteLoading = (loadingID) => {
    axios
      .put("http://localhost:3001/update-loading-status", { loadingID })
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

  const handleEditLoading = (loadingID) => {
    // Fetch the previously created loading information using the loadingID
    axios
      .get(`http://localhost:3001/getloadingID/${loadingID}`)
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
                    <StyledTableCell>Loading ID</StyledTableCell>
                    <StyledTableCell>Sales Representative</StyledTableCell>
                    <StyledTableCell>Vehicle Number</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLoadings.map((loading) => (
                    <React.Fragment key={loading.loadingID}>
                      <TableRow>
                        <TableCell>
                          {new Date(loading.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{loading.loadingID}</TableCell>
                        <TableCell>{loading.rep_firstname}</TableCell>
                        <TableCell>{loading.vehicle_number}</TableCell>
                        <TableCell align="right">
                          <Box display="flex" gap={2}>
                            <Button
                              variant="contained"
                              disabled={loading.loading_status === "completed"}
                              onClick={() =>
                                handleEditLoading(loading.loadingID)
                              }
                            >
                              Edit Loading
                            </Button>
                            <Button
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
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleClick(loading.loadingID)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }} // Added styles for alignment
                          >
                            {openRow === loading.loadingID ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                            <span>Loading Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={4}
                        >
                          <Collapse
                            in={openRow === loading.loadingID}
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
                                    {loadingProductsMap[loading.loadingID].map(
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

export default GetPreOrderReceived;
