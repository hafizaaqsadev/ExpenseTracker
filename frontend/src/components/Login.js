import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.status === 200) {
        toast.success("Login Successful!");
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.userName);
        setTimeout(() => {
          navigate("/"); // Redirect to Home instead of Dashboard
        }, 1500);
      } else {
        toast.error(data.message || "Login failed!");
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
          <i className="fas fa-sign-in-alt me-2"></i>Login
        </h2>
        <p className="text-muted">Access Your Expense Dashboard</p>
      </div>

      <form
        className="container p-4 border rounded shadow mx-auto"
        style={{ maxWidth: "400px", backgroundColor: "#f8fafc" }}
        onSubmit={handleSubmit}
      >
        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: "#00796b", color: "white" }}>
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
            <span className="input-group-text" style={{ backgroundColor: "#00796b", color: "white" }}>
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              className="form-control"
              onChange={handleChange}
              required
              placeholder="Enter your Password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn w-100 mt-3"
          style={{ backgroundColor: "#00796b", color: "white" }}
        >
          <i className="fas fa-sign-in-alt me-2"></i> Login
        </button>

        <p className="text-center mt-3 text-muted">
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#00796b", textDecoration: "underline" }}>
            Sign up
          </Link>
        </p>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Login;
