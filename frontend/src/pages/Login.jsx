import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem("adminToken", data.token);
                navigate("/admin");
            } else {
                setError("Wrong username or password!");
            }
        } catch (err) {
            setError("Could not connect to server — try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "100px auto", padding: "2rem" }}>
            <h2>Admin Login</h2>
            {error && <p style={{ color: "#b91c1c", fontSize: 14, marginBottom: 12 }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "1rem" }}>
                    <input type="text" placeholder="Username" value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem" }} />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <input type="password" placeholder="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem" }} />
                </div>
                <button type="submit" disabled={loading}
                    style={{ width: "100%", padding: "0.5rem", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;