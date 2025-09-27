import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ManageExpense() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      fetchExpenses(userId);
    }
  }, [userId, navigate]);

  const fetchExpenses = async (userId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/manage-expense/${userId}`
      );
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses: ", error);
    }
  };

  const handleEdit = (expense) => setEditExpense(expense);

  const handleChange = (e) => {
    setEditExpense({ ...editExpense, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/update-expense/${editExpense.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editExpense),
        }
      );
      if (response.status === 200) {
        toast.success("Expense Updated Successfully!");
        setEditExpense(null);
        fetchExpenses(userId);
      } else {
        toast.error("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expenses: ", error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/delete-expense/${expenseId}/`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          toast.success("Expense Deleted Successfully!");
          fetchExpenses(userId);
        } else {
          toast.error("Failed to delete expense");
        }
      } catch (error) {
        console.error("Error deleting expense: ", error);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="text-center mb-4">
        <h2 style={{ color: "#4b5563" }}>
          <i className="fas fa-tasks me-2 text-primary"></i>Manage Expense
        </h2>
        <p className="text-muted">View, Edit or Delete Your Expenses</p>
      </div>

      <div>
        <table className="table table-bordered shadow-sm">
          <thead>
            <tr
              className="text-center text-white"
              style={{
                background: "linear-gradient(90deg, #6EE7B7, #3B82F6)",
              }}
            >
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Item</th>
              <th scope="col">Cost</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((exp, index) => (
                <tr key={exp.id} className="align-middle text-center">
                  <th scope="row">{index + 1}</th>
                  <td>{exp.expense_date}</td>
                  <td>{exp.expense_item}</td>
                  <td>
                    <span className="badge bg-success bg-opacity-75">
                      Rs {exp.expense_cost}
                    </span>
                  </td>
                  <td>
                    {/* Responsive buttons */}
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#14b8a6", color: "white" }}
                        onClick={() => handleEdit(exp)}
                      >
                        <i className="fas fa-edit me-1"></i> Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#f43f5e", color: "white" }}
                        onClick={() => handleDelete(exp.id)}
                      >
                        <i className="fas fa-trash me-1"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  <i className="fas fa-exclamation-circle me-2"></i>No expenses
                  found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editExpense && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content shadow-lg">
              <div
                className="modal-header text-white"
                style={{
                  background: "linear-gradient(90deg,#6366F1,#8B5CF6)",
                }}
              >
                <h5 className="modal-title">
                  <i className="fas fa-pen me-2"></i>Edit Expense
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditExpense(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Expense Date</label>
                  <input
                    type="date"
                    name="expense_date"
                    className="form-control"
                    value={editExpense.expense_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Expense Item</label>
                  <input
                    type="text"
                    name="expense_item"
                    className="form-control"
                    value={editExpense.expense_item}
                    onChange={handleChange}
                    required
                    placeholder="Enter expense item (e.g Groceries)"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Expense Cost (Rs)</label>
                  <input
                    type="number"
                    name="expense_cost"
                    className="form-control"
                    value={editExpense.expense_cost}
                    onChange={handleChange}
                    required
                    placeholder="Enter amount spent"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#10b981", color: "white" }}
                  onClick={handleUpdate}
                >
                  Save changes
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setEditExpense(null)}
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default ManageExpense;
