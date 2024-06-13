import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

// Register Chart.js components
Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const FilterSales = () => {
  const [reportType, setReportType] = useState("Sales Report");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    paymentType: "",
    customerID: "",
    userID: "",
    productID: "",
    supplierID: "",
  });
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await axios.get(
          "http://localhost:3001/getcustomer"
        );
        setCustomers(customerResponse.data);

        const userResponse = await axios.get(
          "http://localhost:3001/repandware"
        );
        setUser(userResponse.data);

        const productResponse = await axios.get(
          "http://localhost:3001/inventory"
        );
        setProducts(productResponse.data);

        const supplierResponse = await axios.get(
          "http://localhost:3001/getsupplier"
        );
        setSuppliers(supplierResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      let url = "";
      let setData = null;

      switch (reportType) {
        case "Sales Report":
          url = "http://localhost:3001/salesreport";
          setData = setSalesData;
          break;
        case "Inventory Report":
          url = "http://localhost:3001/inventoryreport";
          setData = setInventoryData;
          break;
        case "Payment Log":
          url = "http://localhost:3001/paymentlogreport";
          setData = setLogData;
          break;
        default:
          break;
      }

      const response = await axios.post(url, filters);

      if (response.data.length === 0) {
        Swal.fire({
          icon: "error",
          title: "No matching data found!",
        });
      } else {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching report data", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const shopInfo = {
      name: "Maleesha Distribution Agency",
      address: "Atakalanpanna, Kahawatta",
      tel: "077-4439693",
    };
    const pageWidth = doc.internal.pageSize.getWidth();
    const shopNameWidth = doc.getTextDimensions(shopInfo.name).w;
    doc.text(shopInfo.name, (pageWidth - shopNameWidth) / 2, 15);
    const addressWidth = doc.getTextDimensions(shopInfo.address).w;
    doc.text(shopInfo.address, (pageWidth - addressWidth) / 2, 23);
    const telWidth = doc.getTextDimensions(`Tel: ${shopInfo.tel}`).w;
    doc.text(`Tel: ${shopInfo.tel}`, (pageWidth - telWidth) / 2, 31);
    doc.setFontSize(16);
    doc.text(reportType, 10, 50);

    doc.setFontSize(12);
    const dateRange = `${filters.startDate ? filters.startDate : "N/A"} to ${
      filters.endDate ? filters.endDate : "N/A"
    }`;
    doc.text(`Date Range: ${dateRange}`, 10, 68);

    if (reportType === "Sales Report") {
      const selectedCustomer = customers.find(
        (customer) => customer.customerID === filters.customerID
      );
      const customerName = selectedCustomer
        ? selectedCustomer.shop_name
        : "All Customers";
      const paymentType = filters.paymentType || "All";
      doc.text(`Customer: ${customerName}`, 10, 60);
      doc.text(`Payment Type: ${paymentType}`, 10, 76);

      autoTable(doc, {
        startY: 90,
        head: [
          ["Date", "Customer", "Sale Amount", "Payment Type", "Billed by"],
        ],
        body: salesData.map((sale) => [
          sale.date.substring(0, 10),
          sale.shop_name,
          sale.sale_amount,
          sale.payment_type,
          sale.firstname,
        ]),
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      const chartData = {
        labels: salesData.map((sale) => sale.date.substring(0, 10)),
        datasets: [
          {
            label: "Sales Amount",
            data: salesData.map((sale) => sale.sale_amount),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      };

      const chartCanvas = canvasRef.current;
      const ctx = chartCanvas.getContext("2d");

      if (window.chartInstance) {
        window.chartInstance.destroy();
      }

      window.chartInstance = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          animation: {
            onComplete: () => {
                const imageUrl = chartCanvas.toDataURL();
                const remainingPageSpace = doc.internal.pageSize.getHeight() - finalY;
                const imageHeight = 90; // Height of the chart image
    
                if (imageHeight > remainingPageSpace) {
                  doc.addPage(); // Add new page if current page space is not enough
                  doc.addImage(imageUrl, "PNG", 10, 10, 190, 90);
                } else {
                  doc.addImage(imageUrl, "PNG", 10, finalY, 190, 90);
                }
    
                doc.save(`${reportType.toLowerCase().replace(" ", "_")}.pdf`);
            },
          },
        },
      });
    } else if (reportType === "Inventory Report") {
      const selectedProduct = products.find(
        (product) => product.productID === filters.productID
      );
      const productName = selectedProduct
        ? selectedProduct.product_name
        : "All Products";
      const selectedSupplier = suppliers.find(
        (supplier) => supplier.supplierID === filters.supplierID
      );
      const supplierName = selectedSupplier
        ? selectedSupplier.supplier_name
        : "All Suppliers";
      doc.text(`Product: ${productName}`, 10, 60);
      doc.text(`Supplier: ${supplierName}`, 10, 76);

      autoTable(doc, {
        startY: 90,
        head: [["Date", "Product", "Stock Arrival", "Supplier", "Batch No"]],
        body: inventoryData.map((inventory) => [
          inventory.purchase_date.substring(0, 10),
          inventory.product_name,
          inventory.stock_arrival,
          inventory.supplier_company,
          inventory.batch_no,
        ]),
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      const chartData = {
        labels: inventoryData.map((inventory) =>
          inventory.purchase_date.substring(0, 10)
        ),
        datasets: [
          {
            label: "Stock Arrival",
            data: inventoryData.map((inventory) => inventory.stock_arrival),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      };

      const chartCanvas = canvasRef.current;
      const ctx = chartCanvas.getContext("2d");

      if (window.chartInstance) {
        window.chartInstance.destroy();
      }

      window.chartInstance = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          animation: {
            onComplete: () => {
                const imageUrl = chartCanvas.toDataURL();
                const remainingPageSpace = doc.internal.pageSize.getHeight() - finalY;
                const imageHeight = 90; // Height of the chart image
    
                if (imageHeight > remainingPageSpace) {
                  doc.addPage(); // Add new page if current page space is not enough
                  doc.addImage(imageUrl, "PNG", 10, 10, 190, 90);
                } else {
                  doc.addImage(imageUrl, "PNG", 10, finalY, 190, 90);
                }
    
                doc.save(`${reportType.toLowerCase().replace(" ", "_")}.pdf`);
            },
          },
        },
      });
    } else if (reportType === "Payment Log") {
      const selectedCustomer = customers.find(
        (customer) => customer.customerID === filters.customerID
      );
      const customerName = selectedCustomer
        ? selectedCustomer.shop_name
        : "All Customers";
      const paymentType = filters.paymentType || "All";
      doc.text(`Customer: ${customerName}`, 10, 60);
      doc.text(`Payment Type: ${paymentType}`, 10, 76);

      autoTable(doc, {
        startY: 90,
        head: [["Date", "Customer", "Payment Type", "Amount"]],
        body: logData.map((log) => [
          new Date(log.date).toLocaleDateString(),
          log.shop_name,
          log.payment_type,
          log.amount,
        ]),
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      const chartData = {
        labels: logData.map((log) => new Date(log.date).toLocaleDateString()),
        datasets: [
          {
            label: "Amount",
            data: logData.map((log) => log.amount),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      };

      const chartCanvas = canvasRef.current;
      const ctx = chartCanvas.getContext("2d");

      if (window.chartInstance) {
        window.chartInstance.destroy();
      }

      window.chartInstance = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          animation: {
            onComplete: () => {
                const imageUrl = chartCanvas.toDataURL();
                const remainingPageSpace = doc.internal.pageSize.getHeight() - finalY;
                const imageHeight = 90; // Height of the chart image
    
                if (imageHeight > remainingPageSpace) {
                  doc.addPage(); // Add new page if current page space is not enough
                  doc.addImage(imageUrl, "PNG", 10, 10, 190, 90);
                } else {
                  doc.addImage(imageUrl, "PNG", 10, finalY, 190, 90);
                }
    
                doc.save(`${reportType.toLowerCase().replace(" ", "_")}.pdf`);
            },
          },
        },
      });
    }
  };

  return (
    <div className="h-[88vh] overflow-y-auto px-14 py-10">
      <div className="flex flex-col gap-5">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <div>
              <Typography variant="h6">Select a Report Type</Typography>
            </div>
            <div className="mt-4 mb-4">
              <TextField
                label="Report Type"
                select
                value={reportType}
                onChange={handleReportTypeChange}
                fullWidth
              >
                <MenuItem value="Sales Report">Sales Report</MenuItem>
                <MenuItem value="Inventory Report">Inventory Report</MenuItem>
                <MenuItem value="Payment Log">Payment Log</MenuItem>
                <MenuItem value="Stock Requests Report">
                  Stock Requests Report
                </MenuItem>
              </TextField>
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="">
        {reportType === "Sales Report" && (
          <>
            <div className="mb-2">
              <Typography variant="h6">Filtering Options</Typography>
            </div>
            <div className="mt-4">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="End Date"
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Payment Type"
                    select
                    name="paymentType"
                    value={filters.paymentType}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Customer"
                    select
                    name="customerID"
                    value={filters.customerID}
                    onChange={handleChange}
                    fullWidth
                  >
                    {customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.customerID}>
                        {customer.shop_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Billed by"
                    select
                    name="userID"
                    value={filters.userID}
                    onChange={handleChange}
                    fullWidth
                  >
                    {user.map((customer) => (
                      <MenuItem key={customer.id} value={customer.userID}>
                        {customer.firstname}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Filter
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={generatePDF}
                      disabled={salesData.length === 0}
                    >
                      Export to PDF
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </>
        )}
      </div>

      {/* Sales Report */}
      {salesData.length > 0 && reportType === "Sales Report" && (
        <Grid container spacing={2} className="mt-6">
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Sale Amount</TableCell>
                    <TableCell>Payment Type</TableCell>
                    <TableCell>Billed by</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date.substring(0, 10)}</TableCell>
                      <TableCell>{sale.shop_name}</TableCell>
                      <TableCell>{sale.sale_amount}</TableCell>
                      <TableCell>{sale.payment_type}</TableCell>
                      <TableCell>{sale.firstname}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Bar
              ref={chartRef}
              data={{
                labels: salesData.map((sale) => sale.date.substring(0, 10)),
                datasets: [
                  {
                    label: "Sales Amount",
                    data: salesData.map((sale) => sale.sale_amount),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                ],
              }}
            />
            <canvas
              ref={canvasRef}
              width={1000} // Increased width for better resolution
              height={600} // Increased height for better resolution
              style={{ display: "none" }}
            />
          </Grid>
        </Grid>
      )}

      <div className="">
        {reportType === "Inventory Report" && (
          <>
            <div className="mb-2">
              <Typography variant="h6">Filtering Options</Typography>
            </div>
            <div className="mt-4">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="End Date"
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Product Name"
                    select
                    name="productID"
                    value={filters.productID}
                    onChange={handleChange}
                    fullWidth
                  >
                    {products.map((product) => (
                      <MenuItem
                        key={product.productID}
                        value={product.productID}
                      >
                        {product.product_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Supplier"
                    select
                    name="supplierID"
                    value={filters.supplierID}
                    onChange={handleChange}
                    fullWidth
                  >
                    {suppliers.map((supplier) => (
                      <MenuItem
                        key={supplier.supplierID}
                        value={supplier.supplierID}
                      >
                        {supplier.supplier_company}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Filter
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={generatePDF}
                      disabled={inventoryData.length === 0}
                    >
                      Export to PDF
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </>
        )}
      </div>

      {/* Inventory Report */}
      {inventoryData.length > 0 && reportType === "Inventory Report" && (
        <Grid container spacing={2} className="mt-6">
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Stock Arrival</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>Expire Date</TableCell>
                    <TableCell>Product</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventoryData.map((item) => (
                    <TableRow key={item.inventoryID}>
                      <TableCell>{item.stock_arrival}</TableCell>
                      <TableCell>{item.supplier_company}</TableCell>
                      <TableCell>
                        {new Date(item.purchase_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(item.expire_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item.product_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Bar
              ref={chartRef}
              data={{
                labels: inventoryData.map((item) => item.productID),
                datasets: [
                  {
                    label: "Stock Arrival",
                    data: inventoryData.map((item) => item.stock_arrival),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                ],
              }}
            />
            <canvas
              ref={canvasRef}
              width={1000} // Increased width for better resolution
              height={600} // Increased height for better resolution
              style={{ display: "none" }}
            />
          </Grid>
        </Grid>
      )}

      <div>
        {reportType === "Payment Log" && (
          <>
            <div className="mb-2">
              <Typography variant="h6">Filtering Options</Typography>
            </div>
            <div className="mt-4">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="End Date"
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Customer"
                    select
                    name="customerID"
                    value={filters.customerID}
                    onChange={handleChange}
                    fullWidth
                  >
                    {customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.customerID}>
                        {customer.shop_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Payment Type"
                    select
                    name="paymentType"
                    value={filters.paymentType}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Filter
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={generatePDF}
                      disabled={logData.length === 0}
                    >
                      Export to PDF
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </>
        )}
      </div>

      {/* Payment Log */}
      {logData.length > 0 && reportType === "Payment Log" && (
        <Grid container spacing={2} className="mt-6">
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Payment Type</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logData.map((log) => (
                    <TableRow key={log.logID}>
                      <TableCell>
                        {new Date(log.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{log.shop_name}</TableCell>
                      <TableCell>{log.payment_type}</TableCell>
                      <TableCell>{log.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Bar
              ref={chartRef}
              data={{
                labels: logData.map((log) =>
                  new Date(log.date).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: "Amount",
                    data: logData.map((log) => log.amount),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Date",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Amount",
                    },
                  },
                },
              }}
            />
            <canvas
              ref={canvasRef}
              width={1000} // Increased width for better resolution
              height={600} // Increased height for better resolution
              style={{ display: "none" }}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default FilterSales;
