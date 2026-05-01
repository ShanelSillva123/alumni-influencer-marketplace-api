import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const emptyForm = {
    title: "",
    providerName: "",
    courseUrl: "",
    completionDate: "",
};

function Certifications() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadItems = async () => {
        try {
            const res = await apiClient.get("/certifications/my");
            setItems(res.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load certifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!form.title || !form.providerName) {
            setError("Title and provider name are required.");
            return;
        }

        const payload = {
            title: form.title,
            providerName: form.providerName,
            courseUrl: form.courseUrl || null,
            completionDate: form.completionDate
                ? new Date(form.completionDate).toISOString()
                : null,
        };

        try {
            if (editingId) {
                await apiClient.patch(`/certifications/${editingId}`, payload);
                setMessage("Certification updated successfully.");
            } else {
                await apiClient.post("/certifications", payload);
                setMessage("Certification added successfully.");
            }

            resetForm();
            loadItems();
        } catch (err) {
            setError(err.response?.data?.message || "Save failed.");
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setForm({
            title: item.title || "",
            providerName: item.providerName || "",
            courseUrl: item.courseUrl || "",
            completionDate: item.completionDate
                ? item.completionDate.slice(0, 10)
                : "",
        });
    };

    const deleteItem = async (id) => {
        try {
            await apiClient.delete(`/certifications/${id}`);
            setMessage("Certification deleted successfully.");
            loadItems();
        } catch (err) {
            setError(err.response?.data?.message || "Delete failed.");
        }
    };

    if (loading) return <p>Loading certifications...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>Certifications</h2>
                <p>Manage professional certifications completed after graduation.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success">{message}</div>}

                <div className="form-group">
                    <label>Certification Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="AWS Cloud Practitioner"
                    />
                </div>

                <div className="form-group">
                    <label>Provider Name</label>
                    <input
                        name="providerName"
                        value={form.providerName}
                        onChange={handleChange}
                        placeholder="Amazon Web Services"
                    />
                </div>

                <div className="form-group">
                    <label>Course URL</label>
                    <input
                        name="courseUrl"
                        value={form.courseUrl}
                        onChange={handleChange}
                        placeholder="https://example.com"
                    />
                </div>

                <div className="form-group">
                    <label>Completion Date</label>
                    <input
                        type="date"
                        name="completionDate"
                        value={form.completionDate}
                        onChange={handleChange}
                    />
                </div>

                <button className="primary-btn">
                    {editingId ? "Update Certification" : "Add Certification"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={resetForm}
                    >
                        Cancel Edit
                    </button>
                )}
            </form>

            <div className="section-header" style={{ marginTop: 28 }}>
                <h2>My Certifications</h2>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Provider</th>
                    <th>Completed</th>
                    <th>URL</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan="5">No certifications found.</td>
                    </tr>
                ) : (
                    items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.providerName}</td>
                            <td>
                                {item.completionDate
                                    ? new Date(item.completionDate).toLocaleDateString()
                                    : "Not provided"}
                            </td>
                            <td>
                                {item.courseUrl ? (
                                    <a href={item.courseUrl} target="_blank">
                                        View
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </td>
                            <td>
                                <div className="action-group">
                                    <button
                                        className="small-primary-btn"
                                        onClick={() => startEdit(item)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="small-danger-btn"
                                        onClick={() => deleteItem(item.id)}
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

export default Certifications;