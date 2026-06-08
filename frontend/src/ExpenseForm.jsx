import { useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";

function ExpenseForm({ refreshData }) {
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const categoryMap = {
        Food: 1,
        Travel: 2,
        Shopping: 3,
        Bills: 4,
        Entertainment: 5,
        Health: 6,
        Education: 7,
        Others: 8,
        Salary: 9,
        Freelance: 10,
        Business: 11,
        Investment: 12,
        Gift: 13
    };

    const categories = {
        expense: ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Education", "Others"],
        income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Others"]
    };

    const handleAddTransaction = async () => {
        if (!category || !description || !amount || !date) {
            setMessage("Please fill all fields");
            return;
        }

        try {
            const res = await API.post("/api/expenses", {
                category_id: categoryMap[category],
                type: type,
                description: description,
                amount: amount,
                expense_date: date
            });

            console.log(res.data);

            // SUCCESS MESSAGE
            setMessage("Transaction added successfully!");

            // refresh dashboard instantly
            if (refreshData) {
                refreshData();
            }

            // RESET FORM
            setCategory("");
            setDescription("");
            setAmount("");
            setDate("");

            // optional redirect to dashboard
            setTimeout(() => {
                navigate("/dashboard");
            }, 500);

            setTimeout(() => setMessage(""), 2000);

        } catch (err) {
            console.log(err.response?.data || err.message);
            setMessage(err.response?.data || "Something went wrong");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "20px",
                fontFamily: "Arial"
            }}
        >
            <div
                style={{
                    maxWidth: "500px",
                    margin: "50px auto",
                    background: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
                }}
            >
                {/* TITLE */}
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        fontSize: "26px",
                        fontWeight: "800",
                        color: "#111827"
                    }}
                >
                    Add Transaction
                </h2>

                {/* MESSAGE */}
                {message && (
                    <p
                        style={{
                            textAlign: "center",
                            fontWeight: "700",
                            fontSize: "14px",
                            padding: "10px",
                            borderRadius: "6px",
                            background: message.includes("successfully")
                                ? "#dcfce7"
                                : "#fee2e2",
                            color: message.includes("successfully")
                                ? "#166534"
                                : "#991b1b"
                        }}
                    >
                        {message}
                    </p>
                )}

                {/* TYPE */}
                <div style={{ marginBottom: "15px" }}>
                    <label>Type</label>
                    <select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                            setCategory("");
                        }}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            borderRadius: "8px",
                            border: "1px solid #ccc"
                        }}
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>

                {/* CATEGORY */}
                <div style={{ marginBottom: "15px" }}>
                    <label>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            borderRadius: "8px",
                            border: "1px solid #ccc"
                        }}
                    >
                        <option value="">Select category</option>
                        {categories[type].map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* DESCRIPTION */}
                <div style={{ marginBottom: "15px" }}>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            borderRadius: "8px",
                            border: "1px solid #ccc"
                        }}
                    />
                </div>

                {/* AMOUNT */}
                <div style={{ marginBottom: "15px" }}>
                    <label>Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            borderRadius: "8px",
                            border: "1px solid #ccc"
                        }}
                    />
                </div>

                {/* DATE */}
                <div style={{ marginBottom: "20px" }}>
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            borderRadius: "8px",
                            border: "1px solid #ccc"
                        }}
                    />
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleAddTransaction}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "15px",
                        boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
                    }}
                >
                    Add Transaction
                </button>
            </div>
        </div>
    );
}

export default ExpenseForm;