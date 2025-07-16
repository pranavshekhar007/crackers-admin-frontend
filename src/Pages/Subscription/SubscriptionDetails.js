import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { getSubscriptionChitDetailsServ } from "../../services/subscriptionChit.services";
import { toast } from "react-toastify";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

const SubscriptionChitDetails = () => {
  const { id } = useParams();
  const [chit, setChit] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChitDetails = async () => {
    setLoading(true);
    try {
      const res = await getSubscriptionChitDetailsServ(id);
      setChit(res?.data?.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subscription chit details");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChitDetails();
  }, [id]);

  const handleStatusUpdate = async (monthNumber, status) => {
    try {
      await axios.put(
        process.env.REACT_APP_BASE_URL + "subscription/update/payment-status",
        {
          chitId: chit._id,
          monthNumber,
          status,
        }
      );
      toast.success("Status updated successfully");
      fetchChitDetails();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="bodyContainer">
        <Sidebar selectedMenu="Subscription" selectedItem="SubscriptionChits" />
        <div className="mainContainer">
          <TopNav />
          <div className="container p-4">
            <Skeleton height={30} width={200} className="mb-3" />
            <Skeleton count={5} height={20} className="mb-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!chit) return null;

  const user = chit?.userId || {};

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Subscription" selectedItem="SubscriptionChits" />
      <div className="mainContainer">
        <TopNav />
        <div className="container-fluid p-lg-4 p-md-3 p-2">
          <div className="card shadow-sm p-4">
            <h4 className="mb-4">Subscription Chit Details</h4>

            <div className="row">
              <div className="col-md-6">
                <p><strong>Name:</strong> {chit.name}</p>
                <p><strong>Phone:</strong> {chit.phone}</p>
                <p><strong>Email:</strong> {chit.email}</p>
                <p><strong>Location:</strong> {chit.location}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Total Amount:</strong> ₹{chit.totalAmount}</p>
                <p><strong>Monthly Amount:</strong> ₹{chit.monthlyAmount}</p>
                <p><strong>Total Months:</strong> {chit.totalMonths}</p>
                <p><strong>Enrolment Date:</strong> {moment(chit.enrolmentDate).format("DD-MM-YYYY")}</p>
              </div>
            </div>

            <hr />

            <h5 className="mt-4">Paid Months Details</h5>
            {chit.paidMonths.length === 0 ? (
              <p>No payments uploaded yet.</p>
            ) : (
              chit.paidMonths.map((month, idx) => (
                <div key={idx} className="mb-4">
                  <h6>Month: {month.monthNumber}</h6>
                  <p>Status: <strong>{month.status}</strong></p>
                  <p>Payment Date: {month.paymentDate ? moment(month.paymentDate).format("DD-MM-YYYY") : "-"}</p>

                  <div className="row">
                    {month.screenshotURL?.length > 0 ? (
                      month.screenshotURL.map((url, i) => (
                        <div key={i} className="col-md-3 mb-3">
                          <img
                            src={url}
                            alt="Payment Screenshot"
                            className="img-fluid rounded shadow"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-danger">No screenshot uploaded</p>
                    )}
                  </div>

                  {month.status === "pending" && (
                    <div>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleStatusUpdate(month.monthNumber, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(month.monthNumber, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionChitDetails;
