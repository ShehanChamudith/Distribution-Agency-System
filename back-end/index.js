const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const multer = require("multer");
const nodemailer = require("nodemailer");


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

// Email options
// const mailOptions = {
//   from: "schamudith66@gmail.com",
//   to: "ukshehanchamudith@gmail.com",
//   subject: "Stock Request Invoice",
//   text: "Please find attached the stock request invoice.",
// };

// Send email
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error("Error sending email:", error);
//     res.status(500).send("Error sending email");
//   } else {
//     console.log("Email sent:", info.response);
//     res.send("Email sent successfully");
//   }
// });


app.post("/sendemail", (req, res) => {
    const { to, subject, body, attachment } = req.body;
  
    const mailOptions = {
      from: "schamudith66@gmail.com",
      to: to,
      subject: subject,
      text: body,
      attachments: [{ path: attachment }],
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "Email sent successfully" });
      }
    });
  });





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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the Express server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
