import React, { useState, useEffect } from "react";
import axios from "axios";
import './AddTransactionModal.css';

const AddTransactionModal = ({ show, onClose, refreshData, type, editData }) => {
    const [TransactionType, setTransactionType] = useState("");
    const [AccountType, setAccountType] = useState("");
    const [Categories, setCategories] = useState([]);
    const [CategoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState("");
    const [showCalculator, setShowCalculator] = useState(false);
    const [expression, setExpression] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState("");

    useEffect(() => {
        if (editData) {
            setTransactionType(editData.transaction_type);
            setAccountType(editData.account_type);
            setCategoryId(editData.category_id);
            setAmount(editData.amount);
            setDescription(editData.description || "");
            setDateTime(editData.transaction_datetime.slice(0, 16));
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            TransactionType,
            AccountType,
            CategoryId,
            amount,
            description,
            dateTime,
        };

        // 🔐 Frontend validation
        if (!TransactionType || !AccountType || !CategoryId || !amount || !dateTime) {
            alert("Please fill all required fields");
            return;
        }

        // ❌ Prevent future datetime
        if (new Date(dateTime) > new Date()) {
            alert("Future date & time is not allowed");
            return;
        }

        try {
            if (editData) {
                await axios.put(
                    `http://localhost:5000/api/transactions/${editData.id}`,
                    payload
                );
            } else {
                await axios.post(
                    "http://localhost:5000/api/transactions",
                    payload
                );
            }

            refreshData();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save transaction");
        }

    };

    useEffect(() => {
        if (!TransactionType) {
            setCategories([]);
            setCategoryId("");
            return;
        }

        fetch(`http://localhost:5000/api/categories?type=${TransactionType}`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error(err));
    }, [TransactionType]);


    const handleCalcClick = (value) => {
        if (value === "C") {
            setExpression("");
            return;
        }

        if (value === "⌫") {
            setExpression((prev) => prev.slice(0, -1));
            return;
        }

        if (value === "=") {
            try {
                const result = eval(expression);
                setAmount(result.toString());
                setExpression("");
                setShowCalculator(false);
            } catch {
                alert("Invalid Expression");
            }
            return;
        }

        setExpression((prev) => prev + value);
    };

    const getLocalDateTimeISO = () => {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        if (show) {
            setDateTime(getLocalDateTimeISO());
        }
    }, [show]);

    if (!show) return null;

    return (
        <>
            <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editData ? "Edit transaction" : "Add transaction"}
                                </h5>
                                <button type="button" className="close" onClick={onClose}>
                                    &times;
                                </button>
                            </div>

                            <div className="modal-body">
                                {/* Transaction Name */}
                                <div className="form-group text-left">
                                    <label className="text-left">Transaction type <span style={{ color: "red" }}>*</span></label>
                                    <select
                                        className="form-control"
                                        value={TransactionType}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                    >
                                        <option value="">Select transaction type</option>
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>

                                {/* Account Type */}
                                <div className="form-group text-left">
                                    <label className="text-left">Account Type <span style={{ color: "red" }}>*</span></label>
                                    <select
                                        className="form-control"
                                        value={AccountType}
                                        onChange={(e) => setAccountType(e.target.value)}
                                    >
                                        <option value="">Select account type</option>
                                        <option value="card">Card</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                </div>

                                {/* Category Type */}
                                <div className="form-group text-left">
                                    <label className="text-left">Category Type <span style={{ color: "red" }}>*</span></label>
                                    <select
                                        className="form-control"
                                        value={CategoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        disabled={!TransactionType}
                                    >
                                        <option value="">Select Category</option>
                                        {Categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Amount */}
                                <div className="form-group text-left position-relative">
                                    <label className="text-left">Amount <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={amount}
                                        readOnly
                                        placeholder="Click to calculate"
                                        onClick={() => setShowCalculator(true)}
                                    />
                                </div>

                                {/* Description */}
                                <div className="form-group text-left">
                                    <label className="text-left">Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Enter description (optional)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* Date & Time */}
                                <div className="form-group text-left">
                                    <label className="text-left">Date & Time <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={dateTime}
                                        max={getLocalDateTimeISO()}    // 🔥 DISABLE FUTURE DATE & TIME
                                        onChange={(e) => setDateTime(e.target.value)}
                                    />

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

            {/* ✅ CALCULATOR (NOW IT WILL OPEN) */}
            {showCalculator && (
                <div className="calculator-overlay">
                    <div className="calculator-box">
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={expression}
                            readOnly
                        />

                        <div className="calculator-grid">
                            {["7", "8", "9", "⌫", "/", "(", "4", "5", "6", "*", ")", "1", "2", "3", "-", "0", ".", "+", "C", "="].map((btn) => (
                                <button
                                    key={btn}
                                    className="btn btn-light btn-border"
                                    onClick={() => handleCalcClick(btn)}
                                >
                                    {btn}
                                </button>
                            ))}
                        </div>

                        <button
                            className="btn btn-danger mt-2 w-100"
                            onClick={() => setShowCalculator(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddTransactionModal;
