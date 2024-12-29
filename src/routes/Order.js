import fs from "fs";
import express from "express";
import { createInvoice } from "../utils/invoice.js";

const router = express.Router();

// Route to generate and download the invoice as a PDF
router.get("/invoice/:orderId", async (req, res) => {
  console.log(`Generating invoice for order`);
  const { orderId } = req.params;

  const orderDetails = {
    product: { title: "Sample Product" },
    orderId: "123456789",
    orderDate: "2024-08-12",
    orderPrice: 1000.0,
    invoiceNumber: "INV-2024-001",
    invoiceDate: "2024-08-12",
    totalAmount: 1180.0,
    taxRate: 18,
    taxAmount: 180.0,
    discount: 50.0,
    sellerInfo: {
      name: "R K WorldInfocom Pvt. Ltd.",
      address: "Address details ...",
      pan: "ABCDE1234F",
      gst: "27ABCDE1234F1Z5",
    },
  };
  const pdfBytes = await createInvoice(orderDetails);
  // Save or send the PDF file using pdfBytes

  try {
    const pdfBuffer = await createInvoice(orderDetails);
    const buffer = Buffer.from(pdfBuffer);

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${orderId}.pdf`
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).send("Error generating invoice");
  }
});

router.get("/:orderId", async (req, res) => {
  console.log("hello");
  const { orderId } = req.params;

  // Dummy order details, replace this with a database call
  const orderDetails = {
    orderId: orderId,
    orderDate: "2024-08-08",
    orderPrice: 100,
    orderAddress: "123 Main St, City, Country",
    trackingInfo: "Shipped via XYZ, Tracking No. 123456789",
    product: {
      id: "product123",
      title: "Sample Product",
      thumbnail: "https://example.com/sample-thumbnail.jpg",
    },
  };

  res.json(orderDetails);
});

export default router;
