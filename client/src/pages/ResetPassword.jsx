import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../api/authApi";

function ResetPassword() {
    const [form, setForm] = useState({
        token: "",
        newPassword: "",
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

        if (!form.token || !form.newPassword) {
            setError("Please enter reset token and new password.");
            return;
        }

        try {
            setLoading(true);
            await resetPassword(form);
            setSuccess("Password reset successful. You can now login.");
        } catch (err) {
            setError(err.response?.data?.message || "Password reset failed.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Reset Password</h1>
                <p>Use your reset token to create a new password.</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <div className="form-group">
                        <label htmlFor="token">Reset Token</label>
                        <input
                            id="token"
                            name="token"
                            type="text"
                            placeholder="Paste reset token"
                            value={form.token}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="NewStrongPassword123!"
                            value={form.newPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <button type="submit" className="primary-btn" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;