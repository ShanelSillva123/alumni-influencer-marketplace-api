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
            setError("Failed to load courses.");
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
                setMessage("Course updated.");
            } else {
                await apiClient.post("/courses", payload);
                setMessage("Course added.");
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
            title: item.title,
            providerName: item.providerName,
            courseUrl: item.courseUrl || "",
            completionDate: item.completionDate
                ? item.completionDate.slice(0, 10)
                : "",
        });
    };

    const deleteItem = async (id) => {
        await apiClient.delete(`/courses/${id}`);
        loadItems();
    };

    if (loading) return <p>Loading courses...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>Courses</h2>
                <p>Short courses and online learning.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success">{message}</div>}

                <div className="form-group">
                    <input name="title" placeholder="Course title" value={form.title} onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <input name="providerName" placeholder="Provider" value={form.providerName} onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <input name="courseUrl" placeholder="URL" value={form.courseUrl} onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <input type="date" name="completionDate" value={form.completionDate} onChange={handleChange}/>
                </div>

                <button className="primary-btn">
                    {editingId ? "Update" : "Add"}
                </button>
            </form>

            <table className="alumni-table">
                <tbody>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.providerName}</td>
                        <td>
                            <button onClick={() => startEdit(item)}>Edit</button>
                            <button onClick={() => deleteItem(item.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Courses;