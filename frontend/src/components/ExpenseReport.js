import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ExpenseReport() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/search-expense/${userId}/?from=${fromDate}&to=${toDate}`
      );
      const data = await response.json();
      setExpenses(data.expenses);
      setGrandTotal(data.total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        background: "linear-gradient(135deg, #f8fafc, #edf2f7)",
        minHeight: "100vh",
        borderRadius: "10px",
      }}
    >
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          <i className="fas fa-file-invoice-dollar me-2 text-success"></i>
          Datewise Expense Report
        </h2>
        <p className="text-muted">
          Search & Analyze Your Expenses Between Two Dates
        </p>
      </div>

      {/* Search Form */}
      <form
        className="row g-3 shadow-sm bg-white p-4 rounded-3 border mx-auto"
        style={{ maxWidth: "800px" }}
        onSubmit={handleSubmit}
      >
        <div className="col-md-4">
          <label className="form-label fw-semibold">From</label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="fas fa-calendar-alt text-primary"></i>
            </span>
            <input
              type="date"
              name="fromdate"
              value={fromDate}
              className="form-control"
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">To</label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="fas fa-calendar-alt text-primary"></i>
            </span>
            <input
              type="date"
              name="todate"
              value={toDate}
              className="form-control"
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#4a90e2",
              color: "white",
              fontWeight: "600",
              borderRadius: "8px",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#357ABD")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4a90e2")}
          >
            <i className="fas fa-search me-2"></i> Search
          </button>
        </div>
      </form>

      {/* Results Table */}
      <div className="mt-5 shadow-sm bg-white p-4 rounded-3 border">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr
              style={{
                backgroundColor: "#4a90e2",
                color: "white",
                textAlign: "center",
              }}
            >
              <th>#</th>
              <th>Date</th>
              <th>Item</th>
              <th>Cost (₨)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((exp, index) => (
                <tr key={exp.id} className="text-center">
                  <td>{index + 1}</td>
                  <td>{exp.expense_date}</td>
                  <td className="fw-semibold">{exp.expense_item}</td>
                  <td className="text-success fw-bold">
                    ₨ {exp.expense_cost}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  <i className="fas fa-exclamation-circle me-2 text-warning"></i>
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
          {expenses.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={3} className="text-end fw-bold">
                  Grand Total:
                </td>
                <td className="fw-bold text-success">₨ {grandTotal}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <ToastContainer />
    </div>
  );
}

export default ExpenseReport;
