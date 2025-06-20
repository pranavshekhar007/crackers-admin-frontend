import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { getBookingDetailsServ } from "../../services/bookingDashboard.services";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const OrderInvoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
   const [list, setList] = useState([]);
  const invoiceRef = useRef();
  const [showSkelton, setShowSkelton] = useState(false);

  const handleDownload = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true});
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
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      const res = await getBookingDetailsServ(id);
      setOrder(res?.data?.data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setShowSkelton(false);
    }
  };

  if (showSkelton) {
    return (
      <div className="bodyContainer">
        <Sidebar selectedMenu="Orders" selectedItem="Orders" />
        <div className="mainContainer">
          <TopNav />
          <div className="container-fluid p-lg-4 p-md-3 p-2">
            <div className="card shadow-sm p-4 mb-4">
              <Skeleton height={30} width={200} className="mb-3" />
              <Skeleton count={5} height={20} className="mb-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!order) return null;

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

  const taxRate = 5;
  const totalWithTax = subTotal + (subTotal * taxRate) / 100;

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Orders" selectedItem="Orders" />
      <div className="mainContainer">
        <TopNav />
        <div className="container-fluid p-lg-4 p-md-3 p-2">
          <div className="card shadow-sm p-4">
            <div ref={invoiceRef} className="p-4" style={{ backgroundColor: "#fff", fontFamily: "Arial, sans-serif" }}>
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <img
                    src="https://bigbangcrackers.com/wp-content/uploads/2023/08/cropped-big-bang-logo-png.png"
                    alt="Big Bang Crackers"
                    width="100"
                  />
                  <br />
                  <br />
                  <p className="mb-0">Email: bigbangcrackers7@gmail.com</p>
                  <p className="mb-0">Customer Care: 9894047372</p>
                </div>
                <div className="text-end">
                  <h3 className="text-warning">INVOICE</h3>
                  <p className="mb-0">#INV-{order?._id?.slice(0, 6).toUpperCase()}</p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-4">
                  <h6 className="fw-bold">Bill To</h6>
                  <p className="mb-0 text-danger fw-bold">{user?.firstName}</p>
                  <p className="mb-0">{address?.street}</p>
                  <p className="mb-0">{address?.city}, {address?.state}</p>
                  <p className="mb-0">{address?.zip}</p>
                  <p className="mb-0">{user?.phone}</p>
                </div>
                <div className="col-md-4">
                  <h6 className="fw-bold">Ship To</h6>
                  <p className="mb-0">{address?.area}</p>
                  <p className="mb-0">{address?.city}, {address?.state}</p>
                  <p className="mb-0">{address?.pincode}</p>
                </div>
                <div className="col-md-4 text-end">
                  <p>Invoice Date: {moment(order?.createdAt).format("DD MMM YYYY")}</p>
                  <p>Terms: Due on Receipt</p>
                </div>
              </div>

              <table className="table table-bordered">
                <thead style={{ backgroundColor: "#993300", color: "#fff" }}>
                  <tr>
                    <th>#</th>
                    <th>Item & Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => {
                    const price = item?.productId?.discountedPrice || item?.productId?.price || 0;
                    const qty = item?.quantity || 1;
                    const total = price * qty;
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={item?.productId?.productHeroImage}
                            alt="product"
                            style={{ width: 50 }}
                          />
                          <strong className="m-4">
                            {item?.productId?.name}
                          </strong>
                        </td>
                        <td>{qty}</td>
                        <td>₹{price.toFixed(2)}</td>
                        <td>₹{total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="text-end mt-3">
                <p className="mb-1">Sub Total: ₹{subTotal.toFixed(2)}</p>
                <p>Total Items: {products.length}</p>
                <p>Delivery Charge: ₹0</p>
                <p>Wallet Used: ₹0</p>
                <h5 className="fw-bold text-danger">Total: ₹{totalWithTax.toFixed(2)}</h5>
               
              </div>

              <div className="mt-4">
                <p className="fw-bold mb-1">Notes</p>
                <p className="text-muted small">Thanks for your business.</p>

                <p className="fw-bold mb-1 mt-3">Terms & Conditions</p>
                <p className="text-muted small">
                  All payments must be made in full before the commencement of any design work.
                </p>
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

export default OrderInvoice;