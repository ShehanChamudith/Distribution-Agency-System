import React, { useState, useEffect } from "react";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Swal from "sweetalert2";

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

function SaleHistory() {
  const [preorders, setLoadings] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [uuserID, setUserID] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [creditSales, setCreditSales] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedPaymentID, setSelectedPaymentID] = useState(null);

  const handleOpenDialog = (paymentID) => {
    setSelectedPaymentID(paymentID);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePaymentAmountChange = (event) => {
    const value = event.target.value;
    if (value >= 0) {
      setPaymentAmount(value);
    }
  };

  const handleSettleUp = () => {
    if (selectedPaymentID && paymentAmount > 0) {
      axios.get(`http://localhost:3001/getpaymentstatus/${selectedPaymentID}`)
        .then(response => {
          const paymentStatus = response.data.payment_status;
          const creditAmount = response.data.credit_amount; // Ensure this matches the column name from your database
  
          console.log("Payment Status:", paymentStatus);
          console.log("Credit Amount:", creditAmount);
          console.log("Entered Payment Amount:", paymentAmount);
  
          if (paymentStatus !== "fully paid") {
            if (Number(paymentAmount) === Number(creditAmount)) {
              // Add a new row to the payment table
              axios.post(`http://localhost:3001/updatepayment/${selectedPaymentID}`)
                .then(() => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Payment Settled Successfully!',
                    timer: 2000,
                    showConfirmButton: false
                  });
                  setOpenDialog(false);
                  fetchCreditSales(); // Fetch credit sales after full payment
                })
                .catch(error => {
                  console.error("Error adding payment:", error);
                });
            } else if (Number(paymentAmount) < Number(creditAmount)) {
              // Deduct paymentAmount from credit_amount in credit_sale table
              axios.post(`http://localhost:3001/deductcreditamount/${selectedPaymentID}`, { paymentAmount })
                .then(() => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Payment Partially Settled.',
                    timer: 2000,
                    showConfirmButton: false
                  });
                  setOpenDialog(false);
                  fetchCreditSales(); // Fetch credit sales after partial payment
                })
                .catch(error => {
                  console.error("Error deducting credit amount:", error);
                });
            } else {
              alert("Invalid payment amount or payment status.");
            }
          } else {
            alert("Payment is already fully settled.");
          }
        })
        .catch(error => {
          console.error("Error fetching payment status:", error);
        });
    } else {
      alert("Please enter a valid payment amount.");
    }
  };
  
  
  
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
    decodeTokenFromLocalStorage();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getsales")
      .then((response) => {
        const salesData = response.data;
        setLoadings(salesData);
        //console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Extract unique loading IDs
  const uniquePreOrders = Array.from(
    new Set(preorders.map((pre) => pre.saleID))
  ).map((saleID) => {
    return preorders.find((pre) => pre.saleID === saleID);
  });

  // Group products under each loading ID
  const PreOrderProductsMap = preorders.reduce((acc, pre) => {
    if (!acc[pre.saleID]) {
      acc[pre.saleID] = [];
    }
    acc[pre.saleID].push(pre);
    return acc;
  }, {});

  const handleClick = (saleID) => {
    setOpenRow((prevOpenRow) => (prevOpenRow === saleID ? null : saleID));
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
    const saleID = pre.saleID.toString().toLowerCase();
    const shop_name = pre.shop_name.toString().toLowerCase();
    const area = pre.area.toLowerCase();
    const paymentType = pre.payment_type.toLowerCase();
    const userName = `${pre.user_firstname} ${pre.user_lastname}`.toLowerCase();
    const userID = pre.userID;

    const matchesTextFilter =
      saleID.includes(filter.toLowerCase()) ||
      shop_name.includes(filter.toLowerCase()) ||
      area.includes(filter.toLowerCase()) ||
      paymentType.includes(filter.toLowerCase()) ||
      userName.includes(filter.toLowerCase());

    if (paymentType === "credit") {
      return false;
    }

    if (userInfo === 3) {
      if (dateFilter) {
        const selectedDate = dayjs(dateFilter).startOf("day");
        const loadingDate = dayjs(new Date(pre.date)).startOf("day");
        return (
          matchesTextFilter &&
          selectedDate.isSame(loadingDate) &&
          userID === uuserID
        );
      }
      return matchesTextFilter && userID === uuserID;
    } else {
      if (dateFilter) {
        const selectedDate = dayjs(dateFilter).startOf("day");
        const preorderDate = dayjs(new Date(pre.date)).startOf("day");
        return matchesTextFilter && selectedDate.isSame(preorderDate);
      }
      return matchesTextFilter;
    }
  });

  const filteredCreditSales = creditSales.filter((pre) => {
    const saleID = pre.saleID.toString().toLowerCase();
    const shop_name = pre.shop_name.toString().toLowerCase();
    const area = pre.area.toLowerCase();
    const paymentType = pre.payment_type.toLowerCase();
    const userName = `${pre.user_firstname} ${pre.user_lastname}`.toLowerCase();
    const userID = pre.userID;

    const matchesTextFilter =
      saleID.includes(filter.toLowerCase()) ||
      shop_name.includes(filter.toLowerCase()) ||
      area.includes(filter.toLowerCase()) ||
      paymentType.includes(filter.toLowerCase()) ||
      userName.includes(filter.toLowerCase());

    

    if (userInfo === 3) {
      if (dateFilter) {
        const selectedDate = dayjs(dateFilter).startOf("day");
        const loadingDate = dayjs(new Date(pre.date)).startOf("day");
        return (
          matchesTextFilter &&
          selectedDate.isSame(loadingDate) &&
          userID === uuserID
        );
      }
      return matchesTextFilter && userID === uuserID;
    } else {
      if (dateFilter) {
        const selectedDate = dayjs(dateFilter).startOf("day");
        const preorderDate = dayjs(new Date(pre.date)).startOf("day");
        return matchesTextFilter && selectedDate.isSame(preorderDate);
      }
      return matchesTextFilter;
    }
  });

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const fetchCreditSales = () => {
    return axios.get("http://localhost:3001/getcreditsales")
      .then((response) => {
        setCreditSales(response.data);
      })
      .catch((error) => {
        console.error("Error fetching credit sales:", error);
        return [];
      });
  };
  
  useEffect(() => {
    fetchCreditSales()
  }, []);
  

  return (
    <div>
      <div className="w-screen px-20 py-5 h-[85vh]">
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Cash and Cheque Sales" />
          <Tab label="Credit Sales" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper>
              <FilterBox className="w-full p-3 justify-end">
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
              <ScrollableTableContainer
                style={{ maxHeight: "calc(80vh - 160px)" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Sale ID</StyledTableCell>
                      <StyledTableCell>Customer</StyledTableCell>
                      <StyledTableCell>Area</StyledTableCell>
                      <StyledTableCell>Billed by</StyledTableCell>
                      <StyledTableCell>Sale Amount ( LKR )</StyledTableCell>
                      <StyledTableCell>Payment Type</StyledTableCell>
                      <StyledTableCell>Paid Amount</StyledTableCell>
                      <StyledTableCell>Balance</StyledTableCell>
                      <StyledTableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPreOrders?.map((pre) => (
                      <React.Fragment key={pre.saleID}>
                        <TableRow>
                          <TableCell>
                            {new Date(pre.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{pre.saleID}</TableCell>
                          <TableCell>{pre.shop_name}</TableCell>
                          <TableCell>{pre.area}</TableCell>
                          <TableCell>
                            {pre.user_firstname} {pre.user_lastname}
                          </TableCell>
                          <TableCell>{pre.sale_amount}</TableCell>
                          <TableCell>{pre.payment_type}</TableCell>
                          <TableCell>
                            {pre.payment_type === "cash"
                              ? pre.cash_amount
                              : pre.cheque_value}
                          </TableCell>
                          <TableCell>{Math.abs(pre.cash_balance)}</TableCell>
                          <TableCell align="right">
                            <Button
                              aria-label="expand row"
                              size="small"
                              onClick={() => handleClick(pre.saleID)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }} // Added styles for alignment
                            >
                              {openRow === pre.saleID ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                              <span>Sale Details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={4}
                          >
                            <Collapse
                              in={openRow === pre.saleID}
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
                                      {PreOrderProductsMap[pre.saleID]?.map(
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
              <FilterBox className="w-full p-3 justify-end">
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
              <ScrollableTableContainer
                style={{ maxHeight: "calc(80vh - 160px)" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Sale ID</StyledTableCell>
                      <StyledTableCell>Customer</StyledTableCell>
                      <StyledTableCell>Area</StyledTableCell>
                      <StyledTableCell>Billed by</StyledTableCell>
                      <StyledTableCell>Sale Amount ( LKR )</StyledTableCell>
                      <StyledTableCell>Credited Amount</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                      <StyledTableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCreditSales?.map((pre) => (
                      <React.Fragment key={pre.saleID}>
                        <TableRow>
                          <TableCell>
                            {new Date(pre.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{pre.saleID}</TableCell>
                          <TableCell>{pre.shop_name}</TableCell>
                          <TableCell>{pre.area}</TableCell>
                          <TableCell>
                            {pre.firstname} {pre.lastname}
                          </TableCell>
                          <TableCell>{pre.sale_amount}</TableCell>
                          <TableCell>{pre.credit_amount}</TableCell>
                          <TableCell>
                            <Box>
                              <Button
                                onClick={() => handleOpenDialog(pre.paymentID)}
                                color="primary"
                                variant="contained"
                              >
                                Settle Up
                              </Button>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              aria-label="expand row"
                              size="small"
                              onClick={() => handleClick(pre.saleID)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }} // Added styles for alignment
                            >
                              {openRow === pre.saleID ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                              <span>Sale Details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={7}
                          >
                            <Collapse
                              in={openRow === pre.saleID}
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
                                      {PreOrderProductsMap[pre.saleID]?.map(
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

                  <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Settle Up</DialogTitle>
                    <DialogContent>
                      <div className="py-3">
                        <TextField
                          label="Payment Amount"
                          type="number"
                          value={paymentAmount}
                          onChange={handlePaymentAmountChange}
                          fullWidth
                        />
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleSettleUp} color="primary">
                        Settle Up
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Table>
              </ScrollableTableContainer>
            </Paper>
          </LocalizationProvider>
        </TabPanel>
      </div>
    </div>
  );
}

export default SaleHistory;
