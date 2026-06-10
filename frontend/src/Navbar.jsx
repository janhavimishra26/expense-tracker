import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const linkStyle = {
        color: "#374151",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "14px",
        whiteSpace: "nowrap"
    };

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                background: "#fff",
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                marginBottom: "20px",
                boxSizing: "border-box",
                width: "100%"
            }}
        >
            {/* LEFT SIDE */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap"
                }}
            >
                <h2 style={{ margin: 0, color: "#2563eb" }}>
                    Expense Tracker
                </h2>

                <Link to="/dashboard" style={linkStyle}>
                    Dashboard
                </Link>

                <Link to="/income" style={linkStyle}>
                    Income
                </Link>

                <Link to="/expenses" style={linkStyle}>
                    Expenses
                </Link>

                <Link to="/add-expense" style={linkStyle}>
                    Add Expense
                </Link>
            </div>

            {/* RIGHT SIDE */}
            <div style={{ marginTop: "8px" }}>
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
                        whiteSpace: "nowrap"
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;