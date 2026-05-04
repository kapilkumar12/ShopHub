// utils/downloadInvoice.js

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import logo from "../assets/images/logo.png";

export const downloadInvoice = async (order, user) => {
  try {
    const doc = new jsPDF("p", "mm", "a4");

    // ================= LOGO =================
    if (logo) {
      doc.addImage(logo, "PNG", 14, 10, 30, 15);
    }

    // ================= HEADER =================
    doc.setFontSize(18);
    doc.text("INVOICE", 150, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);

    doc.text(`Order ID: ${order?._id || "-"}`, 14, 35);
    doc.text(`Date: ${new Date(order?.createdAt).toLocaleString()}`, 14, 41);

    // ================= CUSTOMER =================
    doc.setTextColor(40);
    doc.text(`Customer: ${user?.name || "User"}`, 14, 50);
    doc.text(`Email: ${user?.email || "-"}`, 14, 56);
    doc.text(`Order Status: ${order?.status || "-"}`, 14, 62);

    // ================= ADDRESS =================
    doc.setTextColor(80);
    doc.text("Shipping Address:", 14, 72);
    doc.text(order?.address || "-", 14, 78);
    doc.text(`Phone: ${order?.phone || "-"}`, 14, 84);

    // ================= QR =================
    const qrData = `
Order ID: ${order?._id}
Amount: ${order?.totalPrice}
Status: ${order?.status}
`;
    const qrImage = await QRCode.toDataURL(qrData);
    doc.addImage(qrImage, "PNG", 150, 35, 40, 40);

    // ================= ITEMS =================
    const tableData = (order?.items || []).map((item) => [
      item?.name || "N/A",
      item?.quantity || 0,
      `Rs. ${item?.price || 0}`,
      `Rs. ${(item?.price || 0) * (item?.quantity || 0)}`,
    ]);

    if (tableData.length === 0) {
      tableData.push(["No Items", "-", "-", "-"]);
    }

    autoTable(doc, {
      startY: 95,
      head: [["Product", "Qty", "Price", "Total"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [41, 128, 185],
      },
      styles: {
        fontSize: 9,
      },
    });

    const finalY = doc.lastAutoTable?.finalY
      ? doc.lastAutoTable.finalY + 10
      : 120;

    // ================= PRICE BREAKDOWN =================
    const subtotal = order?.subtotal ?? 0;
    const shipping = order?.shippingCost ?? 0;
    const gst = order?.gstAmount ?? 0;
    const grandTotal = order?.totalPrice ?? 0;

    doc.setFontSize(11);
    doc.setTextColor(0);

    doc.text(`Subtotal: Rs. ${subtotal}`, 140, finalY, {
      align: "right",
    });

    doc.text(`Shipping: Rs. ${shipping}`, 140, finalY + 6, {
      align: "right",
    });

    doc.text(`GST (18%): Rs. ${gst}`, 140, finalY + 12, {
      align: "right",
    });

    doc.setFontSize(13);
    doc.setFont(undefined, "bold");

    doc.text(`Total: Rs. ${grandTotal}`, 140, finalY + 20, { align: "right" });

    doc.setFont(undefined, "normal");

    // ================= PAYMENT =================
    doc.setFontSize(10);
    doc.setTextColor(80);

    doc.text(
      `Payment: ${order?.paymentMethod || "-"} (${
        order?.paymentStatus || "-"
      })`,
      14,
      finalY + 15,
    );

    // ================= DELIVERY =================
    if (order?.estimatedDelivery) {
      doc.text(
        `Estimated Delivery: ${new Date(
          order.estimatedDelivery,
        ).toDateString()}`,
        14,
        finalY + 22,
      );
    }

    // ================= FOOTER (FIXED PROPER) =================
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(9);
    doc.setTextColor(150);

    doc.text("Thank you for shopping with ShopHub ", 14, pageHeight - 10);

    doc.text("Support: support@shophub.com", 14, pageHeight - 5);

    // ================= DOWNLOAD =================
    doc.save(`invoice_${order?._id || "invoice"}.pdf`);
  } catch (error) {
    console.error("Invoice error:", error);
  }
};
