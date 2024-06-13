import React, { useState, useRef } from "react";
import { TextField, Button, MenuItem, Grid, Typography } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from "react-chartjs-2";

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
  });
  const [salesData, setSalesData] = useState([]);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

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
      const response = await axios.post("http://localhost:3001/salesreport", filters);
      setSalesData(response.data);
    } catch (error) {
      console.error("Error fetching sales data", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Report', 10, 10);

    const chartData = {
        labels: salesData.map((sale) => sale.date.substring(0, 10)),
      datasets: [
        {
          label: 'Sales Amount',
          data: salesData.map((sale) => sale.sale_amount),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };

    const chartCanvas = canvasRef.current;
    const ctx = chartCanvas.getContext('2d');

    // Ensure previous chart is destroyed
    if (window.chartInstance) {
      window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true, // Disable responsiveness to get a fixed size
        animation: {
          onComplete: () => {
            // Convert canvas to image
            const imageUrl = chartCanvas.toDataURL();
            
            // Add image to PDF
            doc.addImage(imageUrl, 'PNG', 10, 20, 190, 150);

            // Save PDF
            doc.save('sales_report.pdf');
          }
        }
      }
    });
  };

  return (
    <div className="h-[88vh] overflow-y-auto px-14 py-10">
      <div className="flex flex-col border border-red-500 gap-5">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <div>
              <Typography variant="h6">Select a Report Type</Typography>
            </div>
            <div className="mt-6">
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
            <div className="mt-6">
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
                    label="Customer ID"
                    name="customerID"
                    value={filters.customerID}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="User ID"
                    name="userID"
                    value={filters.userID}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={generatePDF}
                  >
                    Export to PDF
                  </Button>
                </Grid>
              </Grid>
            </div>
          </>
        )}
      </div>

      {salesData.length > 0 && reportType === "Sales Report" && (
        <>
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
            style={{ display: 'none' }}
          />
        </>
      )}
    </div>
  );
};

export default FilterSales;
