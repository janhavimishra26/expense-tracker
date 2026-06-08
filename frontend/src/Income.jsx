import { useEffect, useState } from "react";
import API from "./api";
import Navbar from "./Navbar";

function Income() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await API.get("/api/expenses");
            setTransactions(res.data);
        };
        fetchData();
    }, []);

    const incomeData = transactions.filter(
        (t) => t.type === "income"
    );

    return (
        <div>
            <Navbar />

            <h2 style={{ textAlign: "center" }}>Income</h2>

            {incomeData.length === 0 ? (
                <p style={{ textAlign: "center" }}>No income found</p>
            ) : (
                incomeData.map((t) => (
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
                        <p style={{ color: "green" }}>+₹{t.amount}</p>
                        <p>{t.expense_date}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Income;