import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const emptyForm = {
    name: "",
    issuingOrganization: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    credentialUrl: "",
};

function Licences() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadItems = async () => {
        try {
            const res = await apiClient.get("/licences/my");
            setItems(res.data?.data || []);
        } catch (err) {
            setError("Failed to load licences.");
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

        if (!form.name || !form.issuingOrganization) {
            setError("Name and issuing organization are required.");
            return;
        }

        const payload = {
            ...form,
            issueDate: form.issueDate
                ? new Date(form.issueDate).toISOString()
                : null,
            expirationDate: form.expirationDate
                ? new Date(form.expirationDate).toISOString()
                : null,
        };

        try {
            if (editingId) {
                await apiClient.patch(`/licences/${editingId}`, payload);
                setMessage("Licence updated.");
            } else {
                await apiClient.post("/licences", payload);
                setMessage("Licence added.");
            }

            resetForm();
            loadItems();
        } catch {
            setError("Save failed.");
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setForm({
            name: item.name || "",
            issuingOrganization: item.issuingOrganization || "",
            issueDate: item.issueDate?.slice(0, 10) || "",
            expirationDate: item.expirationDate?.slice(0, 10) || "",
            credentialId: item.credentialId || "",
            credentialUrl: item.credentialUrl || "",
        });
    };

    const deleteItem = async (id) => {
        await apiClient.delete(`/licences/${id}`);
        loadItems();
    };

    if (loading) return <p>Loading licences...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>Licences & Certifications</h2>
                <p>Showcase your professional licences and certifications.</p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Licence Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="AWS Certified Developer"
                    />
                </div>

                <div className="form-group">
                    <label>Issuing Organization</label>
                    <input
                        name="issuingOrganization"
                        value={form.issuingOrganization}
                        onChange={handleChange}
                        placeholder="Amazon"
                    />
                </div>

                <div className="form-group">
                    <label>Issue Date</label>
                    <input
                        type="date"
                        name="issueDate"
                        value={form.issueDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Expiration Date</label>
                    <input
                        type="date"
                        name="expirationDate"
                        value={form.expirationDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Credential ID</label>
                    <input
                        name="credentialId"
                        value={form.credentialId}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Credential URL</label>
                    <input
                        name="credentialUrl"
                        value={form.credentialUrl}
                        onChange={handleChange}
                    />
                </div>

                <button className="primary-btn">
                    {editingId ? "Update Licence" : "Add Licence"}
                </button>

                {editingId && (
                    <button type="button" className="secondary-btn" onClick={resetForm}>
                        Cancel Edit
                    </button>
                )}
            </form>

            <div className="section-header" style={{ marginTop: 24 }}>
                <h2>My Licences</h2>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Issued</th>
                    <th>Expires</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan="5">No licences found.</td>
                    </tr>
                ) : (
                    items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.issuingOrganization}</td>
                            <td>
                                {item.issueDate
                                    ? new Date(item.issueDate).toLocaleDateString()
                                    : "N/A"}
                            </td>
                            <td>
                                {item.expirationDate
                                    ? new Date(item.expirationDate).toLocaleDateString()
                                    : "N/A"}
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

export default Licences;