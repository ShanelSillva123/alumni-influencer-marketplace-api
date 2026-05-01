import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const exportToCSV = (filename, rows) => {
    if (!rows || rows.length === 0) return;

    const cleanedRows = rows.map((row) => {
        const cleanRow = {};

        Object.keys(row).forEach((key) => {
            if (typeof row[key] === "object" && row[key] !== null) {
                cleanRow[key] = JSON.stringify(row[key]);
            } else {
                cleanRow[key] = row[key];
            }
        });

        return cleanRow;
    });

    const headers = Object.keys(cleanedRows[0]);

    const csv = [
        headers.join(","),
        ...cleanedRows.map((row) =>
            headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
        ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
};

function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [users, setUsers] = useState([]);
    const [bids, setBids] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAdminData = async () => {
        try {
            const [dashboardRes, usersRes, bidsRes, notificationsRes] =
                await Promise.all([
                    apiClient.get("/admin/dashboard"),
                    apiClient.get("/admin/users"),
                    apiClient.get("/admin/bids"),
                    apiClient.get("/admin/notifications"),
                ]);

            setDashboard(dashboardRes.data?.data || null);
            setUsers(dashboardRes.data?.data?.usersList || usersRes.data?.data || []);
            setBids(bidsRes.data?.data || []);
            setNotifications(notificationsRes.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load admin dashboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const userExportRows = users.map((user) => ({
        email: user.email,
        role: user.role,
        verified: user.isVerified ? "Yes" : "No",
        lastLogin: user.lastLoginAt
            ? new Date(user.lastLoginAt).toLocaleString()
            : "Never",
        createdAt: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A",
    }));

    const bidExportRows = bids.map((bid) => ({
        user: bid.user?.email || bid.userId || "N/A",
        amount: bid.amount,
        status: bid.status,
        active: bid.isActive ? "Yes" : "No",
        createdAt: bid.createdAt
            ? new Date(bid.createdAt).toLocaleDateString()
            : "N/A",
    }));

    const notificationExportRows = notifications.map((notification) => ({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.isRead ? "Yes" : "No",
        createdAt: notification.createdAt
            ? new Date(notification.createdAt).toLocaleDateString()
            : "N/A",
    }));

    if (loading) return <p>Loading admin dashboard...</p>;

    if (error) return <div className="auth-error">{error}</div>;

    return (
        <div>
            <div className="section-header">
                <h2>Admin Dashboard</h2>
                <p>Monitor users, bids, notifications, and platform activity.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div>
                        <p className="stat-title">Total Users</p>
                        <h3>{dashboard?.users?.total ?? users.length}</h3>
                        <p className="stat-description">Registered platform users</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <p className="stat-title">Total Profiles</p>
                        <h3>{dashboard?.profiles?.total ?? 0}</h3>
                        <p className="stat-description">Alumni profile records</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <p className="stat-title">Total Bids</p>
                        <h3>{dashboard?.bids?.total ?? bids.length}</h3>
                        <p className="stat-description">Blind bidding records</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <p className="stat-title">Notifications</p>
                        <h3>{dashboard?.notifications?.total ?? notifications.length}</h3>
                        <p className="stat-description">System notification records</p>
                    </div>
                </div>
            </div>

            <div className="section-header" style={{ marginTop: 28 }}>
                <h2>Users</h2>

                <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => exportToCSV("admin-users.csv", userExportRows)}
                >
                    Export Users CSV
                </button>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Last Login</th>
                    <th>Created</th>
                </tr>
                </thead>

                <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td colSpan="5">No users found.</td>
                    </tr>
                ) : (
                    users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.isVerified ? "Yes" : "No"}</td>
                            <td>
                                {user.lastLoginAt
                                    ? new Date(user.lastLoginAt).toLocaleString()
                                    : "Never"}
                            </td>
                            <td>
                                {user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            <div className="section-header" style={{ marginTop: 28 }}>
                <h2>Recent Bids</h2>

                <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => exportToCSV("admin-bids.csv", bidExportRows)}
                >
                    Export Bids CSV
                </button>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Active</th>
                    <th>Date</th>
                </tr>
                </thead>

                <tbody>
                {bids.length === 0 ? (
                    <tr>
                        <td colSpan="5">No bids found.</td>
                    </tr>
                ) : (
                    bids.map((bid) => (
                        <tr key={bid.id}>
                            <td>{bid.user?.email || bid.userId || "N/A"}</td>
                            <td>£{Number(bid.amount).toFixed(2)}</td>
                            <td>
                  <span className={`status-badge ${bid.status?.toLowerCase()}`}>
                    {bid.status}
                  </span>
                            </td>
                            <td>{bid.isActive ? "Yes" : "No"}</td>
                            <td>
                                {bid.createdAt
                                    ? new Date(bid.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            <div className="section-header" style={{ marginTop: 28 }}>
                <h2>Recent Notifications</h2>

                <button
                    className="secondary-btn"
                    type="button"
                    onClick={() =>
                        exportToCSV("admin-notifications.csv", notificationExportRows)
                    }
                >
                    Export Notifications CSV
                </button>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Type</th>
                    <th>Read</th>
                    <th>Date</th>
                </tr>
                </thead>

                <tbody>
                {notifications.length === 0 ? (
                    <tr>
                        <td colSpan="5">No notifications found.</td>
                    </tr>
                ) : (
                    notifications.map((notification) => (
                        <tr key={notification.id}>
                            <td>{notification.title}</td>
                            <td>{notification.message}</td>
                            <td>{notification.type}</td>
                            <td>{notification.isRead ? "Yes" : "No"}</td>
                            <td>
                                {notification.createdAt
                                    ? new Date(notification.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;