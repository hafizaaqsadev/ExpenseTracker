import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

function AddExpense() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    expense_date: '',
    expense_item: '',
    expense_cost: '',
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/add-expense/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user: userId   
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success(data.message || "Expense added successfully!");
        setFormData({
          expense_date: '',
          expense_item: '',
          expense_cost: '',
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error(data.message || "Failed to add expense");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Try again.');
    }
  };

  return (
    <div className="container mt-5 pt-5">
      {/* Header with gradient */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark">
          <i className="fas fa-plus-circle me-2 text-primary"></i>
          Add Expense
        </h2>
        <p className="text-muted">Track your new spending here</p>
      </div>

      {/* Stylish Card */}
      <form
        className="container p-4 rounded-4 shadow-lg mx-auto bg-light"
        style={{
          maxWidth: '450px',
          border: '1px solid #e9ecef',
          background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
        }}
        onSubmit={handleSubmit}
      >
        {/* Expense Date */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">
            Expense Date
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-calendar-alt text-primary"></i>
            </span>
            <input
              type="date"
              name="expense_date"
              value={formData.expense_date}
              className="form-control border-start-0"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Expense Item */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">
            Expense Item
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-shopping-cart text-success"></i>
            </span>
            <input
              type="text"
              name="expense_item"
              value={formData.expense_item}
              className="form-control border-start-0"
              onChange={handleChange}
              required
              placeholder="e.g Groceries, Petrol"
            />
          </div>
        </div>

        {/* Expense Cost */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">
            Expense Cost (Rs)
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="fas fa-rupee-sign text-danger"></i>
            </span>
            <input
              type="number"
              name="expense_cost"
              value={formData.expense_cost}
              className="form-control border-start-0"
              onChange={handleChange}
              required
              placeholder="Enter amount spent"
            />
          </div>
        </div>

        {/* Stylish Button */}
        <button
          type="submit"
          className="btn w-100 mt-3 fw-semibold text-white rounded-3"
          style={{
            background: 'linear-gradient(90deg, #4e73df, #1cc88a)',
            border: 'none',
            transition: '0.3s',
          }}
          onMouseOver={(e) =>
            (e.target.style.background = 'linear-gradient(90deg,#1cc88a,#4e73df)')
          }
          onMouseOut={(e) =>
            (e.target.style.background = 'linear-gradient(90deg,#4e73df,#1cc88a)')
          }
        >
          <i className="fas fa-plus me-2"></i> Add Expense
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}

export default AddExpense;
