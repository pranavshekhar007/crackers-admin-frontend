import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../Components/Sidebar";
import TopNav from "../../../Components/TopNav";
import { getProductTypeServ } from "../../../services/productType.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  getComboProductDetailsServ,
  updateComboProductServ,
} from "../../../services/comboProduct.services";
import { getProductServ } from "../../../services/product.services";

function ComboProductUpdateStep1() {
  const params = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const contentRef = useRef("");

  const [btnLoader, setBtnLoader] = useState(false);
  const [content, setContent] = useState("");

  const [formData, setFormData] = useState({
    maxComboLimit: "",
    name: "",
    productId: [],
    pricing: {
      actualPrice: "",
      offerPrice: "",
      comboPrice: "",
    },
    gtin: "",
    shortDescription: "",
  });

  const [productOptions, setProductOptions] = useState([]);

  const config = {
    placeholder: "Start typing...",
    height: "300px",
  };

  const fetchDropdownData = async () => {
    try {
      const [typeRes, productRes] = await Promise.all([
        getProductTypeServ({ status: true }),
        getProductServ(),
      ]);

      if (productRes?.data?.statusCode === 200) {
        setProductOptions(
          productRes.data.data.map((product) => ({
            label: product.name,
            value: product._id,
          }))
        );
      }
    } catch (error) {
      toast.error("Failed to fetch dropdown data.");
    }
  };

  const getComboProductDetails = async () => {
    try {
      let response = await getComboProductDetailsServ(params?.id);
      if (response?.data?.statusCode === 200) {
        const product = response?.data?.data;
        setFormData({
          maxComboLimit: product?.maxComboLimit || "",
          name: product?.name || "",
          productId: product?.productId || [],
          pricing: {
            actualPrice: product?.pricing?.actualPrice || "",
            offerPrice: product?.pricing?.offerPrice || "",
            comboPrice: product?.pricing?.comboPrice || "",
          },
          gtin: product?.gtin || "",
          shortDescription: product?.shortDescription || "",
        });
        setContent(product?.shortDescription || "");
        contentRef.current = product?.shortDescription || "";
      }
    } catch (error) {
      toast.error("Failed to fetch product details.");
    }
  };

  useEffect(() => {
    fetchDropdownData();
    getComboProductDetails();
  }, []);

  const updateComboProductFunc = async () => {
    setBtnLoader(true);
    try {
      let updatedData = {
        ...formData,
        shortDescription: contentRef.current,
        id: params?.id,
      };
      let response = await updateComboProductServ(updatedData);
      if (response?.data?.statusCode === 200) {
        toast.success("Combo Product Step 1 Updated Successfully!");
        setFormData({
          maxComboLimit: "",
          name: "",
          productId: [],
          pricing: {
            actualPrice: "",
            offerPrice: "",
            comboPrice: "",
          },
          gtin: "",
          shortDescription: "",
        });
        navigate("/update-combo-product-step2/" + response?.data?.data?._id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setBtnLoader(false);
  };

  const [productList, setProductList] = useState([]);
  const getProductListFunc = async () => {
    try {
      let response = await getProductServ();
      if (response?.data?.statusCode == "200") {
        setProductList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductListFunc();
  }, []);

  useEffect(() => {
    const totalMRP = formData.productId.reduce((total, item) => {
      const product = productList.find(
        (p) => p._id === item.product || p._id === item.value
      );
      const qty = item.quantity || 1;
      return total + (product?.price || 0) * qty;
    }, 0);

    const totalDiscount = formData.productId.reduce((total, item) => {
      const product = productList.find(
        (p) => p._id === item.product || p._id === item.value
      );
      const qty = item.quantity || 1;
      return total + (product?.discountedPrice || 0) * qty;
    }, 0);

    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        actualPrice: totalMRP.toFixed(2),
        offerPrice: totalDiscount.toFixed(2),
      },
    }));
  }, [formData.productId, productList]);

  return (
    <div className="bodyContainer">
      <Sidebar
        selectedMenu="Product Management"
        selectedItem="Add Combo Packs"
      />
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
          ></div>

          <div className="mt-3">
            <div className="card-body px-2">
              <div className="d-flex">
                <h4
                  className="p-2 text-dark shadow rounded mb-4"
                  style={{ background: "#05E2B5" }}
                >
                  Update Combo Pack : Step 1/3
                </h4>
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label>Max Combo Limit (₹)</label>
                  <input
                    type="number"
                    value={formData.maxComboLimit}
                    className="form-control"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!isNaN(val) && Number(val) >= 0) {
                        setFormData((prev) => ({
                          ...prev,
                          maxComboLimit: val,
                        }));
                      }
                    }}
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>GTIN Code*</label>
                  <input
                    className="form-control"
                    style={{ height: "45px" }}
                    value={formData?.gtin || ""}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setFormData({ ...formData, gtin: value });
                      }
                    }}
                  />
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label mb-2">Products</label>
                  <Select
                    isMulti
                    options={productList?.map((v) => ({
                      label: v?.name,
                      value: v?._id,
                    }))}
                    value={formData.productId.map((p) => {
                      const product = productList.find(
                        (prod) => prod._id === p.product
                      );
                      return { label: product?.name, value: p.product };
                    })}
                    onChange={(selectedOptions) => {
                      const updatedProductIds = selectedOptions.map(
                        (option) => {
                          const existing = formData.productId.find(
                            (p) => p.product === option.value
                          );
                          return {
                            product: option.value,
                            quantity: existing ? existing.quantity : 1,
                          };
                        }
                      );
                      setFormData({
                        ...formData,
                        productId: updatedProductIds,
                      });
                    }}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />

                  {/* Quantity Inputs */}
                  <div className="mt-3">
                    {formData.productId.map((item, idx) => {
                      const productDetails = productList.find(
                        (p) => p._id === item.product
                      );
                      return (
                        <div
                          key={item.product}
                          className="border rounded px-3 py-2 mb-2 d-flex align-items-center justify-content-between bg-light"
                        >
                          <div
                            className="text-truncate me-3"
                            style={{ maxWidth: "65%" }}
                          >
                            <strong>{productDetails?.name}</strong>
                          </div>
                          <div
                            className="d-flex align-items-center gap-2"
                            style={{ minWidth: "120px" }}
                          >
                            <label className="mb-0 small text-muted">
                              Qty:
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              className="form-control form-control-sm"
                              onChange={(e) => {
                                const updated = [...formData.productId];
                                updated[idx].quantity =
                                  parseInt(e.target.value) || 1;
                                setFormData({
                                  ...formData,
                                  productId: updated,
                                });
                              }}
                              style={{ width: "60px" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="col-4 mb-3">
                  <label>Product Price (MRP)</label>
                  <input
                    value={formData?.pricing?.actualPrice || ""}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="col-4 mb-3">
                  <label>Discounted/Sale Price</label>
                  <input
                    value={formData?.pricing?.offerPrice || ""}
                    className="form-control"
                    readOnly
                  />
                </div>

                {formData?.maxComboLimit &&
                  parseFloat(formData?.pricing?.offerPrice || 0) >
                    parseFloat(formData?.maxComboLimit) && (
                    <div className="col-12 mb-2">
                      <div className="alert alert-danger py-2">
                        ⚠️ You’ve exceeded the max limit of ₹
                        {formData?.maxComboLimit}. Reduce quantity or remove
                        items.
                      </div>
                    </div>
                  )}

                <div className="col-4 mb-3">
                  <label>Combo Price</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing: {
                          ...formData.pricing,
                          comboPrice: e.target.value,
                        },
                      })
                    }
                    value={formData?.pricing?.comboPrice || ""}
                    className="form-control"
                  />
                </div>

                <div className="col-12 mb-3">
                  <label>Short Description</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={content}
                    onChange={(newContent) => {
                      contentRef.current = newContent;
                    }}
                  />
                </div>

                <div className="col-12">
                  {btnLoader ? (
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                        opacity: "0.6",
                      }}
                    >
                      Saving ...
                    </button>
                  ) : formData?.name &&
                    formData?.gtin &&
                    (!formData?.maxComboLimit ||
                      parseFloat(formData?.pricing?.offerPrice || 0) <=
                        parseFloat(formData?.maxComboLimit)) ? (
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                      }}
                      onClick={updateComboProductFunc}
                    >
                      Update & Continue
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#ccc",
                        border: "none",
                        borderRadius: "24px",
                      }}
                      disabled
                    >
                      Update & Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComboProductUpdateStep1;
