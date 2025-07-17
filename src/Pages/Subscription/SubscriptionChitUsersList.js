import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getSubscriptionChitUsersListServ,
  approveSubscriptionChitUserServ,
} from "../../services/subscriptionChit.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoRecordFound from "../../Components/NoRecordFound";
import { useNavigate } from "react-router-dom";

function SubscriptionChitUsersList() {
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();
  const handleGetUsers = async () => {
    if (list.length === 0) setShowSkelton(true);
    try {
      const response = await getSubscriptionChitUsersListServ(payload);
      setList(response?.data?.data);
      const totalCount = response?.data?.documentCount?.totalCount || 0;
      setTotalPages(Math.ceil(totalCount / payload.pageCount));
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
    setShowSkelton(false);
  };

  useEffect(() => {
    handleGetUsers();
  }, [payload]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPayload({ ...payload, pageNo: newPage });
    }
  };

  const handleApproveUser = async (id) => {
    try {
      const response = await approveSubscriptionChitUserServ(id);
      if (response?.data?.statusCode === 200) {
        toast.success("User approved successfully.");
        handleGetUsers();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Approval failed.");
    }
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Subscription" selectedItem="Chit User" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="row m-0 p-0 d-flex align-items-center my-4 topActionForm">
            <div className="col-lg-2 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">
                Subscription Users
              </h3>
            </div>
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <input
                className="form-control borderRadius24"
                placeholder="Search"
                onChange={(e) =>
                  setPayload({ ...payload, searchKey: e.target.value })
                }
              />
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <select
                className="form-control borderRadius24"
                onChange={(e) =>
                  setPayload({ ...payload, status: e.target.value })
                }
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <table className="table">
                  <thead>
                    <tr style={{ background: "#F3F3F3", color: "#000" }}>
                      <th className="text-center py-3">Sr. No</th>
                      <th className="text-center py-3">Name</th>
                      <th className="text-center py-3">Phone</th>
                      <th className="text-center py-3">Email</th>
                      <th className="text-center py-3">Location</th>
                      <th className="text-center py-3">Status</th>
                      <th className="text-center py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showSkelton
                      ? [...Array(10)].map((_, i) => (
                          <tr key={i}>
                            {[...Array(7)].map((_, j) => (
                              <td className="text-center" key={j}>
                                <Skeleton />
                              </td>
                            ))}
                          </tr>
                        ))
                      : list?.map((v, i) => (
                          <tr key={v?._id}>
                            <td className="text-center">
                              {(payload.pageNo - 1) * payload.pageCount + i + 1}
                            </td>
                            <td className="text-center">{v?.name}</td>
                            <td className="text-center">{v?.phone}</td>
                            <td className="text-center">{v?.email}</td>
                            <td className="text-center">{v?.location}</td>
                            <td className="text-center text-capitalize">
                              {v?.status}
                            </td>
                            <td className="text-center">
                              {v?.status === "pending" && (
                                <button
                                  className="btn btn-success btn-sm mx-1"
                                  onClick={() => handleApproveUser(v?._id)}
                                >
                                  Approve
                                </button>
                              )}

                              {v?.status === "approved" && (
                                <button
                                  className="btn btn-primary btn-sm mx-1"
                                  onClick={() =>
                                    navigate(`/subscription-details/${v?._id}`)
                                  }
                                >
                                  View
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>

                {list.length === 0 && !showSkelton && <NoRecordFound />}
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-3">
                <nav>
                  <ul className="pagination pagination-sm">
                    <li
                      className={`page-item ${
                        payload.pageNo === 1 && "disabled"
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(payload.pageNo - 1)}
                      >
                        &lt;
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${
                          payload.pageNo === i + 1 && "active"
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        payload.pageNo === totalPages && "disabled"
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(payload.pageNo + 1)}
                      >
                        &gt;
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionChitUsersList;
