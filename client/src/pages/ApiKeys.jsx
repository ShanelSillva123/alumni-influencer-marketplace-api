import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

const PERMISSIONS = ["read:alumni", "read:analytics", "read:alumni_of_day"];

function ApiKeys() {
    const { user } = useAuth();

    const [keys, setKeys] = useState([]);
    const [usageStats, setUsageStats] = useState([]);
    const [name, setName] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [editingPermissionsId, setEditingPermissionsId] = useState(null);
    const [newKey, setNewKey] = useState("");
    const [loading, setLoading] = useState(true);
    const [usageLoading, setUsageLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const isAdmin = user?.role === "ADMIN";

    const togglePermission = (perm) => {
        setPermissions((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
        );
    };

    const loadKeys = async () => {
        try {
            const res = await apiClient.get("/api-keys/my");
            setKeys(res.data?.data || []);
        } catch {
            setError("Failed to load API keys.");
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
        } catch {
            setError("Failed to load API key usage.");
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
            const res = await apiClient.post("/api-keys", {
                name,
                permissions,
            });

            setNewKey(res.data?.data?.key || "");
            setMessage("API key created successfully.");
            setName("");
            setPermissions([]);
            loadKeys();
            loadUsageStats();
        } catch {
            setError("Failed to create API key.");
        }
    };

    const updatePermissions = async (id) => {
        try {
            if (isAdmin) {
                await apiClient.patch(`/admin/api-keys/${id}/permissions`, {
                    permissions,
                });
            } else {
                await apiClient.patch(`/api-keys/${id}/permissions`, {
                    permissions,
                });
            }

            setMessage("Permissions updated successfully.");
            setEditingPermissionsId(null);
            setPermissions([]);
            loadKeys();
            loadUsageStats();
        } catch {
            setError("Failed to update permissions.");
        }
    };

    const revokeKey = async (id) => {
        try {
            if (isAdmin) {
                await apiClient.patch(`/admin/api-keys/${id}/revoke`);
            } else {
                await apiClient.patch(`/api-keys/${id}/revoke`);
            }

            setMessage("API key revoked successfully.");
            loadKeys();
            loadUsageStats();
        } catch {
            setError("Failed to revoke API key.");
        }
    };

    const deleteKey = async (id) => {
        if (!window.confirm("Delete this API key?")) return;

        try {
            await apiClient.delete(`/api-keys/${id}`);
            setMessage("API key deleted successfully.");
            loadKeys();
            loadUsageStats();
        } catch {
            setError("Failed to delete API key.");
        }
    };

    const startPermissionEdit = (item) => {
        setEditingPermissionsId(item.id);
        setPermissions(item.permissions || []);
        setError("");
        setMessage("");
    };

    const cancelPermissionEdit = () => {
        setEditingPermissionsId(null);
        setPermissions([]);
    };

    const copyNewKey = async () => {
        await navigator.clipboard.writeText(newKey);
        setMessage("API key copied to clipboard.");
    };

    if (loading) return <p>Loading API keys...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>API Keys</h2>
                <p>Manage external access keys and scoped permissions.</p>
            </div>

            <form className="auth-form" onSubmit={createKey}>
                <div className="form-group">
                    <label>API Key Name</label>
                    <input
                        placeholder="Example: Dashboard Integration Key"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="permissions-box">
                    {PERMISSIONS.map((perm) => (
                        <label key={perm} className="permission-item">
                            <input
                                type="checkbox"
                                checked={permissions.includes(perm)}
                                onChange={() => togglePermission(perm)}
                            />
                            <span>{perm}</span>
                        </label>
                    ))}
                </div>

                <button className="primary-btn">Create Key</button>
            </form>

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}

            {newKey && (
                <div className="api-key-box">
                    <strong>New API Key — copy now, it may not be shown again:</strong>
                    <div className="key-row">
                        <code>{newKey}</code>
                        <button type="button" className="secondary-btn" onClick={copyNewKey}>
                            Copy
                        </button>
                    </div>
                </div>
            )}

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Key</th>
                    <th>Permissions</th>
                    <th>Status</th>
                    <th>Last Used</th>
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

                            <td>
                                {editingPermissionsId === item.id ? (
                                    <div className="permissions-edit">
                                        {PERMISSIONS.map((perm) => (
                                            <label key={perm} className="permission-item">
                                                <input
                                                    type="checkbox"
                                                    checked={permissions.includes(perm)}
                                                    onChange={() => togglePermission(perm)}
                                                />
                                                <span>{perm}</span>
                                            </label>
                                        ))}

                                        <button
                                            type="button"
                                            className="small-primary-btn"
                                            onClick={() => updatePermissions(item.id)}
                                        >
                                            Save
                                        </button>

                                        <button
                                            type="button"
                                            className="small-danger-btn"
                                            onClick={cancelPermissionEdit}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="permissions-display">
                                        {item.permissions?.length
                                            ? item.permissions.map((perm) => (
                                                <span key={perm} className="permission-badge">
                              {perm}
                            </span>
                                            ))
                                            : "None"}
                                    </div>
                                )}
                            </td>

                            <td>{item.isActive ? "Active" : "Revoked"}</td>

                            <td>
                                {item.lastUsedAt
                                    ? new Date(item.lastUsedAt).toLocaleString()
                                    : "Never"}
                            </td>

                            <td>
                                <div className="action-group">
                                    <button
                                        type="button"
                                        className="small-primary-btn"
                                        onClick={() => startPermissionEdit(item)}
                                    >
                                        Edit Permissions
                                    </button>

                                    {item.isActive && (
                                        <button
                                            type="button"
                                            className="small-danger-btn"
                                            onClick={() => revokeKey(item.id)}
                                        >
                                            Revoke
                                        </button>
                                    )}

                                    <button
                                        type="button"
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
                    <div className="section-header" style={{ marginTop: 40 }}>
                        <h2>API Key Usage</h2>
                        <p>
                            Admin-only monitoring for API key access, endpoints, methods,
                            timestamps, and usage counts.
                        </p>
                    </div>

                    {usageLoading ? (
                        <p>Loading API key usage...</p>
                    ) : (
                        <table className="alumni-table">
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Key</th>
                                <th>Permissions</th>
                                <th>Usage Count</th>
                                <th>Last Used</th>
                                <th>Recent Access Logs</th>
                            </tr>
                            </thead>

                            <tbody>
                            {usageStats.length === 0 ? (
                                <tr>
                                    <td colSpan="6">No API key usage found.</td>
                                </tr>
                            ) : (
                                usageStats.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.user?.email || "N/A"}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            <div className="permissions-display">
                                                {item.permissions?.length
                                                    ? item.permissions.map((perm) => (
                                                        <span key={perm} className="permission-badge">
                                  {perm}
                                </span>
                                                    ))
                                                    : "None"}
                                            </div>
                                        </td>
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