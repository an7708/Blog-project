    import { useState } from "react";
    import { useNavigate } from "react-router-dom";

    function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (data.token) {
            localStorage.setItem("adminToken", data.token);
            navigate("/admin");
        } else {
            setError("Wrong username ya password!");
        }
        } catch (err) {
        setError("Server se connection nahi ho raha!");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "100px auto", padding: "2rem" }}>
        <h2>Admin Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1rem" }}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: "100%", padding: "0.5rem" }}
            />
            </div>
            <div style={{ marginBottom: "1rem" }}>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "0.5rem" }}
            />
            </div>
            <button type="submit" style={{ width: "100%", padding: "0.5rem" }}>
            Login
            </button>
        </form>
        </div>
    );
    }

    export default Login;