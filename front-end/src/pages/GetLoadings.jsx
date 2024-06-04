import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
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

// Custom styles for the table headers
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#6573c3", // Change to your desired color
  color: "white", // Text color
}));

function GetLoadings() {
  const [loadings, setLoadings] = useState([]);
  const [open, setOpen] = useState({});
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);

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
    setOpen((prevOpen) => ({
      ...prevOpen,
      [loadingID]: !prevOpen[loadingID],
    }));
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDateFilterChange = (newValue) => {
    setDateFilter(newValue);
  };

  // Filter unique loadings based on the filter
  const filteredLoadings = uniqueLoadings.filter((loading) => {
    const loadingID = loading.loadingID.toString().toLowerCase();
    const matchesTextFilter = loadingID.includes(filter.toLowerCase());

    if (dateFilter) {
      const selectedDate = dayjs(dateFilter).startOf("day");
      const loadingDate = dayjs(new Date(loading.date)).startOf("day");
      return matchesTextFilter && selectedDate.isSame(loadingDate);
    }
    return matchesTextFilter;
  });

  return (
    <div>
      <div className="w-screen border border-red-400 px-20 py-10">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TableContainer component={Paper}>
            <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                label="Filter by Loading ID "
                variant="outlined"
                value={filter}
                onChange={handleFilterChange}
              />
              <DatePicker
                label="Filter by Date"
                value={dateFilter}
                onChange={handleDateFilterChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Loading ID</StyledTableCell>
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
                      <TableCell align="right">
                        <Box display="flex" gap={1}>
                          <Button variant="outlined" color="error">
                            Reject
                          </Button>
                          <Button variant="contained" color="success">
                            Accept
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
                          {open[loading.loadingID] ? (
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
                          in={open[loading.loadingID]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <h3>Products:</h3>
                            <ul>
                              {loadingProductsMap[loading.loadingID].map(
                                (product) => (
                                  <li key={product.productID}>
                                    {product.product_name} - Quantity:{" "}
                                    {product.quantity}
                                  </li>
                                )
                              )}
                            </ul>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default GetLoadings;
