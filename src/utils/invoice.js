// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// export async function createInvoice(orderDetails) {
//   const pdfDoc = await PDFDocument.create();

//   const width = 400;
//   const height = 500;
//   const page = pdfDoc.addPage([width, height]);

//   const { product, orderId, orderDate, orderPrice, orderAddress } =
//     orderDetails;

//   const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
//   const leftMargin = 20;
//   const topMargin = 30;
//   const fontSize = 12;

//   page.drawText(`Invoice for Order ID: ${orderId}`, {
//     x: width - leftMargin,
//     y: height - topMargin,
//     size: fontSize + 4,
//     font: timesRomanFont,
//     color: rgb(0, 0, 0),
//   });

//   page.drawText(`Product: ${product.title}`, {
//     x: 50,
//     y: 520,
//     size: fontSize,
//     font: timesRomanFont,
//     color: rgb(0, 0, 0),
//   });

//   page.drawText(`Order Date: ${orderDate}`, {
//     x: 50,
//     y: 500,
//     size: fontSize,
//     font: timesRomanFont,
//     color: rgb(0, 0, 0),
//   });

//   page.drawText(`Price: $${orderPrice}`, {
//     x: 50,
//     y: 480,
//     size: fontSize,
//     font: timesRomanFont,
//     color: rgb(0, 0, 0),
//   });

//   page.drawText(`Shipping Address: ${orderAddress}`, {
//     x: 50,
//     y: 460,
//     size: fontSize,
//     font: timesRomanFont,
//     color: rgb(0, 0, 0),
//   });

//   page.drawText("Thank you for your purchase!", {
//     x: 50,
//     y: 200,
//     size: fontSize + 2,
//     font: timesRomanFont,
//     color: rgb(0, 0, 0),
//   });

//   // console.log(page);

//   const pdfBytes = await pdfDoc.save();
//   return pdfBytes;
// }

import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

// Function to load the custom font from a URL
async function loadFont(url) {
  const response = await fetch(url);
  return await response.arrayBuffer();
}

export async function createInvoice(orderDetails) {
  const pdfDoc = await PDFDocument.create();

  // Embed the custom font in the PDF document
  pdfDoc.registerFontkit(fontkit);

  // Load the custom font from Google Fonts
  const fontBytes = await loadFont(
    "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxK.woff2"
  );
  const customFont = await pdfDoc.embedFont(fontBytes);

  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89; // A4 height in points
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  const {
    product,
    orderId,
    orderDate,
    orderPrice,
    orderAddress,
    invoiceNumber,
    invoiceDate,
    totalAmount,
    taxRate,
    taxAmount,
    discount,
    sellerInfo,
  } = orderDetails;

  const leftMargin = 50;
  const fontSize = 12;

  // Header Section
  page.drawText("Tax Invoice/Bill of Supply/Cash Memo", {
    x: leftMargin,
    y: pageHeight - 50,
    size: fontSize + 2,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("(Original for Recipient)", {
    x: leftMargin,
    y: pageHeight - 70,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // Order and Invoice Details
  page.drawText(`Order Number: ${orderId}`, {
    x: leftMargin,
    y: pageHeight - 100,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Invoice Number: ${invoiceNumber}`, {
    x: leftMargin + 250,
    y: pageHeight - 100,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Order Date: ${orderDate}`, {
    x: leftMargin,
    y: pageHeight - 120,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Invoice Date: ${invoiceDate}`, {
    x: leftMargin + 250,
    y: pageHeight - 120,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // Product Table Header
  const tableTop = pageHeight - 160;
  const columnWidths = [50, 250, 80, 80, 80];

  page.drawText("Sl. No", {
    x: leftMargin,
    y: tableTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Description", {
    x: leftMargin + columnWidths[0],
    y: tableTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Unit Price", {
    x: leftMargin + columnWidths[0] + columnWidths[1],
    y: tableTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Qty", {
    x: leftMargin + columnWidths[0] + columnWidths[1] + columnWidths[2],
    y: tableTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Total", {
    x:
      leftMargin +
      columnWidths[0] +
      columnWidths[1] +
      columnWidths[2] +
      columnWidths[3],
    y: tableTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // Product Details
  const productTop = tableTop - 20;

  page.drawText("1", {
    x: leftMargin,
    y: productTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`${product.title}`, {
    x: leftMargin + columnWidths[0],
    y: productTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`₹${orderPrice.toFixed(2)}`, {
    x: leftMargin + columnWidths[0] + columnWidths[1],
    y: productTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("1", {
    x: leftMargin + columnWidths[0] + columnWidths[1] + columnWidths[2],
    y: productTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`₹${orderPrice.toFixed(2)}`, {
    x:
      leftMargin +
      columnWidths[0] +
      columnWidths[1] +
      columnWidths[2] +
      columnWidths[3],
    y: productTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // Tax, Discount, and Total Section
  const detailsTop = productTop - 40;

  page.drawText(`Tax Rate: ${taxRate}%`, {
    x: leftMargin,
    y: detailsTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Tax Amount: ₹${taxAmount.toFixed(2)}`, {
    x: leftMargin + 150,
    y: detailsTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Discount: ₹${discount.toFixed(2)}`, {
    x: leftMargin + 300,
    y: detailsTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  const totalTop = detailsTop - 20;

  page.drawText(`Total: ₹${totalAmount.toFixed(2)}`, {
    x:
      leftMargin +
      columnWidths[0] +
      columnWidths[1] +
      columnWidths[2] +
      columnWidths[3],
    y: totalTop,
    size: fontSize + 2,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // Seller Information Section
  const sellerTop = totalTop - 40;

  page.drawText("Sold By:", {
    x: leftMargin,
    y: sellerTop,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(sellerInfo.name, {
    x: leftMargin + 50,
    y: sellerTop - 20,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(sellerInfo.address, {
    x: leftMargin + 50,
    y: sellerTop - 40,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`PAN No: ${sellerInfo.pan}`, {
    x: leftMargin,
    y: sellerTop - 80,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`GST Registration No: ${sellerInfo.gst}`, {
    x: leftMargin,
    y: sellerTop - 100,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Authorized Signatory", {
    x: leftMargin,
    y: sellerTop - 140,
    size: fontSize,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
