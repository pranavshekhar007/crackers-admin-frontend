import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getSchemeConfigServ,
  setSchemeConfigServ,
  updateSchemeConfigServ,
  deleteSchemeConfigServ,
} from "../../services/schemeConfig.services";
import { toast } from "react-toastify";
import moment from "moment";

function Scheme() {
  const [schemeConfig, setSchemeConfig] = useState(null);
  const [formData, setFormData] = useState({
    schemeStartDate: "",
    schemeEndDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchemeConfig = async () => {
    try {
      const res = await getSchemeConfigServ();
      if (res?.data?.statusCode === 200) {
        setSchemeConfig(res.data.data);
        setFormData({
          schemeStartDate: moment(res.data.data.schemeStartDate).format("YYYY-MM-DD"),
          schemeEndDate: moment(res.data.data.schemeEndDate).format("YYYY-MM-DD"),
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch scheme config");
    }
  };

  useEffect(() => {
    fetchSchemeConfig();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let res;
      if (schemeConfig?._id) {
        res = await updateSchemeConfigServ(schemeConfig._id, formData);
      } else {
        res = await setSchemeConfigServ(formData);
      }
      if (res?.data?.statusCode === 200) {
        toast.success(res.data.message);
        fetchSchemeConfig();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save scheme config");
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete scheme config?");
    if (confirmed) {
      try {
        const res = await deleteSchemeConfigServ(schemeConfig._id);
        if (res?.data?.statusCode === 200) {
          toast.success(res.data.message);
          setSchemeConfig(null);
          setFormData({
            schemeStartDate: "",
            schemeEndDate: "",
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete scheme config");
      }
    }
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Subscription" selectedItem="Scheme" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="row mx-0 p-0">
            <div className="col-12">
              <h3 className="mb-4 text-bold text-secondary">Scheme Config</h3>

              <div className="card p-4 shadow-sm" style={{ maxWidth: "500px" }}>
                <label>Scheme Start Date</label>
                <input
                  className="form-control mb-3"
                  type="date"
                  value={formData.schemeStartDate}
                  onChange={(e) => setFormData({ ...formData, schemeStartDate: e.target.value })}
                />

                <label>Scheme End Date</label>
                <input
                  className="form-control mb-3"
                  type="date"
                  value={formData.schemeEndDate}
                  onChange={(e) => setFormData({ ...formData, schemeEndDate: e.target.value })}
                />

                <button
                  className="btn btn-success w-100 mb-2"
                  onClick={handleSubmit}
                  disabled={!formData.schemeStartDate || !formData.schemeEndDate || isLoading}
                >
                  {isLoading ? "Saving..." : schemeConfig ? "Update Scheme Config" : "Set Scheme Config"}
                </button>

                {schemeConfig && (
                  <button className="btn btn-danger w-100" onClick={handleDelete}>
                    Delete Scheme Config
                  </button>
                )}
              </div>

              {schemeConfig && (
                <div className="mt-4">
                  <h5>Current Scheme Config:</h5>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {moment(schemeConfig.schemeStartDate).format("DD-MM-YYYY")}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {moment(schemeConfig.schemeEndDate).format("DD-MM-YYYY")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scheme;
