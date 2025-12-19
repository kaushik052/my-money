import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AddTransactionModal from "../components/AddTransactionModal";
import './MainTransaction.css';

const MainTransaction = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [total, setTotal] = useState(0);
  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

  const today = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const getFirstDay = (date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-01`;
  };

  const getLastDay = (date) => {
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`;
  };

  const [fromDate, setFromDate] = useState(getFirstDay(today));
  const [toDate, setToDate] = useState(getLastDay(today));
  const [preset, setPreset] = useState("");

  const formatDate = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const fetchTransactions = async () => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (from > to) {
        alert("From date must be earlier than To date");
        return; // stop API call
      }
    }
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/transactions", {
        params: {
          fromDate,
          toDate,
          preset,
        },
      });

      setTransactions(res.data.transactions);
      setTotalIncome(res.data.totalIncome);
      setTotalExpense(res.data.totalExpense);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchTransactions(); // refresh table
    } catch (error) {
      console.error(error);
      alert("Failed to delete transaction");
    }
  };


  useEffect(() => {
    fetchTransactions();
  }, [month, year]);
  

  const groupedByDate = transactions.reduce((acc, t) => {
    acc[t.transaction_date] = acc[t.transaction_date] || [];
    acc[t.transaction_date].push(t);
    return acc;
  }, {});

  return (
    <>
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-md-6">
                <h1>All transaction</h1>
              </div>
              <div className="col-md-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">All transactions</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <div className='row'>
                      <div className='col-md-6'><h3 className="card-title">List of transactions</h3></div>
                      <div className='col-md-6 text-right'>
                        <button
                          className="btn btn-primary mb-3"
                          onClick={() => setShowModal(true)}
                        >
                          Add Transaction
                        </button>
                        <AddTransactionModal
                          show={showModal}
                          onClose={() => {
                            setShowModal(false);
                            setEditData(null);
                          }}
                          editData={editData}
                          refreshData={fetchTransactions}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label>From Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={fromDate}
                          onChange={(e) => {
                            setPreset("");
                            setFromDate(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-md-3">
                        <label>To Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={toDate}
                          onChange={(e) => {
                            setPreset("");
                            setToDate(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-md-3">
                        <label>Quick Report</label>
                        <select
                          className="form-control"
                          onChange={(e) => {
                            const value = e.target.value;
                            setPreset(value);

                            const now = new Date();
                            let start = new Date();
                            let end = new Date();

                            if (value === "weekly") {
                              start.setDate(now.getDate() - 7);
                            }

                            if (value === "quarter") {
                              start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                            }

                            if (value === "halfyear") {
                              start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                            }

                            if (value === "yearly") {
                              start = new Date(now.getFullYear(), 0, 1);
                            }

                            if (value) {
                              setFromDate(formatDate(start));
                              setToDate(formatDate(end));
                            }
                          }}
                        >
                          <option value="">Custom</option>
                          <option value="weekly">Weekly</option>
                          <option value="quarter">Last 3 Months</option>
                          <option value="halfyear">Last 6 Months</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>

                      <div className="col-md-3 d-flex align-items-end">
                        <button className="btn btn-primary w-100" onClick={fetchTransactions}>
                          Apply Filter
                        </button>
                      </div>
                    </div>
                    <div className="row mt-3 mb-3 text-center summary">
                      <div className="col-md-4">
                        <span className="income">Income: ₹{totalIncome}</span>
                      </div>
                      <div className="col-md-4">
                        <span className="expense">Expense: ₹{totalExpense}</span>
                      </div>
                      <div className="col-md-4">
                        <span className="total">Total: ₹{total}</span>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
                          <tr>
                            <th>Transaction Type</th>
                            <th>Account Type</th>
                            <th>Category</th>
                            <th className="text-right">Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan="5" className="text-center">Loading...</td>
                            </tr>
                          ) : Object.keys(groupedByDate).length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center">No transaction found</td>
                            </tr>
                          ) : (
                            Object.keys(groupedByDate).map((date) => (
                              <React.Fragment key={date}>
                                {/* Date Header Row */}
                                <tr className="table-secondary">
                                  <td colSpan="5" style={{ fontWeight: "bold" }}>
                                    {new Date(date).toDateString()}
                                  </td>
                                </tr>

                                {/* Transactions */}
                                {groupedByDate[date].map((t) => (
                                  <tr key={t.id}>
                                    <td>{t.transaction_type === "expense" ? "Expense" : "Income"}</td>
                                    <td>{t.account_type === "card" ? "Card" : "Cash"}</td>
                                    <td>{t.category_name}</td>

                                    <td
                                      className="text-right"
                                      style={{
                                        color: t.transaction_type === "expense" ? "red" : "green",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {t.transaction_type === "expense" ? "-" : "+"}₹{t.amount}
                                    </td>

                                    <td>
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => setViewData(t)}
                                      >
                                        View
                                      </button>
                                      <button
                                        className="btn btn-sm btn-warning mr-2"
                                        onClick={() => {
                                          setEditData(t);
                                          setShowModal(true);
                                        }}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(t.id)}
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {viewData && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Transaction Details</h5>
                <button onClick={() => setViewData(null)}>&times;</button>
              </div>

              <div className="modal-body">
                <p><b>Category:</b> {viewData.category_name}</p>
                <p><b>Description:</b> {viewData.description || "N/A"}</p>
                <p>
                  <b>Date:</b>{" "}
                  {new Date(viewData.transaction_datetime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default MainTransaction;