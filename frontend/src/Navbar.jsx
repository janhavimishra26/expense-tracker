import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                background: "#fff",
                padding: "15px 30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                marginBottom: "20px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "30px",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        color: "#2563eb",
                    }}
                >
                    Expense Tracker
                </h2>

                <Link
    to="/dashboard"
    style={{
        color: "#374151",
        textDecoration: "none",
        fontWeight: "600"
    }}
>
    Dashboard
</Link>

<Link
    to="/income"
    style={{
        color: "#374151",
        textDecoration: "none",
        fontWeight: "600"
    }}
>
    Income
</Link>

<Link
    to="/expenses"
    style={{
        color: "#374151",
        textDecoration: "none",
        fontWeight: "600"
    }}
>
    Expenses
</Link>

<Link
    to="/add-expense"
    style={{
        color: "#374151",
        textDecoration: "none",
        fontWeight: "600"
    }}
>
    Add Expense
</Link>
            </div>

            <button
                onClick={handleLogout}
                style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                Logout
            </button>
        </nav>
    );
}

export default Navbar;