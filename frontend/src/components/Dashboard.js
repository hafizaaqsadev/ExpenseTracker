import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);
function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  const [expenses, setExpenses] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const [last7DaysTotal, setLast7DaysTotal] = useState(0);
  const [last30DaysTotal, setLast30DaysTotal] = useState(0);
  const [currentYearTotal, setCurrentYearTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // {
  //   labels: ['Milk','Badminton', 'Books']
  //  datasets : [
  //  data: [60,200,300]
  //  backgroundcolor : ['Red','Blue']
  // ]
  // }
 const pieData = {
  labels: expenses.map((exp) => exp.expense_item), // ✅ "label" ki jagah "labels"
  datasets: [
    {
      data: expenses.map((exp) => parseFloat(exp.expense_cost)),
      backgroundColor: [
        "#FFDDC1", 
        "#C1E1C1", 
        "#FFFACD", 
        "#D1C4E9", 
        "#F8BBD0", 
        "#B2EBF2",
      ],
      borderColor: "#fff", 
      borderWidth: 2,
    },
  ],
};


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
        `http://127.0.0.1:8000/api/manage-expense/${userId}/`
      );
      if (!response.ok) throw new Error("Failed to fetch expenses");

      const data = await response.json();
      console.log("Expenses data:", data);
      setExpenses(data);
      calculateTotals(data);
    } catch (error) {
      console.error("Error fetching expenses: ", error);
    }
  };

  const calculateTotals = (data) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    const currentYear = today.getFullYear();

    let todaySum = 0,
      yesterdaySum = 0,
      last7Sum = 0,
      last30Sum = 0,
      yearSum = 0,
      grandSum = 0;

    const formatDate = (date) => {
      return date.toISOString().split("T")[0]; // "2025-09-16"
    };

    data.forEach((item) => {
      const expenseDate = new Date(item.expense_date);
      const amount = parseFloat(item.expense_cost) || 0;

      const expDateStr = formatDate(expenseDate);
      const todayStr = formatDate(today);
      const yesterdayStr = formatDate(yesterday);

      if (expDateStr === todayStr) {
        todaySum += amount;
      }
      if (expDateStr === yesterdayStr) {
        yesterdaySum += amount;
      }
      if (expenseDate >= last7Days) {
        last7Sum += amount;
      }
      if (expenseDate >= last30Days) {
        last30Sum += amount;
      }
      if (expenseDate.getFullYear() === currentYear) {
        yearSum += amount;
      }
      grandSum += amount;
    });

    setTodayTotal(todaySum);
    setYesterdayTotal(yesterdaySum);
    setLast7DaysTotal(last7Sum);
    setLast30DaysTotal(last30Sum);
    setCurrentYearTotal(yearSum);
    setGrandTotal(grandSum);
  };
  

  return (
    <div className="container mt-4">
      <div className="text-center mt-5">
        <h2>Welcome, {userName}!</h2>
        <p className="text-muted">Here's Your Expense Overview</p>
      </div>
      <div className="row g-4">
        <div className="col-md-4">
          <div
            className="card text-dark text-center mb-3"
            style={{ height: "150px", backgroundColor: "#FFDDC1" }} // pastel peach
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-day me-2"></i>Today's Expense
              </h5>
              <p className="card-text fs-4">₨ {todayTotal}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card text-dark text-center mb-3"
            style={{ height: "150px", backgroundColor: "#C1E1C1" }} // pastel green
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-minus me-2"></i>Yesterday's
                Expense
              </h5>
              <p className="card-text fs-4">₨ {yesterdayTotal}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card text-dark text-center mb-3"
            style={{ height: "150px", backgroundColor: "#FFFACD" }} // pastel yellow
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-week me-2"></i>Last 7 Days
              </h5>
              <p className="card-text fs-4">₨ {last7DaysTotal}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card text-dark text-center mb-3"
            style={{ height: "150px", backgroundColor: "#D1C4E9" }} // pastel lavender
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar-alt me-2"></i>Last 30 Days
              </h5>
              <p className="card-text fs-4">₨ {last30DaysTotal}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card text-dark text-center mb-3"
            style={{ height: "150px", backgroundColor: "#F8BBD0" }} // pastel pink
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-calendar me-2"></i>Current Year
              </h5>
              <p className="card-text fs-4">₨ {currentYearTotal}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card text-dark text-center mb-3"
            style={{ height: "150px", backgroundColor: "#B2EBF2" }} // pastel cyan
          >
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-wallet me-2"></i>Total Expense
              </h5>
              <p className="card-text fs-4">₨ {grandTotal}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-5" style={{width:'400px',height:'400px',margin:'auto'}}>
        <h4 className="text-center">Expense Distribution</h4>
        <Pie data={pieData}/>
      </div>
    </div>
  );
}

export default Dashboard;
