import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function Bids() {
    const [bids, setBids] = useState([]);
    const [amount, setAmount] = useState("");
    const [showActiveOnly, setShowActiveOnly] = useState(false);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadBids = async () => {
        try {
            setError("");
            const endpoint = showActiveOnly ? "/bids/my/active" : "/bids/my";
            const res = await apiClient.get(endpoint);
            setBids(res.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load bids.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadBids();
    }, [showActiveOnly]);

    const createBid = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const bidAmount = Number(amount);

        if (!amount || bidAmount <= 0) {
            setError("Please enter a valid bid amount.");
            return;
        }

        try {
            setSubmitting(true);
            await apiClient.post("/bids", { amount: bidAmount });
            setAmount("");
            setMessage("Bid placed successfully. It will remain pending until winner selection runs.");
            loadBids();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to place bid.");
        } finally {
            setSubmitting(false);
        }
    };

    const deactivateBid = async (id) => {
        if (!window.confirm("Deactivate this bid?")) return;

        try {
            setError("");
            setMessage("");
            await apiClient.patch(`/bids/${id}/deactivate`);
            setMessage("Bid deactivated successfully.");
            loadBids();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to deactivate bid.");
        }
    };

    if (loading) return <p>Loading bids...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>Bidding</h2>
                <p>
                    Place blind bids for featured alumni visibility. New bids remain pending
                    until the scheduled winner selection job runs.
                </p>
            </div>

            <form className="inline-form" onSubmit={createBid}>
                <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter bid amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <button className="primary-btn" disabled={submitting}>
                    {submitting ? "Placing..." : "Place Bid"}
                </button>
            </form>

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}

            <div className="bid-filter-bar">
                <button
                    type="button"
                    className={!showActiveOnly ? "small-primary-btn" : "secondary-btn"}
                    onClick={() => setShowActiveOnly(false)}
                >
                    All Bids
                </button>

                <button
                    type="button"
                    className={showActiveOnly ? "small-primary-btn" : "secondary-btn"}
                    onClick={() => setShowActiveOnly(true)}
                >
                    Active Only
                </button>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Active</th>
                    <th>Date</th>
                    <th>Action</th>
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
                            <td>
                                {bid.isActive ? (
                                    <button
                                        className="small-danger-btn"
                                        onClick={() => deactivateBid(bid.id)}
                                    >
                                        Deactivate
                                    </button>
                                ) : (
                                    <span className="muted-text">Inactive</span>
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

export default Bids;