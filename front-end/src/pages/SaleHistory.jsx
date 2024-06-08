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

function SaleHistory() {
  const [preorders, setLoadings] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [uuserID, setUserID] = useState(null);
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
    axios
      .get("http://localhost:3001/getsales")
      .then((response) => {
        const salesData = response.data;
        setLoadings(salesData);
        console.log(response.data);
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
    setOpenRow((prevOpenRow) =>
      prevOpenRow === saleID ? null : saleID
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
    const saleID = pre.saleID.toString().toLowerCase();
    const shop_name = pre.shop_name.toString().toLowerCase();
    const userID = pre.userID;
    const matchesTextFilter =
      saleID.includes(filter.toLowerCase()) ||
      shop_name.includes(filter.toLowerCase());

    if (userInfo === 3 ) {
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
          <Tab label="All Sales" />
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
                      <StyledTableCell>Sale ID</StyledTableCell>
                      <StyledTableCell>Customer</StyledTableCell>
                      <StyledTableCell>Area</StyledTableCell>
                      <StyledTableCell>Billed by</StyledTableCell>
                      <StyledTableCell>Sale Amount ( LKR )</StyledTableCell>
                      <StyledTableCell>Payment Type</StyledTableCell>
                      <StyledTableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPreOrders.map((pre) => (
                      <React.Fragment key={pre.saleID}>
                        <TableRow>
                          <TableCell>
                            {new Date(pre.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{pre.saleID}</TableCell>
                          <TableCell>{pre.shop_name}</TableCell>
                          <TableCell>{pre.area}</TableCell>
                          <TableCell >{pre.user_firstname} {pre.user_lastname}</TableCell>
                          <TableCell >{pre.sale_amount}</TableCell>
                          <TableCell >{pre.payment_type}</TableCell>
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
                                      {PreOrderProductsMap[pre.saleID].map(
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

export default SaleHistory;
