import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import financeImg from "../assets/finance.jpg";

const Home = () => {
  const userId = localStorage.getItem("userId");

  // Load reviews from localStorage or use default dummy reviews
  const dummyReviews = [
    { id: 1, name: "Ali", comment: "This app helped me save money!" },
    { id: 2, name: "Sara", comment: "Very easy to track expenses." },
    { id: 3, name: "Ahmed", comment: "Love the visual insights!" },
    { id: 4, name: "Fatima", comment: "Secure and simple to use." },
  ];

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("reviews");
    return saved ? JSON.parse(saved) : dummyReviews;
  });

  const [newReview, setNewReview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleAddReview = () => {
    if (newReview.trim() === "") return;
    const nextId = reviews.length ? reviews[reviews.length - 1].id + 1 : 1;
    setReviews([
      ...reviews,
      { id: nextId, name: "Anonymous", comment: newReview },
    ]);
    setNewReview("");
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = () => {
    setReviews(
      reviews.map((r) =>
        r.id === editingId ? { ...r, comment: editingText } : r
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <div
        className="row align-items-center p-5 rounded-4 shadow-sm"
        style={{ background: "linear-gradient(135deg, #e0f7fa, #fce4ec)" }}
      >
        <div className="col-md-6 text-center text-md-start">
          <h1 className="fw-bold mb-2" style={{ color: "#333" }}>
            Welcome to
          </h1>
          <h1 className="fw-bold mb-3" style={{ color: "#00796b" }}>
            Daily Expense Tracker
          </h1>
          <p className="lead mb-4" style={{ color: "#555" }}>
            Track your daily expenses easily and efficiently
          </p>

          {/* CTA Button */}
          <div className="d-flex justify-content-center justify-content-md-start">
            <Link
              to={userId ? "/dashboard" : "/signup"}
              className="btn btn-lg px-4 shadow-sm"
              style={{
                backgroundColor: "#00796b",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <i
                className={`fas ${userId ? "fa-chart-pie" : "fa-play"} me-2`}
              ></i>
              {userId ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>

        <div className="col-md-6 text-center mt-4 mt-md-0">
          <img
            src={financeImg}
            alt="Finance Illustration"
            className="img-fluid"
            style={{ maxHeight: "320px" }}
          />
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mt-5 text-center">
        <h3 style={{ color: "#444" }}>✨ Why Choose Us?</h3>
        <p className="text-muted">
          Simple, fast, and modern way to manage your expenses with beautiful
          insights.
        </p>
        <div className="row mt-4">
          {[
            {
              icon: "fa-receipt",
              color: "text-primary",
              title: "Track Daily Expenses",
            },
            {
              icon: "fa-chart-line",
              color: "text-success",
              title: "View Reports",
            },
            {
              icon: "fa-chart-pie",
              color: "text-warning",
              title: "Visual Insights",
            },
            { icon: "fa-lock", color: "text-danger", title: "Secure Data" },
          ].map((item, i) => (
            <div key={i} className="col-md-3 mb-3">
              <div className="p-4 bg-white shadow rounded-3 h-100 text-center">
                <i className={`fas ${item.icon} fa-2x mb-3 ${item.color}`}></i>
                <h5>{item.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div
        className="mt-5 p-4 rounded-3 shadow-sm text-center"
        style={{ background: "#f9fbe7" }}
      >
        <h5 className="fst-italic text-muted">
          💡 “Take control of your spending, one day at a time.”
        </h5>
      </div>

      {/* Reviews Section */}
      <div className="mt-5 text-center">
        <h3 style={{ color: "#444" }}>User Reviews</h3>

        {/* Input for logged-in user only */}
        {localStorage.getItem("userId") && (
          <div className="mb-3 d-flex justify-content-center gap-2 flex-wrap">
            <input
              type="text"
              value={editingId ? editingText : newReview}
              onChange={(e) =>
                editingId
                  ? setEditingText(e.target.value)
                  : setNewReview(e.target.value)
              }
              placeholder={editingId ? "Edit review..." : "Write a review..."}
              className="form-control w-50"
            />
            {editingId ? (
              <button
                className="btn"
                style={{ backgroundColor: "#14b8a6", color: "white" }}
                onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
                onMouseLeave={(e) => (e.target.style.opacity = 1)}
                onClick={handleSaveEdit}
              >
                <i className="fas fa-save me-1"></i> Save
              </button>
            ) : (
              <button
                className="btn"
                style={{ backgroundColor: "#14b8a6", color: "white" }}
                onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
                onMouseLeave={(e) => (e.target.style.opacity = 1)}
                onClick={() => {
                  if (!newReview.trim()) return;
                  const review = {
                    id: Date.now(),
                    userId: localStorage.getItem("userId"),
                    name: localStorage.getItem("userName"),
                    comment: newReview,
                  };
                  setReviews([review, ...reviews]);
                  setNewReview("");
                }}
              >
                <i className="fas fa-plus me-1"></i> Add
              </button>
            )}
          </div>
        )}

        <div className="row g-3 justify-content-center">
          {reviews.map((r) => (
            <div key={r.id} className="col-md-4">
              <div
                className="p-3 bg-light shadow-sm rounded-3 text-start position-relative"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                style={{ transition: "transform 0.2s" }}
              >
                <strong style={{ color: "#14b8a6" }}>{r.name}</strong>
                <p className="text-dark">{r.comment}</p>

                {/* Show Edit/Delete only for logged-in user's review */}
                {r.userId === localStorage.getItem("userId") && (
                  <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
                    <button
                      onClick={() => handleEdit(r.id, r.comment)}
                      className="btn btn-sm"
                      style={{ backgroundColor: "#14b8a6", color: "white" }}
                      onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
                      onMouseLeave={(e) => (e.target.style.opacity = 1)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="btn btn-sm"
                      style={{ backgroundColor: "#f43f5e", color: "white" }}
                      onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
                      onMouseLeave={(e) => (e.target.style.opacity = 1)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Call to Action */}
      <div className="mt-5 text-center">
        <div
          className="p-5 rounded-4 shadow"
          style={{ background: "linear-gradient(135deg, #c8e6c9, #bbdefb)" }}
        >
          <h3 className="fw-bold mb-3" style={{ color: "#333" }}>
            Start Tracking Today — It's Free!
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Home;
