import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function Admin() {
    const [dashboard, setDashboard] = useState(null);
    const [users, setUsers] = useState([]);
    const [bids, setBids] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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
                setUsers(usersRes.data?.data || []);
                setBids(bidsRes.data?.data || []);
                setNotifications(notificationsRes.data?.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load admin data.");
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, []);

    if (loading) return <p>Loading admin dashboard...</p>;
    if (error) return <div className="auth-error">{error}</div>;

    return (
        <div>
            <div className="section-header">
                <h2>Admin Dashboard</h2>
                <p>System-wide users, bids, notifications, and platform activity.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div>
                        <p className="stat-title">Total Users</p>
                        <h3>{dashboard?.users?.total || users.length}</h3>
                        <p className="stat-description">Registered accounts</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <p className="stat-title">Total Profiles</p>
                        <h3>{dashboard?.profiles?.total || 0}</h3>
                        <p className="stat-description">Alumni profiles</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <p className="stat-title">Total Bids</p>
                        <h3>{dashboard?.bids?.total || bids.length}</h3>
                        <p className="stat-description">Bidding records</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <p className="stat-title">Notifications</p>
                        <h3>{dashboard?.notifications?.total || notifications.length}</h3>
                        <p className="stat-description">System alerts</p>
                    </div>
                </div>
            </div>

            <div className="section-header" style={{ marginTop: 28 }}>
                <h2>Users</h2>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Created</th>
                </tr>
                </thead>

                <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td colSpan="4">No users found.</td>
                    </tr>
                ) : (
                    users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.isVerified ? "Yes" : "No"}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;