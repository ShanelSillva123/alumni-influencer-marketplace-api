import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const emptyForm = {
    companyName: "",
    jobTitle: "",
    employmentType: "FULL_TIME",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
};

const employmentTypes = [
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERNSHIP",
    "FREELANCE",
    "TEMPORARY",
    "VOLUNTEER",
    "OTHER",
];

function Employment() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadItems = async () => {
        try {
            const res = await apiClient.get("/employment/my");
            setItems(res.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load employment history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            ...(name === "isCurrent" && checked ? { endDate: "" } : {}),
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!form.companyName || !form.jobTitle || !form.startDate) {
            setError("Company name, job title, and start date are required.");
            return;
        }

        if (!form.isCurrent && form.endDate && form.endDate < form.startDate) {
            setError("End date cannot be before start date.");
            return;
        }

        const payload = {
            companyName: form.companyName,
            jobTitle: form.jobTitle,
            employmentType: form.employmentType,
            location: form.location || null,
            startDate: form.startDate,
            endDate: form.isCurrent ? null : form.endDate || null,
            isCurrent: form.isCurrent,
            description: form.description || null,
        };

        try {
            setSaving(true);

            if (editingId) {
                await apiClient.patch(`/employment/${editingId}`, payload);
                setMessage("Employment record updated successfully.");
            } else {
                await apiClient.post("/employment", payload);
                setMessage("Employment record added successfully.");
            }

            resetForm();
            loadItems();
        } catch (err) {
            setError(err.response?.data?.message || "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);

        setForm({
            companyName: item.companyName || "",
            jobTitle: item.jobTitle || "",
            employmentType: item.employmentType || "FULL_TIME",
            location: item.location || "",
            startDate: item.startDate ? item.startDate.slice(0, 10) : "",
            endDate: item.endDate ? item.endDate.slice(0, 10) : "",
            isCurrent: Boolean(item.isCurrent),
            description: item.description || "",
        });
    };

    const deleteItem = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this employment record?"
        );

        if (!confirmed) return;

        try {
            await apiClient.delete(`/employment/${id}`);
            setMessage("Employment record deleted successfully.");
            loadItems();
        } catch (err) {
            setError(err.response?.data?.message || "Delete failed.");
        }
    };

    if (loading) return <p>Loading employment history...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>Employment History</h2>
                <p>
                    Add and manage your professional work experience to strengthen your
                    alumni profile.
                </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success">{message}</div>}

                <div className="form-group">
                    <label>Company Name</label>
                    <input
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Example Company"
                    />
                </div>

                <div className="form-group">
                    <label>Job Title</label>
                    <input
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={handleChange}
                        placeholder="Software Engineer"
                    />
                </div>

                <div className="form-group">
                    <label>Employment Type</label>
                    <select
                        name="employmentType"
                        value={form.employmentType}
                        onChange={handleChange}
                    >
                        {employmentTypes.map((type) => (
                            <option key={type} value={type}>
                                {type.replaceAll("_", " ")}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="London"
                    />
                </div>

                <div className="form-group">
                    <label>Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        disabled={form.isCurrent}
                    />
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="isCurrent"
                            checked={form.isCurrent}
                            onChange={handleChange}
                        />{" "}
                        I currently work here
                    </label>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Briefly describe your role, responsibilities, and achievements."
                        rows="4"
                    />
                </div>

                <button className="primary-btn" disabled={saving}>
                    {saving
                        ? "Saving..."
                        : editingId
                            ? "Update Employment"
                            : "Add Employment"}
                </button>

                {editingId && (
                    <button type="button" className="secondary-btn" onClick={resetForm}>
                        Cancel Edit
                    </button>
                )}
            </form>

            <div className="section-header" style={{ marginTop: 28 }}>
                <h2>My Employment History</h2>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Company</th>
                    <th>Job Title</th>
                    <th>Type</th>
                    <th>Period</th>
                    <th>Location</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan="6">No employment records found.</td>
                    </tr>
                ) : (
                    items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.companyName}</td>
                            <td>{item.jobTitle}</td>
                            <td>{item.employmentType?.replaceAll("_", " ")}</td>
                            <td>
                                {item.startDate
                                    ? new Date(item.startDate).toLocaleDateString()
                                    : "N/A"}{" "}
                                -{" "}
                                {item.isCurrent
                                    ? "Present"
                                    : item.endDate
                                        ? new Date(item.endDate).toLocaleDateString()
                                        : "N/A"}
                            </td>
                            <td>{item.location || "N/A"}</td>
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

export default Employment;