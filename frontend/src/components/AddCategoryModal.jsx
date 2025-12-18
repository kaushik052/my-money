import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCategoryModal = ({ show, onClose, type, editData }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");

  useEffect(() => {
    if (type) {
      setCategoryType(type); // auto set from parent
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editData) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/categories/${editData.id}`,
          { name: categoryName }
        );
      } else {
        // CREATE
        await axios.post("http://localhost:5000/api/categories", {
          name: categoryName,
          type,
        });
      }

      onClose();
    } catch (err) {
      alert("Operation failed");
    }
  };

  useEffect(() => {
    if (editData) {
      setCategoryName(editData.category_name);
    } else {
      setCategoryName("");
    }
  }, [editData]);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editData ? "Edit Category" : "Add Category"}
              </h5>
              <button type="button" className="close" onClick={onClose}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              {/* Category Name */}
              <div className="form-group text-left">
                <label className="text-left">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>

              {/* Category Type (read-only) */}
              <div className="form-group text-left">
                <label>Category Type</label>
                <select className="form-control" value={categoryType} disabled>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editData ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
