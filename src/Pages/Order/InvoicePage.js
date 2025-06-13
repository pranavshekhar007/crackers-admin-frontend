import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { getBookingDetailsServ } from "../../services/bookingDashboard.services";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoicePage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();

 
  const handleDownload = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${order?._id?.slice(0, 8)}.pdf`);
  };

  

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await getBookingDetailsServ(id);
      setOrder(res?.data?.data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!order) return <div className="p-4">No order found.</div>;

  const user = order?.userId || {};
  const address = order?.address || {};
  const products = order?.product || [];

  const subTotal = products.reduce(
    (acc, item) =>
      acc +
      (item?.productId?.discountedPrice || item?.productId?.price || 0) *
        (item?.quantity || 1),
    0
  );

  const discount = order?.discountAmount || 0;
  const tax = (subTotal * 12.5) / 100;
  const shippingCharge = 65;
  const totalAmount = (subTotal + tax - discount + shippingCharge).toFixed(2);

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Orders" selectedItem="Orders" />
      <div className="mainContainer">
        <TopNav />
        <div className="container-fluid p-lg-4 p-md-3 p-2">
          <div className="card shadow-sm p-4">
            <div
              ref={invoiceRef}
              className="card shadow-sm p-4 invoice-print-area"
            >
              <div className="text-center mb-4">
                <h4 className="fw-bold">Big Bang Crackers</h4>
                <p className="mb-1">Email: bigbangcrackers7@gmail.com</p>
                <p>Customer Care: 9894047372</p>
                <h5 className="mt-4">Retail Invoice</h5>
                <p>
                  Invoice No: #{order?._id?.slice(0, 8).toUpperCase()}
                  <br />
                  Date: {moment(order?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </p>
              </div>

              <table className="table table-bordered small">
                <thead className="table-light">
                  <tr>
                    <th>SR NO.</th>
                    <th>PRODUCT NAME</th>
                    <th>VARIANT</th>
                    <th>PRICE</th>
                    <th>TAX (%)</th>
                    <th>QTY</th>
                    <th>SUBTOTAL (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.productId?.name}</td>
                      <td>{item?.productId?.variant || "-"}</td>
                      <td>
                        ₹
                        {item?.productId?.discountedPrice ||
                          item?.productId?.price}
                      </td>
                      <td>0%</td>
                      <td>{item?.quantity || 1}</td>
                      <td>
                        ₹
                        {(
                          (item?.productId?.discountedPrice ||
                            item?.productId?.price ||
                            0) * (item?.quantity || 1)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-end mt-3 small">
                <p>Total Items: {products.length}</p>
                <p>Total Price: ₹{subTotal.toFixed(2)}</p>
                <p>Delivery Charge: ₹0</p>
                <p>Wallet Used: ₹0</p>
                <p className="fw-bold fs-5">Final Total: ₹{totalAmount}</p>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                className="btn btn-success no-print"
                onClick={() => window.print()}
              >
                <i className="fa fa-print me-2"></i>Print
              </button>
              <button className="btn btn-primary" onClick={handleDownload}>
                <i className="fa fa-download me-2"></i>Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
