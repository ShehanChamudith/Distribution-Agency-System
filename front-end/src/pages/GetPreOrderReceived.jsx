import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";


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

const ScrollableTableContainer = styled(TableContainer)({
  maxHeight: "75vh", // Adjust height as needed
  overflowY: "auto",
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingY: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function GetPreOrderReceived() {
  const [preorders, setLoadings] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [userID, setUserID] = useState(null);
  const [ccustomerID, setcustomerID] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [totals, setTotals] = useState([]);

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
  const uniquePreOrders = Array.from(
    new Set(preorders.map((pre) => pre.preorderID))
  ).map((preorderID) => {
    return preorders.find((pre) => pre.preorderID === preorderID);
  });

  // Group products under each loading ID
  const PreOrderProductsMap = preorders.reduce((acc, pre) => {
    if (!acc[pre.preorderID]) {
      acc[pre.preorderID] = [];
    }
    acc[pre.preorderID].push(pre);
    return acc;
  }, {});

  const handleClick = (preorderID) => {
    setOpenRow((prevOpenRow) =>
      prevOpenRow === preorderID ? null : preorderID
    );
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter unique loadings based on the filter
  const filteredPreOrders = uniquePreOrders.filter((pre) => {
    const preorderID = pre.preorderID.toString().toLowerCase();
    const cus_firstname = pre.customer_firstname.toString().toLowerCase();
    const customerID = pre.customerID;
    const matchesTextFilter =
      preorderID.includes(filter.toLowerCase()) ||
      cus_firstname.includes(filter.toLowerCase());

    if (userInfo === 6) {
      if (dateFilter) {
        const selectedDate = dayjs(dateFilter).startOf("day");
        const loadingDate = dayjs(new Date(pre.date)).startOf("day");
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
        const preorderDate = dayjs(new Date(pre.date)).startOf("day");
        return matchesTextFilter && selectedDate.isSame(preorderDate);
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

  useEffect(() => {
    axios
      .get("http://localhost:3001/getpreordertotal")
      .then((response) => {
        setTotals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pre-order totals:", error);
      });
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const handleProcessPreOrders = () => {
    // Fetch the previously created pre order information using the preorderID
    axios
      .get(`http://localhost:3001/load-preorders`)
      .then((response) => {
        const preOrderData = response.data; // Assuming the response contains the loading data
        console.log(preOrderData);

        // Navigate to "/edit-loading" and pass the data as state
        navigate("/create-loading-pre-orders", { state: { preOrderData } });
      })
      .catch((error) => {
        console.error("Error fetching pre order information:", error);
        // Handle error
      });
  };

  

  return (
    <div>
      <div className="w-screen px-20 py-5 h-[85vh]">
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Pre Orders" />
          <Tab label="Totals of Pending Pre Orders" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper>
              <FilterBox className="w-full p-3 justify-end">
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
                <Button
                  className="h-14"
                  variant="outlined"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </FilterBox>
              <ScrollableTableContainer
                style={{ maxHeight: "calc(80vh - 160px)" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Pre Order ID</StyledTableCell>
                      <StyledTableCell>Customer</StyledTableCell>
                      <StyledTableCell>Area</StyledTableCell>
                      <StyledTableCell>Pre Order Status</StyledTableCell>
                      <StyledTableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPreOrders.map((pre) => (
                      <React.Fragment key={pre.preorderID}>
                        <TableRow>
                          <TableCell>
                            {new Date(pre.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{pre.preorderID}</TableCell>
                          <TableCell>{pre.customer_firstname}</TableCell>
                          <TableCell>{pre.area}</TableCell>
                          <TableCell align="right">
                            <Box display="flex" gap={2}>
                              {pre.pre_order_status}
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
                              onClick={() => handleClick(pre.preorderID)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }} // Added styles for alignment
                            >
                              {openRow === pre.preorderID ? (
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
                              in={openRow === pre.preorderID}
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
                                      {PreOrderProductsMap[pre.preorderID].map(
                                        (product) => (
                                          <TableRow key={product.productID}>
                                            <TableCell
                                              component="th"
                                              scope="row"
                                            >
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
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper>
              <FilterBox className="w-full p-3 justify-between">
                <Box>
                  <Button
                    className="h-14"
                    variant="contained"
                    onClick={handleProcessPreOrders}
                  >
                    Create a Loading of Pre Orders
                  </Button>
                </Box>
                <Box className="flex gap-4">
                  <TextField
                    className="w-72"
                    label="Filter by Product Name or Supplier"
                    variant="outlined"
                    value={filter}
                    onChange={handleFilterChange}
                  />
                  <Button
                    className="h-14"
                    variant="outlined"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </FilterBox>
              <ScrollableTableContainer
                style={{ maxHeight: "calc(80vh - 160px)" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Product Name</StyledTableCell>
                      <StyledTableCell align="center">
                        Total Quantity ( kg )
                      </StyledTableCell>
                      <StyledTableCell align="right">Supplier</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {totals
                      .filter((row) => {
                        const productName = row.product_name.toLowerCase();
                        const supplierCompany =
                          row.supplier_company.toLowerCase();
                        const matchesFilter =
                          productName.includes(filter.toLowerCase()) ||
                          supplierCompany.includes(filter.toLowerCase());
                        return matchesFilter;
                      })
                      .map((row) => (
                        <StyledTableRow key={row.product_name}>
                          <StyledTableCell component="th" scope="row">
                            {row.product_name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.total_quantity}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row.supplier_company}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </ScrollableTableContainer>
            </Paper>
          </LocalizationProvider>
        </TabPanel>
      </div>
    </div>
  );
}

export default GetPreOrderReceived;
