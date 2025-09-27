import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/change-password/${userId}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        toast.success(data.message);
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

        setTimeout(() => {
          localStorage.removeItem("userId");
          navigate("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Password change failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("⚠️ Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)",
      }}
    >
      <div
        className="p-4 rounded shadow-lg bg-white"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-teal">
            <i className="fas fa-key me-2 text-success"></i> Change Password
          </h2>
          <p className="text-muted">Secure your account with a new password</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Old Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="fas fa-lock text-secondary"></i>
              </span>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                className="form-control"
                onChange={handleChange}
                required
                placeholder="Enter your old password"
              />
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="fas fa-lock-open text-secondary"></i>
              </span>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                className="form-control"
                onChange={handleChange}
                required
                placeholder="Enter your new password"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="fas fa-lock-open text-secondary"></i>
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                className="form-control"
                onChange={handleChange}
                required
                placeholder="Confirm your new password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold"
            style={{
              backgroundColor: "#009688",
              color: "white",
              borderRadius: "8px",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#00796b")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#009688")}
          >
            <i className="fas fa-key me-2"></i> Change Password
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
