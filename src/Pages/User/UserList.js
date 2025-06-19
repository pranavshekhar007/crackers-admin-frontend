import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getCategoryServ,
  addCategoryServ,
  deleteCategoryServ,
  updateCategoryServ,
} from "../../services/category.service";
import {
  getUserListServ,
  deleteUserServ,
  getUserCartServ,
} from "../../services/user.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";
function UserList() {
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedCart, setSelectedCart] = useState([]);
  const [actualTotal, setActualTotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);

  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);
  const handleGetUserFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getUserListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) {}
    setShowSkelton(false);
  };
  const staticsArr = [
    {
      title: "Total Users",
      count: statics?.totalCount,
      bgColor: "#6777EF",
    },
    {
      title: "Completed Profile",
      count: statics?.activeCount,
      bgColor: "#63ED7A",
    },
    {
      title: "Incomplete Profile",
      count: statics?.inactiveCount,
      bgColor: "#FFA426",
    },
  ];
  useEffect(() => {
    handleGetUserFunc();
  }, [payload]);

  const handleDeleteUserFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      try {
        let response = await deleteUserServ(id);
        if (response?.data?.statusCode == "200") {
          toast?.success(response?.data?.message);
          handleGetUserFunc();
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message
            ? error?.response?.data?.message
            : "Internal Server Error"
        );
      }
    }
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

  // const handleViewCart = async (userId) => {
  //   try {
  //     const res = await getUserCartServ(userId);
  //     const data = res.data;

  //     if (data?.statusCode === 200) {
  //       setSelectedCart(data.cartItems);
  //       setActualTotal(data.actualTotalAmount);
  //       setDiscountedTotal(data.discountedTotalAmount);
  //       setShowCartModal(true);
  //     } else {
  //       toast.error(data?.message || "Failed to fetch cart");
  //     }
  //   } catch (err) {
  //     toast.error("Something went wrong while fetching cart items");
  //   }
  // };

  const handleViewCart = (userId) => {
    const dummyCartItems = [
      {
        name: "Chakri Combo Pack",
        quantity: 3,
        price: 100,
        discountedPrice: 80,
        totalItemPrice: 300,
        totalItemDiscountedPrice: 240,
        productHeroImage:
          "https://i0.wp.com/bigbangcrackers.com/wp-content/uploads/2024/08/Crackling-Opera-Photoroom.jpg?w=500&ssl=1",
      },
      {
        name: "Rocket Box",
        quantity: 2,
        price: 150,
        discountedPrice: 120,
        totalItemPrice: 300,
        totalItemDiscountedPrice: 240,
        productHeroImage:
          "https://i0.wp.com/bigbangcrackers.com/wp-content/uploads/2024/08/60-Shots-Photoroom.jpg?w=500&ssl=1",
      },
      {
        name: "Rocket Box",
        quantity: 2,
        price: 150,
        discountedPrice: 120,
        totalItemPrice: 300,
        totalItemDiscountedPrice: 240,
        productHeroImage:
          "https://i0.wp.com/bigbangcrackers.com/wp-content/uploads/2024/08/60-Shots-Photoroom.jpg?w=500&ssl=1",
      },
      {
        name: "Rocket Box",
        quantity: 2,
        price: 150,
        discountedPrice: 120,
        totalItemPrice: 300,
        totalItemDiscountedPrice: 240,
        productHeroImage:
          "https://i0.wp.com/bigbangcrackers.com/wp-content/uploads/2024/08/60-Shots-Photoroom.jpg?w=500&ssl=1",
      },
      {
        name: "Rocket Box",
        quantity: 2,
        price: 150,
        discountedPrice: 120,
        totalItemPrice: 300,
        totalItemDiscountedPrice: 240,
        productHeroImage:
          "https://i0.wp.com/bigbangcrackers.com/wp-content/uploads/2024/08/60-Shots-Photoroom.jpg?w=500&ssl=1",
      },
    ];

    const totalActual = dummyCartItems.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );
    const totalDiscounted = dummyCartItems.reduce(
      (sum, item) => sum + item.totalItemDiscountedPrice,
      0
    );

    setSelectedCart(dummyCartItems);
    setActualTotal(totalActual);
    setDiscountedTotal(totalDiscounted);
    setShowCartModal(true);
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="User Management" selectedItem="Users" />
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
          <div className="row m-0 p-0 d-flex align-items-center  my-4 topActionForm">
            <div className="col-lg-5 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Users</h3>
            </div>
            <div className="col-lg-4 mb-2 col-md-12 col-12">
              <div>
                <input
                  className="form-control borderRadius24"
                  placeholder="Search"
                  onChange={(e) =>
                    setPayload({ ...payload, searchKey: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col-lg-3 mb-2  col-md-6 col-12">
              <div>
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
            </div>
          </div>
          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <table className="table">
                  <tbody>
                    <tr style={{ background: "#F3F3F3", color: "#000" }}>
                      <th
                        className="text-center py-3"
                        style={{ borderRadius: "30px 0px 0px 30px" }}
                      >
                        Sr. No
                      </th>
                      <th className="text-center py-3">Profile </th>
                      <th className="text-center py-3">Full Name</th>
                      <th className="text-center py-3">Phone No.</th>
                      <th className="text-center py-3">Email</th>
                      <th className="text-center py-3">Status</th>

                      <th
                        className="text-center py-3 "
                        style={{ borderRadius: "0px 30px 30px 0px" }}
                      >
                        Action
                      </th>
                    </tr>
                    <div className="py-2"></div>
                    {showSkelton
                      ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((v, i) => {
                          return (
                            <>
                              <tr key={i}>
                                <td className="text-center">
                                  <Skeleton width={50} height={50} />
                                </td>
                                <td className="text-center">
                                  <Skeleton
                                    width={50}
                                    height={50}
                                    borderRadius={25}
                                  />
                                </td>
                                <td className="text-center">
                                  <Skeleton width={100} height={25} />
                                </td>
                                <td className="text-center">
                                  <Skeleton width={100} height={25} />
                                </td>
                                <td className="text-center">
                                  <Skeleton width={100} height={25} />
                                </td>
                                <td className="text-center">
                                  <Skeleton width={100} height={25} />
                                </td>
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })
                      : list?.map((v, i) => {
                          return (
                            <>
                              <tr>
                                <td className="text-center">
                                  {(payload.pageNo - 1) * payload.pageCount +
                                    i +
                                    1}
                                </td>
                                <td className="text-center">
                                  <img
                                    src={v?.profilePic}
                                    style={{ height: "30px" }}
                                  />
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.firstName + " " + v?.lastName}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.phone}
                                </td>
                                <td className="font-weight-600 text-center">
                                  {v?.email}
                                </td>
                                <td className="text-center">
                                  {v?.profileStatus == "completed" ? (
                                    <div
                                      className="badge py-2"
                                      style={{ background: "#63ED7A" }}
                                    >
                                      Varified
                                    </div>
                                  ) : (
                                    <div
                                      className="badge py-2 "
                                      style={{ background: "#FFA426" }}
                                    >
                                      Incomplete
                                    </div>
                                  )}
                                </td>
                                <td className="text-center">
                                  <a
                                    onClick={() => handleViewCart(v?._id)}
                                    className="btn btn-info mx-2 text-light shadow-sm"
                                  >
                                    View Cart
                                  </a>

                                  <a
                                    onClick={() => handleDeleteUserFunc(v?._id)}
                                    className="btn btn-warning mx-2 text-light shadow-sm"
                                  >
                                    Delete
                                  </a>
                                </td>
                              </tr>
                              <div className="py-2"></div>
                            </>
                          );
                        })}
                  </tbody>
                </table>

                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-5 px-3 py-3 mt-4">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold text-secondary">Show</span>
                    <select
                      className="form-select form-select-sm custom-select"
                      value={payload.pageCount}
                      onChange={(e) =>
                        setPayload({
                          ...payload,
                          pageCount: parseInt(e.target.value),
                          pageNo: 1,
                        })
                      }
                    >
                      {[10, 25, 50, 100].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  <nav>
                    <ul className="pagination pagination-sm mb-0 custom-pagination">
                      <li
                        className={`page-item ${
                          payload.pageNo === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(payload.pageNo - 1)}
                        >
                          &lt;
                        </button>
                      </li>

                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= payload.pageNo - 1 &&
                            page <= payload.pageNo + 1)
                        ) {
                          return (
                            <li
                              key={page}
                              className={`page-item ${
                                payload.pageNo === page ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            </li>
                          );
                        } else if (
                          (page === payload.pageNo - 2 && page > 2) ||
                          (page === payload.pageNo + 2 && page < totalPages - 1)
                        ) {
                          return (
                            <li key={page} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}

                      <li
                        className={`page-item ${
                          payload.pageNo === totalPages ? "disabled" : ""
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

                {list.length == 0 && !showSkelton && <NoRecordFound />}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCartModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal-content">
            <h4 className="mb-4"> User Cart Items</h4>
            <div className="table-container-with-sticky-header">
              <table className="table table-bordered text-center align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Discounted</th>
                    <th>Total</th>
                    <th>Discounted Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCart.length > 0 ? (
                    selectedCart.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <img
                            src={item.productHeroImage}
                            alt={item.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                            }}
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price}</td>
                        <td>₹{item.discountedPrice}</td>
                        <td>₹{item.totalItemPrice}</td>
                        <td>₹{item.totalItemDiscountedPrice}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No items in cart
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between mt-3 fs-5">
              <strong>Total: ₹{actualTotal}</strong>
              <strong>Discounted: ₹{discountedTotal}</strong>
            </div>
            <div className="text-end mt-4">
              <button
                className="btn btn-secondary px-4"
                onClick={() => setShowCartModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
