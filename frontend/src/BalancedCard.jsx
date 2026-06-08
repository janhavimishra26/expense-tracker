import { useEffect, useState } from "react";
import API from "./api";

function BalancedCard() {
    const [totalExpense, setTotalExpense] = useState(0);
    const [expenseCount, setExpenseCount] = useState(0);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await API.get("/api/expenses");

            const expensesOnly = res.data.filter(
                (item) => item.type === "expense"
            );

            const total = expensesOnly.reduce(
                (sum, expense) => sum + Number(expense.amount),
                0
            );

            setTotalExpense(total);
            setExpenseCount(expensesOnly.length);

        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    return (
        <div
            style={{
                marginTop: "40px",
                padding: "30px",
                borderRadius: "16px",
                background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                color: "#000",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
        >
        <h2>Financial Summary</h2>
            <p
                style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                }}
            >
                Total Expenses: ₹{totalExpense}
            </p>

            <p>
                Number of Expenses: {expenseCount}
            </p>
        </div>
    );
}

export default BalancedCard;