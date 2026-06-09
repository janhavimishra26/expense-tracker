import API from "./api";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

function Dashboard() {
    // STATE
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // FETCH DATA
    const fetchExpenses = async () => {
        try {
            const res = await API.get("/api/expenses");
            setTransactions(res.data);
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    // RUN ON MOUNT
    useEffect(() => {
        fetchExpenses();
    }, []);

    // CALCULATIONS
    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = income - expense;

    const deleteTransaction = async (id) => {
        try {
            await API.delete(`/api/expenses/${id}`);

            setTransactions((prev) =>
                prev.filter((t) => t.id !== id)
            );
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const editTransaction = async (transaction) => {
        const newDescription = prompt(
            "Enter new description:",
            transaction.description
        );

        if (!newDescription) return;

        try {
            await API.put(`/api/expenses/${transaction.id}`, {
                category_id: transaction.category_id,
                type: transaction.type,
                description: newDescription,
                amount: transaction.amount,
                expense_date: transaction.expense_date
            });

            fetchExpenses();
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "20px 10px",
                fontFamily: "Arial"
            }}
        >
            <Navbar />

            {/* APP CONTAINER */}
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
                }}
            >
       <div
    style={{
        textAlign: "center",
        marginTop: "20px",
        marginBottom: "30px",
    }}
>
    <h1
    style={{
        fontSize: "42px",
        marginBottom: "10px",
        color: "#111827",
        fontWeight: "700"
    }}
>
    Welcome 👋
</h1>

<p
    style={{
        color: "#6b7280",
        margin: 0,
        fontSize: "16px"
    }}
>
    Track your income, expenses and financial balance in one place.
</p>
</div>
                {/* Summary Cards */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20px",
                        marginTop: "30px",
                        flexWrap: "wrap",
                        padding: "10px"
                    }}
                >
                <div style={{
                    padding: "25px",
                    background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                    border: "1px solid #86efac",
                    borderRadius: "14px",
                    width: "220px",
                    textAlign: "center",
                    boxShadow: "0 8px 20px rgba(34,197,94,0.15)",
                    color: "#000"
                }}>
            <h4
                style={{
                    marginBottom: "10px",
                    color: "#374151",
                    fontWeight: "600"
                }}
            >
                Income
            </h4>
                        <h2 style={{ color: "green" }}>₹{income}</h2>
                    </div>
                        <div style={{
                        padding: "25px",
                        background: "linear-gradient(135deg,#fee2e2,#fecaca)",
                        border: "1px solid #fca5a5",
                        borderRadius: "14px",
                        width: "220px",
                        textAlign: "center",
                        boxShadow: "0 8px 20px rgba(239,68,68,0.15)",
                        color: "#000"
                    }}>
                <h4
                    style={{
                        marginBottom: "10px",
                        color: "#374151",
                        fontWeight: "600"
                    }}
                >
                    Expense
                </h4>
                        <h2 style={{ color: "red" }}>₹{expense}</h2>
                    </div>
                    <div style={{
                        padding: "25px",
                        background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                        border: "1px solid #93c5fd",
                        borderRadius: "14px",
                        width: "220px",
                        textAlign: "center",
                        boxShadow: "0 8px 20px rgba(59,130,246,0.15)",
                        color: "#000"
                    }}>
                <h4
                style={{
                    marginBottom: "10px",
                    color: "#374151",
                    fontWeight: "600"
                }}
            >
                Balance
            </h4>
                        <h2 style={{ color: "blue" }}>₹{balance}</h2>
                    </div>
                </div>

                {/* Transaction List */}
<h2
    style={{
        marginTop: "40px",
        marginBottom: "20px",
        color: "#111827",
        fontWeight: "700",
        textAlign: "center"
    }}
>
    Recent Transactions
</h2>
                <div
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        marginBottom: "25px"
    }}
>
    <input
        type="text"
        placeholder="🔍 Search transactions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
            padding: "12px",
            width: "320px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            fontSize: "15px"
        }}
    />

    <div
        style={{
            display: "flex",
            gap: "10px"
        }}
    >
        <button
            onClick={() => setFilter("all")}
            style={{
                background: filter === "all" ? "#2563eb" : "#e5e7eb",
                color: filter === "all" ? "white" : "black",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
            }}
        >
            All
        </button>

        <button
            onClick={() => setFilter("income")}
            style={{
                background: filter === "income" ? "#16a34a" : "#e5e7eb",
                color: filter === "income" ? "white" : "black",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
            }}
        >
            Income
        </button>

        <button
            onClick={() => setFilter("expense")}
            style={{
                background: filter === "expense" ? "#dc2626" : "#e5e7eb",
                color: filter === "expense" ? "white" : "black",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
            }}
        >
            Expense
        </button>
    </div>
</div>

                {/* LOADING + EMPTY STATE (APP BEHAVIOR) */}
                {transactions.length === 0 ? (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        No transactions yet. Add your first income or expense.
                    </p>
                ) : (
                    transactions
                        .filter((transaction) =>
                            transaction.description
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        )
                        .filter((transaction) =>
                            filter === "all"
                                ? true
                                : transaction.type === filter
                        )
                        .map((transaction) => (
                            <div
                                key={transaction.id}
                                style={{
                                    background: "#ffffff",
                                    borderRadius: "14px",
                                    padding: "18px",
                                    marginTop: "12px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    borderLeft:
                                        transaction.type === "income"
                                            ? "6px solid #22c55e"
                                            : "6px solid #ef4444",
                                    transition: "0.2s"
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.transform = "scale(1.01)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform = "scale(1)")
                                }
                            >
                                <div>
                                    <h4>{transaction.description}</h4>

                                    <p
                                        style={{
                                            color:
                                                transaction.type === "income"
                                                    ? "green"
                                                    : "red",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {transaction.type}
                                    </p>

                                    <p>
                                        {new Date(
                                            transaction.expense_date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <strong
                                    style={{
                                        fontSize: "20px",
                                        display: "block",
                                        marginBottom: "10px"
                                    }}
                                >
                                    ₹{transaction.amount}
                                </strong>
                                    <button
                                        onClick={() => editTransaction(transaction)}
                                        style={{
                                            marginLeft: "15px",
                                            padding: "8px 14px",
                                            background: "#2563eb",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteTransaction(transaction.id)
                                        }
                                        style={{
                                            marginLeft: "10px",
                                            padding: "8px 14px",
                                            background: "#dc2626",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                )}

                <div
    style={{
        marginTop: "40px",
        padding: "30px",
        borderRadius: "16px",
        background: "#ffffff",
        border: "1px solid #dbeafe",
        color: "#111827",
       boxShadow:
    "0 8px 20px rgba(0,0,0,0.08)",
    }}
>
    <h2
         style={{
        textAlign: "center",
        marginBottom: "25px",
        color: "#111827"
    }}
    >
        Financial Summary
    </h2>

    <div
        style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "20px"
        }}
    >
        <div style={{ textAlign: "center" }}>
            <h4
    style={{
        color: "#374151",
        marginBottom: "8px"
    }}
>
    Total Income
</h4>
            <h2 style={{ color: "#16a34a" }}>
                ₹{income}
            </h2>
        </div>

        <div style={{ textAlign: "center" }}>
            <h4
    style={{
        color: "#374151",
        marginBottom: "8px"
    }}
>
    Total Expense
</h4>
            <h2 style={{ color: "#dc2626" }}>
                ₹{expense}
            </h2>
        </div>

        <div style={{ textAlign: "center" }}>

<h4
    style={{
        color: "#374151",
        marginBottom: "8px"
    }}
>
    Current Balance
</h4>            <h2 style={{ color: "#2563eb" }}>
                ₹{balance}
            </h2>
        </div>
    </div>

    <p
        style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#374151",
            fontWeight: "600"
        }}
    >
        Total Transactions: {transactions.length}
    </p>
</div>
            </div>
        </div>
    );
}

export default Dashboard;