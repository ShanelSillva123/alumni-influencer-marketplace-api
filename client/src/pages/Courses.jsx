import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const emptyForm = {
    title: "",
    providerName: "",
    courseUrl: "",
    completionDate: "",
};

function Courses() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadItems = async () => {
        try {
            const res = await apiClient.get("/courses/my");
            setItems(res.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load courses.");
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
            setError("Title and provider are required.");
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
                await apiClient.patch(`/courses/${editingId}`, payload);
                setMessage("Course updated successfully.");
            } else {
                await apiClient.post("/courses", payload);
                setMessage("Course added successfully.");
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
        if (!window.confirm("Delete this course?")) return;

        try {
            setError("");
            setMessage("");
            await apiClient.delete(`/courses/${id}`);
            setMessage("Course deleted successfully.");
            loadItems();
        } catch (err) {
            setError(err.response?.data?.message || "Delete failed.");
        }
    };

    if (loading) return <p>Loading courses...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>Courses</h2>
                <p>Manage short courses, online learning, and professional development.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success">{message}</div>}

                <div className="form-group">
                    <label>Course Title</label>
                    <input
                        name="title"
                        placeholder="Advanced Node.js"
                        value={form.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Provider</label>
                    <input
                        name="providerName"
                        placeholder="Coursera / Udemy / LinkedIn Learning"
                        value={form.providerName}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Course URL</label>
                    <input
                        name="courseUrl"
                        placeholder="https://example.com/course"
                        value={form.courseUrl}
                        onChange={handleChange}
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
                    {editingId ? "Update Course" : "Add Course"}
                </button>

                {editingId && (
                    <button type="button" className="secondary-btn" onClick={resetForm}>
                        Cancel Edit
                    </button>
                )}
            </form>

            <div className="section-header" style={{ marginTop: 28 }}>
                <h2>My Courses</h2>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Course Title</th>
                    <th>Provider</th>
                    <th>URL</th>
                    <th>Completion Date</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan="5">No courses found.</td>
                    </tr>
                ) : (
                    items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.providerName}</td>
                            <td>
                                {item.courseUrl ? (
                                    <a href={item.courseUrl} target="_blank" rel="noreferrer">
                                        View Course
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </td>
                            <td>
                                {item.completionDate
                                    ? new Date(item.completionDate).toLocaleDateString()
                                    : "N/A"}
                            </td>
                            <td>
                                <div className="action-group">
                                    <button
                                        type="button"
                                        className="small-primary-btn"
                                        onClick={() => startEdit(item)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
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

export default Courses;