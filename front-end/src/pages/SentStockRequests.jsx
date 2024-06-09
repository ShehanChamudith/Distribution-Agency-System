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
import {jwtDecode} from "jwt-decode";
import Typography from '@mui/material/Typography';

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

function SentStockRequests() {
  const [loadings, setLoadings] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const navigate = useNavigate();
  const [repID, setRepID] = useState("");
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
          setRepID(repData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [userID, userInfo]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getstockrequests")
      .then((response) => {
        const loadingData = response.data;
        setLoadings(loadingData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Extract unique loadings
  const uniqueLoadings = Array.from(
    new Set(loadings.map((loading) => loading.requestID))
  ).map((requestID) => {
    return loadings.find((loading) => loading.requestID === requestID);
  });

  // Group products under each loading ID
  const loadingProductsMap = loadings.reduce((acc, loading) => {
    if (!acc[loading.requestID]) {
      acc[loading.requestID] = [];
    }
    acc[loading.requestID].push(loading);
    return acc;
  }, {});

  const handleClick = (requestID) => {
    setOpenRow((prevOpenRow) => (prevOpenRow === requestID ? null : requestID));
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
    const requestID = loading.requestID.toString().toLowerCase();
    const supplier = loading.supplier_company.toString().toLowerCase();

    const matchesTextFilter =
      requestID.includes(filter.toLowerCase()) ||
      supplier.includes(filter.toLowerCase());

    if (dateFilter) {
      const selectedDate = dayjs(dateFilter).startOf("day");
      const loadingDate = dayjs(new Date(loading.date)).startOf("day");
      return matchesTextFilter && selectedDate.isSame(loadingDate);
    }
    return matchesTextFilter;
  });

  return (
    <div>
      <div className="w-screen px-20 py-5 h-[87vh]">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Paper>
            <FilterBox>
              <TextField
                className="w-72"
                label="Filter"
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
              <Button
                className="h-14"
                variant="outlined"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </FilterBox>
            <ScrollableTableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Request ID</StyledTableCell>
                    <StyledTableCell>Supplier</StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLoadings.map((loading) => (
                    <React.Fragment key={loading.requestID}>
                      <TableRow>
                        <TableCell>{new Date(loading.date).toLocaleDateString()}</TableCell>
                        <TableCell>{loading.requestID}</TableCell>
                        <TableCell>{loading.supplier_company}</TableCell>
                        <TableCell align="right">
                          <Button
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleClick(loading.requestID)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }} // Added styles for alignment
                          >
                            {openRow === loading.requestID ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                            <span>Request Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={4}
                        >
                          <Collapse
                            in={openRow === loading.requestID}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box margin={1}>
                              <TableContainer component={Paper}>
                                <Typography variant="h6" gutterBottom component="div">Stock Request Details:</Typography>
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
                                    {loadingProductsMap[loading.requestID].map(
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
                              <div className="flex flex-col gap-3 mt-5">
                                <h1>Notes :</h1>
                                <a>{loading.notes}</a>
                              </div>
                              
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

export default SentStockRequests;
