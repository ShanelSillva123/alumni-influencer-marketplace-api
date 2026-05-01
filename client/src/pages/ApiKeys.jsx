import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function ApiKeys() {
    const [keys, setKeys] = useState([]);
    const [name, setName] = useState("");
    const [newKey, setNewKey] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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

    useEffect(() => {
        loadKeys();
    }, []);

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
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create API key.");
        }
    };

    const revokeKey = async (id) => {
        try {
            await apiClient.patch(`/api-keys/${id}/revoke`);
            setMessage("API key revoked successfully.");
            loadKeys();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to revoke API key.");
        }
    };

    const deleteKey = async (id) => {
        try {
            await apiClient.delete(`/api-keys/${id}`);
            setMessage("API key deleted successfully.");
            loadKeys();
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
                                    ? new Date(item.lastUsedAt).toLocaleDateString()
                                    : "Never"}
                            </td>
                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
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
        </div>
    );
}

export default ApiKeys;