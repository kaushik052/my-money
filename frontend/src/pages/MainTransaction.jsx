import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MainTransaction = () => {

  return (
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
                        // onClick={() => setShowModal(true)}
                      >
                        Add Transaction
                      </button>
                      {/* <AddCategoryModal
                        show={showModal}
                        onClose={() => {
                          setShowModal(false);
                          setEditData(null);
                          fetchCategories(); // 🔥 refresh list
                        }}
                        type="expense"
                        editData={editData}
                      /> */}
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th style={{ width: 50 }}>#</th>
                          <th>Category Name</th>
                          <th>Color Code</th>
                          <th style={{ width: 150 }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {loading ? (
                          <tr>
                            <td colSpan="4" className="text-center">Loading...</td>
                          </tr>
                        ) : categories.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center">No categories found</td>
                          </tr>
                        ) : (
                          categories.map((cat, index) => (
                            <tr key={cat.id}>
                              <td>{index + 1}</td>
                              <td>{cat.category_name}</td>
                              <td>
                                <span
                                  className="badge"
                                  style={{ backgroundColor: cat.category_color, color: "#fff" }}
                                >
                                  {cat.category_color}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-warning mr-2"
                                  onClick={() => {
                                    setEditData(cat);
                                    setShowModal(true);
                                  }}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>

                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(cat.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )} */}
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

  )
}
export default MainTransaction;