import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        toast.success("Signup Successful! Please Login.");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const data = await response.json();
        toast.error(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("⚠️ Something went wrong. Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 style={{ color: "#00796b" }}>
          <i className="fas fa-user-plus me-2"></i> Signup
        </h2>
        <p className="text-muted">
          Create Your Account To Start Tracking Expenses
        </p>
      </div>

      <form
        className="container p-4 border rounded shadow mx-auto"
        style={{ maxWidth: "400px", backgroundColor: "#f8fafc" }}
        onSubmit={handleSubmit}
      >
        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <div className="input-group">
            <span
              className="input-group-text"
              style={{ backgroundColor: "#00796b", color: "white" }}
            >
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              className="form-control"
              onChange={handleChange}
              required
              placeholder="Enter your Full Name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <div className="input-group">
            <span
              className="input-group-text"
              style={{ backgroundColor: "#00796b", color: "white" }}
            >
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="form-control"
              onChange={handleChange}
              required
              placeholder="Enter your Email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="input-group">
            <span
              className="input-group-text"
              style={{ backgroundColor: "#00796b", color: "white" }}
            >
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              className="form-control"
              onChange={handleChange}
              required
              placeholder="Create a Password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn w-100 mt-3"
          style={{ backgroundColor: "#00796b", color: "white" }}
        >
          <i className="fas fa-user-plus me-2"></i> Signup
        </button>

        <p className="text-center mt-3 text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#00796b", textDecoration: "underline" }}
          >
            Login
          </Link>
        </p>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Signup;
