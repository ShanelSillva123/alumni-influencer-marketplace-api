import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

function ApiKeys() {
    const { user } = useAuth();

    const [keys, setKeys] = useState([]);
    const [usageStats, setUsageStats] = useState([]);

    const [name, setName] = useState("");
    const [newKey, setNewKey] = useState("");

    const [loading, setLoading] = useState(true);
    const [usageLoading, setUsageLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const isAdmin = user?.role === "ADMIN";

    const loadKeys = async () => {
        try {
            const res = await apiClient.get("/api-keys/my");
            setKeys(res.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load API keys.");
        } finally {
            setLoading(false);
        }
    };

    const loadUsageStats = async () => {
        if (!isAdmin) return;

        try {
            setUsageLoading(true);
            const res = await apiClient.get("/admin/api-key-usage");
            setUsageStats(res.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load API key usage.");
        } finally {
            setUsageLoading(false);
        }
    };

    useEffect(() => {
        loadKeys();
    }, []);

    useEffect(() => {
        loadUsageStats();
    }, [isAdmin]);

    const createKey = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setNewKey("");

        if (!name.trim()) {
            setError("API key name is required.");
            return;
        }

        try {
            const res = await apiClient.post("/api-keys", { name });
            setNewKey(res.data?.data?.key || "");
            setMessage("API key created successfully.");
            setName("");
            loadKeys();
            loadUsageStats();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create API key.");
        }
    };

    const revokeKey = async (id) => {
        try {
            await apiClient.patch(`/api-keys/${id}/revoke`);
            setMessage("API key revoked successfully.");
            loadKeys();
            loadUsageStats();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to revoke API key.");
        }
    };

    const deleteKey = async (id) => {
        if (!window.confirm("Delete this API key?")) return;

        try {
            await apiClient.delete(`/api-keys/${id}`);
            setMessage("API key deleted successfully.");
            loadKeys();
            loadUsageStats();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete API key.");
        }
    };

    if (loading) return <p>Loading API keys...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>API Keys</h2>
                <p>Manage external access keys for dashboard and public integrations.</p>
            </div>

            <form className="inline-form" onSubmit={createKey}>
                <input
                    type="text"
                    placeholder="API key name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button className="primary-btn">Create Key</button>
            </form>

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}

            {newKey && (
                <div className="api-key-box">
                    <strong>New API Key:</strong>
                    <code>{newKey}</code>
                    <p>Copy this key now. It may not be shown again.</p>
                </div>
            )}

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Key</th>
                    <th>Status</th>
                    <th>Last Used</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {keys.length === 0 ? (
                    <tr>
                        <td colSpan="6">No API keys found.</td>
                    </tr>
                ) : (
                    keys.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>

                            <td>
                                <code>{item.key?.slice(0, 12)}...</code>
                            </td>

                            <td>{item.isActive ? "Active" : "Revoked"}</td>

                            <td>
                                {item.lastUsedAt
                                    ? new Date(item.lastUsedAt).toLocaleString()
                                    : "Never"}
                            </td>

                            <td>
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </td>

                            <td>
                                <div className="action-group">
                                    {item.isActive && (
                                        <button
                                            className="small-primary-btn"
                                            onClick={() => revokeKey(item.id)}
                                        >
                                            Revoke
                                        </button>
                                    )}

                                    <button
                                        className="small-danger-btn"
                                        onClick={() => deleteKey(item.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {isAdmin && (
                <>
                    <div className="section-header" style={{ marginTop: 32 }}>
                        <h2>API Key Usage Statistics</h2>
                        <p>
                            Admin-only usage monitoring showing endpoint access, method,
                            timestamp, and usage count.
                        </p>
                    </div>

                    {usageLoading ? (
                        <p>Loading usage statistics...</p>
                    ) : (
                        <table className="alumni-table">
                            <thead>
                            <tr>
                                <th>Owner</th>
                                <th>Key Name</th>
                                <th>Key</th>
                                <th>Status</th>
                                <th>Usage Count</th>
                                <th>Last Used</th>
                                <th>Recent Endpoint Access</th>
                            </tr>
                            </thead>

                            <tbody>
                            {usageStats.length === 0 ? (
                                <tr>
                                    <td colSpan="7">No API key usage found.</td>
                                </tr>
                            ) : (
                                usageStats.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.user?.email || "N/A"}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            <code>{item.key?.slice(0, 12)}...</code>
                                        </td>
                                        <td>{item.isActive ? "Active" : "Revoked"}</td>
                                        <td>{item._count?.usageLogs || 0}</td>
                                        <td>
                                            {item.lastUsedAt
                                                ? new Date(item.lastUsedAt).toLocaleString()
                                                : "Never"}
                                        </td>
                                        <td>
                                            {item.usageLogs?.length ? (
                                                <div className="usage-log-list">
                                                    {item.usageLogs.map((log) => (
                                                        <div key={log.id} className="usage-log-item">
                                                            <strong>{log.method}</strong> {log.endpoint}
                                                            <br />
                                                            <small>
                                                                {new Date(log.usedAt).toLocaleString()}
                                                            </small>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                "No recent usage"
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
}

export default ApiKeys;