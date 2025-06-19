import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { getBookingDetailsServ } from "../../services/bookingDashboard.services";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
    const [list, setList] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();
  const [showSkelton, setShowSkelton] = useState(false);


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

  if (!order) return <div className="p-4">No order found.</div>;

  const user = order?.userId || {};
  const address = order?.address || {};
  const products = order?.product || [];

  const handleOpenPaymentModal = () => setShowPaymentModal(true);
  const handleClosePaymentModal = () => setShowPaymentModal(false);

  const isPaymentUploaded = order?.paymentSs;

  const statusFlow = [
    { key: "orderPlaced", icon: "🛒", label: "Order Placed" },
    { key: "orderPacked", icon: "📦", label: "Packed" },
    { key: "shipping", icon: "🚚", label: "Shipping" },
    { key: "outForDelivery", icon: "📍", label: "Out For Delivery" },
    { key: "delivered", icon: "✅", label: "Delivered" },
    { key: "cancelled", icon: "❌", label: "Cancelled" },
  ];

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Orders" selectedItem="Orders" />
      <div className="mainContainer">
        <TopNav />
        <div className="container-fluid p-lg-4 p-md-3 p-2">
          <div className="row g-4">
            {/* Left Column */}
            <div className="col-lg-8">
              <div className="card shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">
                    Order #{order?._id?.slice(0, 6).toUpperCase()}
                  </h4>
                  <button
                    className="btn"
                    onClick={() => navigate(`/order-invoice/${order?._id}`)}
                    style={{
                      backgroundColor: "#28c76f",
                      color: "#fff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "5px",
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="fa fa-download"></i> Invoice
                  </button>
                </div>

                <table className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Product Details</th>
                      <th>Item Price</th>
                      <th>Quantity</th>
                      <th>total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, i) => (
                      <tr key={i}>
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
                        <td>
                          ₹
                          {item?.productId?.discountedPrice ||
                            item?.productId?.price}
                        </td>
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

                <div className="d-flex flex-column align-items-end mt-3">
                  <div>Subtotal: ₹{order?.totalAmount}</div>
                  <div>Shipping: ₹0</div>
                  <div>Tax: ₹0</div>
                  <div className="fw-bold">Total: ₹{order?.totalAmount}</div>
                </div>
              </div>

              {/* Order Status */}
              <div className="card shadow-sm p-4 mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Order Status</h5>
                </div>

                <ul className="order-tracker ps-0">
                  {statusFlow.map((step, idx) => {
                    if (
                      step.key === "cancelled" &&
                      order.status !== "cancelled"
                    )
                      return null;

                    const currentIndex = statusFlow.findIndex(
                      (s) => s.key === order?.status
                    );
                    const isCompleted = idx < currentIndex;
                    const isActive = idx === currentIndex;

                    return (
                      <li
                        key={step.key}
                        className={`${
                          isCompleted
                            ? "completed"
                            : isActive
                            ? "active"
                            : "pending"
                        }`}
                      >
                        <div className="icon">{step.icon}</div>
                        <div className="details">
                          <strong>
                            {step.label} -{" "}
                            {moment(order?.createdAt)
                              .add(idx, "days")
                              .format("ddd, DD MMM YYYY")}
                          </strong>

                          {/* Optional message blocks */}
                          {step.key === "orderPlaced" && (
                            <div className="text-muted small">
                              An order has been placed.
                              <br />
                              {moment(order?.createdAt).format(
                                "ddd, DD MMM YYYY - h:mmA"
                              )}
                              <br />
                              Seller has processed your order.
                              <br />
                              {moment(order?.createdAt)
                                .add(1, "days")
                                .format("ddd, DD MMM YYYY - h:mmA")}
                            </div>
                          )}

                          {step.key === "orderPacked" && (
                            <div className="text-muted small">
                              Your item has been picked up by courier partner.
                              <br />
                              {moment(order?.createdAt)
                                .add(2, "days")
                                .format("ddd, DD MMM YYYY - h:mmA")}
                            </div>
                          )}

                          {step.key === "shipping" && (
                            <div className="text-muted small">
                              <strong>RQP Logistics – MFDS1400457854</strong>
                              <br />
                              Your item has been shipped.
                              <br />
                              {moment(order?.createdAt)
                                .add(3, "days")
                                .format("ddd, DD MMM YYYY - h:mmA")}
                            </div>
                          )}

                          {step.key === "outForDelivery" && (
                            <div className="text-muted small">
                              Your item is out for delivery.
                            </div>
                          )}

                          {step.key === "delivered" && (
                            <div className="text-muted small">
                              Order has been delivered successfully.
                            </div>
                          )}

                          {step.key === "cancelled" && (
                            <div className="text-muted small text-danger">
                              This order was cancelled.
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-lg-4">

              {/* Customer Details */}
              <div className="card shadow-sm p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h6 className="fw-bold mb-0">Customer Details</h6>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <img
                    src={
                      user?.profilePic
                        ? user?.profilePic
                        : "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                    }
                    alt="profile"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                  />
                  <div className="ms-3">
                    <div className="fw-semibold">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-muted small">Customer</div>
                  </div>
                </div>

                <div className="mb-2 d-flex align-items-center">
                  <i className="fa fa-envelope me-2 text-muted"></i>
                  <span>{user?.email || "-"}</span>
                </div>

                <div className="d-flex align-items-center">
                  <i className="fa fa-phone me-2 text-muted"></i>
                  <span>{user?.phone || "-"}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card shadow-sm p-3 mb-4">
                <h6 className="fw-bold mb-2">Shipping Address</h6>
                <div>{address.fullName}</div>
                <div>{address.phone}</div>
                <div>
                  {address.area}, {address.city}, {address.state} -{" "}
                  {address.pincode}
                </div>
                <div>{address.country}</div>
              </div>

              {/* Payment Details */}
              <div className="card shadow-sm p-3 mb-4">
                <h6 className="fw-bold mb-3">Payment Details</h6>

                <div>Transaction ID: #{order?.paymentId || "N/A"}</div>
                <div>Payment Mode: {order?.modeOfPayment || "-"}</div>
                <div>Total Paid: ₹{order?.totalAmount || "-"}</div>

                <div className="d-flex align-items-center mt-2">
                  <div className="me-2 fw-medium">
                    Payment Screenshot:{" "}
                    {isPaymentUploaded ? (
                      <span className="text-success">Uploaded</span>
                    ) : (
                      <span className="text-danger">Not Uploaded</span>
                    )}
                  </div>

                  {isPaymentUploaded && (
                    <button
                      onClick={handleOpenPaymentModal}
                      className="btn"
                      title="View Screenshot"
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Screenshot</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={order?.paymentSs}
            alt="Payment Screenshot"
            className="img-fluid rounded"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePaymentModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderDetails;
