import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const emptyForm = {
    title: "",
    institutionName: "",
    degreeUrl: "",
    completionDate: "",
};

function Degrees() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadItems = async () => {
        try {
            const res = await apiClient.get("/degrees/my");
            setItems(res.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load degrees.");
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

        if (!form.title || !form.institutionName) {
            setError("Degree title and institution name are required.");
            return;
        }

        const payload = {
            title: form.title,
            institutionName: form.institutionName,
            degreeUrl: form.degreeUrl || null,
            completionDate: form.completionDate
                ? new Date(form.completionDate).toISOString()
                : null,
        };

        try {
            if (editingId) {
                await apiClient.patch(`/degrees/${editingId}`, payload);
                setMessage("Degree updated successfully.");
            } else {
                await apiClient.post("/degrees", payload);
                setMessage("Degree added successfully.");
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
            institutionName: item.institutionName || "",
            degreeUrl: item.degreeUrl || "",
            completionDate: item.completionDate
                ? item.completionDate.slice(0, 10)
                : "",
        });
    };

    const deleteItem = async (id) => {
        try {
            await apiClient.delete(`/degrees/${id}`);
            setMessage("Degree deleted successfully.");
            loadItems();
        } catch (err) {
            setError(err.response?.data?.message || "Delete failed.");
        }
    };

    if (loading) return <p>Loading degrees...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>Degrees</h2>
                <p>Manage your academic qualifications and university achievements.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success">{message}</div>}

                <div className="form-group">
                    <label>Degree Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="BEng Software Engineering"
                    />
                </div>

                <div className="form-group">
                    <label>Institution Name</label>
                    <input
                        name="institutionName"
                        value={form.institutionName}
                        onChange={handleChange}
                        placeholder="University of Westminster"
                    />
                </div>

                <div className="form-group">
                    <label>Degree URL</label>
                    <input
                        name="degreeUrl"
                        value={form.degreeUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/degree"
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
                    {editingId ? "Update Degree" : "Add Degree"}
                </button>

                {editingId && (
                    <button type="button" className="secondary-btn" onClick={resetForm}>
                        Cancel Edit
                    </button>
                )}
            </form>

            <div className="section-header" style={{ marginTop: 28 }}>
                <h2>My Degrees</h2>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Institution</th>
                    <th>Completed</th>
                    <th>URL</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan="5">No degrees found.</td>
                    </tr>
                ) : (
                    items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.institutionName}</td>
                            <td>
                                {item.completionDate
                                    ? new Date(item.completionDate).toLocaleDateString()
                                    : "Not provided"}
                            </td>
                            <td>
                                {item.degreeUrl ? (
                                    <a href={item.degreeUrl} target="_blank" rel="noreferrer">
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

export default Degrees;