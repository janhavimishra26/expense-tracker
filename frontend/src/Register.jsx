import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleRegister = async () => {
        if (!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await axios.post(
    "https://expense-tracker-production-51a8.up.railway.app/register",
    {
        name,
        email,
        password
    }
);

            alert("Registration successful!");

localStorage.setItem("token", res.data.token);

navigate("/dashboard");

setName("");
setEmail("");
setPassword("");
        } catch (error) {
            console.log(error.response?.data || error.message);
            alert("Registration failed!");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fb"
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "40px",
                    width: "400px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "10px",
                        color: "#2563eb"
                    }}
                >
                    Expense Tracker
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#6b7280",
                        marginBottom: "30px"
                    }}
                >
                    Create your account
                </p>

                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "5px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db"
                    }}
                />

                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "5px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db"
                    }}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "5px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db"
                    }}
                />

                <button
                    onClick={handleRegister}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Register
                </button>
            </div>
        </div>
    );
}

export default Register;