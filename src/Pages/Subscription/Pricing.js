import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getSubscriptionChitListServ,
  addSubscriptionChitServ,
  deleteSubscriptionChitServ,
  updateSubscriptionChitServ,
} from "../../services/subscriptionChit.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";

function Pricing() {
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);

  const handleGetSubscriptionChitFunc = async () => {
    if (list.length === 0) setShowSkelton(true);
    try {
      let response = await getSubscriptionChitListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {
      toast.error("Failed to fetch subscription chits.");
    }
    setShowSkelton(false);
  };

  useEffect(() => {
    handleGetSubscriptionChitFunc();
  }, [payload]);

  const staticsArr = [
    {
      title: "Total Subscription",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Active Subscription",
      count: statics?.activeCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Inactive Subscription",
      count: statics?.inactiveCount,
      bgColor: "#FFA426",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    duration: "",
    price: "",
    discountRate: "",
    image: "",
    imgPrev: "",
    status: "",
    show: false,
  });

  const handleAddSubscriptionChitFunc = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", addFormData?.name);
    formData.append("duration", addFormData?.duration);
    formData.append("price", addFormData?.price);
    formData.append("discountRate", addFormData?.discountRate);
    formData.append("status", addFormData?.status);

    if (addFormData?.image) {
      formData.append("image", addFormData?.image);
    }
 
    try {
      let response = await addSubscriptionChitServ(formData);
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        setAddFormData({
          name: "",
          duration: "",
          price: "",
          discountRate: "",
          image: "",
          imgPrev: "",
          status: "",
          show: false,
        });
        handleGetSubscriptionChitFunc();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    }
    setIsLoading(false);
  };

  const handleDeleteSubscriptionChitFunc = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this subscription chit?");
    if (confirmed) {
      try {
        let response = await deleteSubscriptionChitServ(id);
        if (response?.data?.statusCode === 200) {
          toast.success(response?.data?.message);
          handleGetSubscriptionChitFunc();
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error");
      }
    }
  };

  const [editFormData, setEditFormData] = useState({
    _id: "",
    name: "",
    duration: "",
    price: "",
    discountRate: "",
    image: "",
    imgPrev: "",
    status: "",
  });

  const handleUpdateSubscriptionChitFunc = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("_id", editFormData?._id);
    formData.append("name", editFormData?.name);
    formData.append("duration", editFormData?.duration);
    formData.append("price", editFormData?.price);
    formData.append("discountRate", editFormData?.discountRate);
    formData.append("status", editFormData?.status);
    // formData.append("userId", editFormData?.userId);

    if (editFormData?.image) {
      formData.append("image", editFormData?.image);
    }

    try {
      let response = await updateSubscriptionChitServ(formData);
      if (response?.data?.statusCode === "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          _id: "",
          name: "",
          duration: "",
          price: "",
          discountRate: "",
          image: "",
          imgPrev: "",
          status: "",
          // userId: "",
        });
        handleGetSubscriptionChitFunc();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    }
    setIsLoading(false);
  };

  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    if (statics?.totalCount && payload.pageCount) {
      const pages = Math.ceil(statics.totalCount / payload.pageCount);
      setTotalPages(pages);
    }
  }, [statics, payload.pageCount]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPayload({ ...payload, pageNo: newPage });
    }
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Subscription" selectedItem="Pricing" />
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
            {staticsArr?.map((v, i) => {
              return (
                <div className="col-md-4 col-12 ">
                  <div className="topCard shadow-sm py-4 px-3 rounded mb-3">
                    <div className="d-flex align-items-center ">
                      <div
                        className="p-2 shadow rounded"
                        style={{ background: v?.bgColor }}
                      >
                        <img src="https://cdn-icons-png.flaticon.com/128/666/666120.png" />
                      </div>
                      <div className="ms-3">
                        <h6>{v?.title}</h6>
                        <h2 className="text-secondary">{v?.count}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="row m-0 p-0 d-flex align-items-center my-4 topActionForm">
            <div className="col-lg-2 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">
                Subscription Chits
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
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12">
              <button
                className="btn btn-primary w-100 borderRadius24"
                onClick={() => setAddFormData({ ...addFormData, show: true })}
              >
                Add Subscription Chit
              </button>
            </div>
          </div>

          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <table className="table">
                  <thead>
                    <tr style={{ background: "#F3F3F3", color: "#000" }}>
                      <th className="text-center py-3">Sr. No</th>
                      <th className="text-center py-3">Image</th>
                      <th className="text-center py-3">Name</th>
                      <th className="text-center py-3">Duration (months)</th>
                      <th className="text-center py-3">Price</th>
                      <th className="text-center py-3">Discount Rate (%)</th>
                      <th className="text-center py-3">Start Date</th>
                      <th className="text-center py-3">End Date</th>
                      <th className="text-center py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showSkelton
                      ? [...Array(10)].map((_, i) => (
                          <tr key={i}>
                            <td className="text-center">
                              <Skeleton />
                            </td>
                            <td className="text-center">
                              <Skeleton />
                            </td>
                            <td className="text-center">
                              <Skeleton />
                            </td>
                            <td className="text-center">
                              <Skeleton />
                            </td>
                            <td className="text-center">
                              <Skeleton />
                            </td>
                            <td className="text-center">
                              <Skeleton />
                            </td>
                            <td className="text-center">
                              <Skeleton />
                            </td>
                            <td className="text-center">
                              <Skeleton />
                            </td>
                            <td className="text-center">
                              <Skeleton />
                            </td>
                            <td className="text-center">
                              <Skeleton />
                            </td>
                          </tr>
                        ))
                      : list?.map((v, i) => (
                          <tr key={v?._id}>
                            <td className="text-center">
                              {(payload.pageNo - 1) * payload.pageCount + i + 1}
                            </td>
                            <td className="text-center">
                              <img src={v?.image} style={{ height: "30px" }} />
                            </td>
                            <td className="text-center">{v?.name}</td>
                            <td className="text-center">{v?.duration}</td>
                            <td className="text-center">{v?.price}</td>
                            <td className="text-center">{v?.discountRate}</td>
                            <td className="text-center">
                              {moment(v?.startDate).format("DD-MM-YY")}
                            </td>
                            <td className="text-center">
                              {moment(v?.endDate).format("DD-MM-YY")}
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-info mx-2 text-light"
                                onClick={() =>
                                  setEditFormData({
                                    _id: v?._id,
                                    name: v?.name,
                                    duration: v?.duration,
                                    price: v?.price,
                                    discountRate: v?.discountRate,
                                    startDate: v?.startDate
                                      ? moment(v?.startDate).format(
                                          "YYYY-MM-DD"
                                        )
                                      : "",
                                    endDate: v?.endDate
                                      ? moment(v?.endDate).format("YYYY-MM-DD")
                                      : "",
                                    // userId: v?.userId,
                                    image: "",
                                    imgPrev: v?.image,
                                  })
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger mx-2 text-light"
                                onClick={() =>
                                  handleDeleteSubscriptionChitFunc(v?._id)
                                }
                              >
                                Delete
                              </button>
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

      {/* Add Modal */}
      {addFormData?.show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "364px",
              }}
            >
              <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                  style={{ height: "20px", cursor: "pointer" }}
                  onClick={() =>
                    setAddFormData({
                      name: "",
                      duration: "",
                      price: "",
                      discountRate: "",
                      image: "",
                      imgPrev: "",
                      status: "",
                      show: false,
                    })
                  }
                />
              </div>

              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="d-flex justify-content-center w-100">
                  <div className="w-100 px-2">
                    <h5 className="mb-4">Add Subscription Chit</h5>

                    <div className="p-3 border rounded mb-2">
                      {addFormData?.imgPrev ? (
                        <img
                          src={addFormData?.imgPrev}
                          className="img-fluid w-100 shadow rounded"
                        />
                      ) : (
                        <p className="mb-0 text-center">No Image Selected!</p>
                      )}
                    </div>

                    <label>Upload Image</label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          image: e.target.files[0],
                          imgPrev: URL.createObjectURL(e.target.files[0]),
                        })
                      }
                    />

                    <label className="mt-3">Name</label>
                    <input
                      className="form-control"
                      onChange={(e) =>
                        setAddFormData({ ...addFormData, name: e.target.value })
                      }
                      value={addFormData?.name}
                    />

                    <label className="mt-3">Duration (months)</label>
                    <input
                      className="form-control"
                      type="number"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          duration: e.target.value,
                        })
                      }
                      value={addFormData?.duration}
                    />

                    <label className="mt-3">Price</label>
                    <input
                      className="form-control"
                      type="number"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          price: e.target.value,
                        })
                      }
                      value={addFormData?.price}
                    />

                    <label className="mt-3">Discount Rate (%)</label>
                    <input
                      className="form-control"
                      type="number"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          discountRate: e.target.value,
                        })
                      }
                      value={addFormData?.discountRate}
                    />

                    <label className="mt-3">Status</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          status: e.target.value,
                        })
                      }
                      value={addFormData?.status}
                    >
                      <option value="">Select Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>

                    <button
                      className="btn btn-success w-100 mt-4"
                      onClick={
                        addFormData?.name &&
                        addFormData?.duration &&
                        !isLoading &&
                        handleAddSubscriptionChitFunc
                      }
                      disabled={
                        !addFormData?.name ||
                        !addFormData?.duration ||
                        isLoading
                      }
                      style={{
                        opacity:
                          !addFormData?.name ||
                          !addFormData?.duration ||
                          isLoading
                            ? "0.5"
                            : "1",
                      }}
                    >
                      {isLoading ? "Saving..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {addFormData?.show && <div className="modal-backdrop fade show"></div>}

      {/* Edit Modal */}
      {editFormData?._id && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                background: "#f7f7f5",
                width: "364px",
              }}
            >
              <div className="d-flex justify-content-end pt-4 pb-0 px-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                  style={{ height: "20px", cursor: "pointer" }}
                  onClick={() =>
                    setEditFormData({
                      _id: "",
                      name: "",
                      duration: "",
                      price: "",
                      discountRate: "",
                      image: "",
                      imgPrev: "",
                      status: "",
                    })
                  }
                />
              </div>

              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="d-flex justify-content-center w-100">
                  <div className="w-100 px-2">
                    <h5 className="mb-4">Update Subscription Chit</h5>

                    <div className="p-3 border rounded mb-2">
                      {editFormData?.imgPrev ? (
                        <img
                          src={editFormData?.imgPrev}
                          className="img-fluid w-100 shadow rounded"
                        />
                      ) : (
                        <p className="mb-0 text-center">No Image Selected!</p>
                      )}
                    </div>

                    <label>Upload Image</label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          image: e.target.files[0],
                          imgPrev: URL.createObjectURL(e.target.files[0]),
                        })
                      }
                    />

                    <label className="mt-3">Name</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      value={editFormData?.name}
                    >
                      <option value="">Select Name</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                      <option value="Premium">Premium</option>
                    </select>

                    <label className="mt-3">Duration (months)</label>
                    <input
                      className="form-control"
                      type="number"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          duration: e.target.value,
                        })
                      }
                      value={editFormData?.duration}
                    />

                    <label className="mt-3">Price</label>
                    <input
                      className="form-control"
                      type="number"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          price: e.target.value,
                        })
                      }
                      value={editFormData?.price}
                    />

                    <label className="mt-3">Discount Rate (%)</label>
                    <input
                      className="form-control"
                      type="number"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          discountRate: e.target.value,
                        })
                      }
                      value={editFormData?.discountRate}
                    />

                    <label className="mt-3">Status</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        })
                      }
                      value={editFormData?.status}
                    >
                      <option value="">Select Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>

                    <button
                      className="btn btn-success w-100 mt-4"
                      onClick={!isLoading && handleUpdateSubscriptionChitFunc}
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editFormData?._id && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default Pricing;
