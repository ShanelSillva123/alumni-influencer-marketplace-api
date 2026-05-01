import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "USER",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.email || !form.password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);
            await registerUser(form);
            setSuccess("Registration successful. Please verify your email before logging in.");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p>Register to access the Alumni Analytics Dashboard.</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}
                    {success && (
                        <div className="auth-success">
                            {success}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">University Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="student@university.ac.uk"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="StrongPassword123!"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <button type="submit" className="primary-btn" disabled={loading}>
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <div className="auth-links">
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
                </div>
            </div>
        </div>
    );
}

export default Register;