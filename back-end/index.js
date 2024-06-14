const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const cron = require('node-cron');
const multer = require("multer");
const nodemailer = require("nodemailer");
const DBconnect = require('./config/DBconnect');



// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }); 

  const upload = multer({ storage: storage });

  app.post("/uploadpdf", upload.single("file"), (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.file.filename);
    res.json({ filePath });
  });

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "schamudith66@gmail.com",
    pass: "twkm dzla rgcs qhgs",
  },
});

const checkQuantities = () => {
  DBconnect.query('SELECT * FROM product WHERE stock_total < threshold', (err, results) => {
    if (err) throw err;

    results.forEach(product => {
      // Send email notification
      const mailOptions = {
        from: 'schamudith66@gmail.com',
        to: 'ukshehanchamudith@gmail.com',
        subject: `Low Stock Alert: ${product.product_name}`,
        text: `The quantity of ${product.product_name} is below the threshold. Current quantity: ${product.total_stock}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email: ', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    });
  });
};


const checkExpiringProducts = () => {
  const query = `
    SELECT p.product_name, i.expire_date 
    FROM product p
    JOIN inventory i ON p.productID = i.productID
    WHERE i.expire_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 10 DAY)
  `;

  DBconnect.query(query, (err, results) => {
    if (err) throw err;

    results.forEach(product => {
      // Send email notification
      const mailOptions = {
        from: 'schamudith66@gmail.com',
        to: 'ukshehanchamudith@gmail.com',
        subject: `Expiring Soon: ${product.product_name}`,
        text: `The product ${product.product_name} is expiring soon. \n\nExpiration date: ${product.expire_date}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email: ', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    });
  });
};




// Schedule the checkQuantities function to run every hour
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled task to check product quantities.');
  checkQuantities();
});

// Schedule the checkQuantities function to run every minute
// cron.schedule('* * * * *', () => {
//   console.log('Running scheduled task to check product quantities.');
//   checkQuantities();
//   checkExpiringProducts();
// });


// cron.schedule('*/30 * * * * *', () => {
//   console.log('Running scheduled task to check product quantities and expirations.');
//   checkQuantities();
//   checkExpiringProducts();
// });




app.use(cors());
app.use(express.json());

const authRoute = require("./routes/authRoute");
app.use("/", authRoute);

const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

const getRoute = require("./routes/getRoute");
app.use("/", getRoute);

const itemRoute = require("./routes/itemRoute");
app.use("/", itemRoute);

const inventoryRoute = require("./routes/inventoryRoute");
app.use("/", inventoryRoute);

const saleRoute = require("./routes/saleRoute");
app.use("/", saleRoute);

const loadingRoute = require("./routes/loadingRoute");
app.use("/", loadingRoute);

const preOrderRoute = require("./routes/preOrderRoute");
app.use("/", preOrderRoute);

const paymentRoute = require("./routes/paymentRoute");
app.use("/", paymentRoute);

const reportRoute = require("./routes/reportsRoute");
app.use("/", reportRoute); 


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the Express server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
