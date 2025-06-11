import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { getBookingDetailsServ } from "../../services/bookingDashboard.services";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Order ID from URL:", id);
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await getBookingDetailsServ(id);
      console.log("Booking details response:", res);
      setOrder(res?.data?.data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!order) return <div className="p-4">No order found.</div>;

  return (
    <div className="bodyContainer">
    <Sidebar selectedMenu="Orders" selectedItem="Orders" />
    <div className="mainContainer">
      <TopNav />
      <div className="p-lg-4 p-md-3 p-2">
        <div
          className="row mx-0 p-0"
          style={{
            position: "relative",
            top: "-75px",
            marginBottom: "-75px",
          }}
        >
    <div className="p-4">
      <h3>Order Details</h3>
      <hr />
      <div>
        <strong>Order ID:</strong> {order?._id} <br />
        <strong>Created At:</strong>{" "}
        {moment(order?.createdAt).format("DD MMM YYYY, hh:mm A")} <br />
        <strong>Status:</strong> {order?.status} <br />
        <strong>Total Amount:</strong> ₹{order?.totalAmount} <br />
        <strong>Mode of Payment:</strong> {order?.modeOfPayment} <br />
        <strong>Payment ID:</strong> {order?.paymentId || "-"} <br />
        <strong>Signature:</strong> {order?.signature || "-"} <br />
        <strong>Payment Screenshot:</strong>{" "}
        {order?.paymentSs ? (
          <img
            src={order.paymentSs}
            alt="Payment Screenshot"
            style={{ maxWidth: "300px", marginTop: "10px" }}
          />
        ) : (
          "Not uploaded"
        )}
      </div>

      <hr />
      <h5>Customer Details</h5>
      <p>
        <strong>Name:</strong>{" "}
        {(order?.userId?.firstName || "") + " " + (order?.userId?.lastName || "") || "Guest"}
      </p>

      <h5>Shipping Address</h5>
      <pre>
        {order?.address ? (
          <>
            {order.address.fullName}
            {"\n"}Phone: {order.address.phone}
            {"\n"}Alt: {order.address.alternatePhone}
            {"\n"}Landmark: {order.address.landmark}
            {"\n"}Area: {order.address.area}
            {"\n"}City: {order.address.city}
            {"\n"}State: {order.address.state}
            {"\n"}Pincode: {order.address.pincode}
            {"\n"}Country: {order.address.country}
          </>
        ) : (
          "N/A"
        )}
      </pre>

      <h5>Products</h5>
      {order?.product?.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Product</th>
                <th className="text-center">Price</th>
                <th className="text-center">Image</th>
                <th className="text-center">Qty</th>
              </tr>
            </thead>
            <tbody>
              {order.product.map((p, index) => (
                <tr key={p?._id || index}>
                  <td >{p?.productId?.name || "-"}</td>
                  <td className="text-center">
                                  {p?.productId?.price ? (
                                    <div style={{ lineHeight: "1.2" }}>
                                      <div
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "16px",
                                          color: "#28a745",
                                        }}
                                      >
                                        {p?.productId?.discountedPrice}
                                      </div>
                                      <div
                                        style={{
                                          textDecoration: "line-through",
                                          color: "#888",
                                          fontSize: "13px",
                                          marginTop: "4px",
                                        }}
                                      >
                                        {p?.productId?.price}
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                      }}
                                    >
                                      {p?.productId?.price}
                                    </div>
                                  )}
                                </td>

                  <td className="text-center">
                    <img
                      src={p?.productId?.productHeroImage}
                      alt="product"
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td className="text-center">{p?.qty || 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No products found in this order.</p>
      )}
    </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default OrderDetails;
