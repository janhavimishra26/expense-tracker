import { useEffect, useState } from "react";
import API from "./api";

function ExpenseList() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        fetchExpenses();
    }, []);

    // 👇 ADD HERE (inside component)
    const fetchExpenses = async () => {
        try {
            console.log("CALLING /api/expenses"); // 👈 ADD THIS

            const res = await API.get("/api/expenses");

            console.log("RESPONSE:", res.data); // 👈 ADD THIS

            setExpenses(res.data);

        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);
        }
    };

    return (
        <div>
            <h2>Expense List</h2>

            <p>Total Expenses: {expenses.length}</p>

            {expenses.map((expense) => (
                <div key={expense.id}>
                    <p>{expense.description}</p>
                </div>
            ))}
        </div>
    );
}

export default ExpenseList;