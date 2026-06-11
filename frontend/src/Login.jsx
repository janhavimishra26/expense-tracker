
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post(
            "https://expense-tracker-production-51a8.up.railway.app/login",
            { email, password }
        );

       if (!res.data.token) {
    alert("Login failed");
    return;
}
    localStorage.setItem("token", res.data.token);
    window.dispatchEvent(new Event("storage"));
    navigate("/dashboard");

    } catch (error) {
    console.log("FULL ERROR:", error);
    console.log("SERVER RESPONSE:", error.response);

    alert(
        error.response 
        ? JSON.stringify(error.response.data)
        : error.message
    );
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
                        color: "#2563eb",
                        marginBottom: "10px"
                    }}
                >
                    Welcome Back 👋
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#6b7280",
                        marginBottom: "30px"
                    }}
                >
                    Login to continue
                </p>

                <form onSubmit={handleLogin}>
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
                        type="submit"
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
                        Login
                    </button>

                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "15px"
                        }}
                    >
                        Don't have an account?{" "}
                        <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;

