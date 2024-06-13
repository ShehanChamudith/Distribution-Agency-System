const nodemailer = require("nodemailer");

const sendEmail = (pdfData, preOrderData) => {
  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "schamudith@gmail.com",
      pass: "20010504",
    },
  });

  // Email options
  const mailOptions = {
    from: "schamudith@gmail.com",
    to: "ukshehanchamudith@gmail.com",
    subject: "Stock Request Invoice",
    text: "Please find attached the stock request invoice.",
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfData.split("data:application/pdf;base64,")[1],
        encoding: "base64",
      },
    ],
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = { sendEmail };
