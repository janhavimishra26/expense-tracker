import { useEffect, useState } from "react";
import API from "./api";
import Navbar from "./Navbar";

function Expenses() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await API.get("/api/expenses");
            setTransactions(res.data);
        };
        fetchData();
    }, []);

    const expenseData = transactions.filter(
        (t) => t.type === "expense"
    );

    return (
        <div>
            <Navbar />

            <h2 style={{ textAlign: "center" }}>Expenses</h2>

            {expenseData.length === 0 ? (
                <p style={{ textAlign: "center" }}>No expenses found</p>
            ) : (
                expenseData.map((t) => (
                    <div
                        key={t.id}
                        style={{
                            border: "1px solid #ddd",
                            margin: "10px",
                            padding: "10px",
                            borderRadius: "8px",
                        }}
                    >
                        <h4>{t.description}</h4>
                        <p style={{ color: "red" }}>-₹{t.amount}</p>
                        <p>{t.expense_date}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Expenses;