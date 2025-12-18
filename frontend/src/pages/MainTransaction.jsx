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

  const fetchTransactions = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/transactions?month=${month}&year=${year}`
    );

    setTransactions(res.data.transactions);
    setTotalIncome(res.data.totalIncome);
    setTotalExpense(res.data.totalExpense);
    setTotal(res.data.total);
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
                            // setEditData(null);
                          }}
                          refreshData={fetchTransactions}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <select
                      className="form-control"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString("en", { month: "long" })}
                        </option>
                      ))}
                    </select>
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
                          {Object.keys(groupedByDate).map((date) => (
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
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
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