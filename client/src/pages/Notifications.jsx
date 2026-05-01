import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function Notifications() {
    const [items, setItems] = useState([]);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadNotifications = async () => {
        try {
            const endpoint = showUnreadOnly
                ? "/notifications/my/unread"
                : "/notifications/my";

            const res = await apiClient.get(endpoint);
            setItems(res.data?.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load notifications."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadNotifications();
    }, [showUnreadOnly]);

    const markAsRead = async (id) => {
        try {
            await apiClient.patch(`/notifications/${id}/read`);
            setMessage("Notification marked as read.");
            loadNotifications();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update.");
        }
    };

    const markAllAsRead = async () => {
        try {
            await apiClient.patch("/notifications/read-all");
            setMessage("All notifications marked as read.");
            loadNotifications();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update.");
        }
    };

    if (loading) return <p>Loading notifications...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>Notifications</h2>
                <p>Manage your alerts and updates.</p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}

            <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
                <button
                    className={!showUnreadOnly ? "primary-btn" : "secondary-btn"}
                    onClick={() => setShowUnreadOnly(false)}
                >
                    All
                </button>

                <button
                    className={showUnreadOnly ? "primary-btn" : "secondary-btn"}
                    onClick={() => setShowUnreadOnly(true)}
                >
                    Unread Only
                </button>

                <button className="small-primary-btn" onClick={markAllAsRead}>
                    Mark All as Read
                </button>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan="6">No notifications found.</td>
                    </tr>
                ) : (
                    items.map((item) => (
                        <tr
                            key={item.id}
                            style={{
                                background: item.isRead ? "white" : "#f9fafb",
                                fontWeight: item.isRead ? "normal" : "600",
                            }}
                        >
                            <td>{item.title}</td>
                            <td>{item.message}</td>
                            <td>{item.type}</td>
                            <td>{item.isRead ? "Read" : "Unread"}</td>
                            <td>
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </td>
                            <td>
                                {!item.isRead && (
                                    <button
                                        className="small-primary-btn"
                                        onClick={() => markAsRead(item.id)}
                                    >
                                        Mark Read
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Notifications;