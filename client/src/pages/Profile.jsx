import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const emptyProfile = {
    fullName: "",
    currentJobTitle: "",
    currentCompany: "",
    biography: "",
    linkedInUrl: "",
    profileImageUrl: "",
};

function Profile() {
    const [profile, setProfile] = useState(emptyProfile);
    const [profileExists, setProfileExists] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadProfile = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get("/profiles/me");

            setProfile(res.data?.data || emptyProfile);
            setProfileExists(true);
        } catch (err) {
            const message = err.response?.data?.message;

            if (message === "Profile not found") {
                setProfile(emptyProfile);
                setProfileExists(false);
            } else {
                setError(message || "Failed to load profile.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const buildPayload = () => ({
        fullName: profile.fullName,
        currentJobTitle: profile.currentJobTitle || null,
        currentCompany: profile.currentCompany || null,
        biography: profile.biography || null,
        linkedInUrl: profile.linkedInUrl || null,
        profileImageUrl: profile.profileImageUrl || null,
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!profile.fullName?.trim()) {
            setError("Full name is required to create a profile.");
            return;
        }

        try {
            setSaving(true);
            await apiClient.post("/profiles", buildPayload());
            setSuccess("Profile created successfully.");
            await loadProfile();
        } catch (err) {
            setError(err.response?.data?.message || "Create failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!profile.fullName?.trim()) {
            setError("Full name is required.");
            return;
        }

        try {
            setSaving(true);
            await apiClient.patch("/profiles", buildPayload());
            setSuccess("Profile updated successfully.");
            await loadProfile();
        } catch (err) {
            setError(err.response?.data?.message || "Update failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = profileExists ? handleUpdate : handleCreate;

    if (loading) return <p>Loading profile...</p>;

    return (
        <div>
            <div className="section-header">
                <h2>My Profile</h2>
                <p>
                    {profileExists
                        ? "Update your professional alumni profile."
                        : "Create your professional alumni profile to unlock analytics visibility."}
                </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                        id="fullName"
                        name="fullName"
                        value={profile.fullName || ""}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="currentJobTitle">Job Title</label>
                    <input
                        id="currentJobTitle"
                        name="currentJobTitle"
                        value={profile.currentJobTitle || ""}
                        onChange={handleChange}
                        placeholder="Software Engineer"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="currentCompany">Company</label>
                    <input
                        id="currentCompany"
                        name="currentCompany"
                        value={profile.currentCompany || ""}
                        onChange={handleChange}
                        placeholder="Example Company"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="linkedInUrl">LinkedIn URL</label>
                    <input
                        id="linkedInUrl"
                        name="linkedInUrl"
                        value={profile.linkedInUrl || ""}
                        onChange={handleChange}
                        placeholder="https://www.linkedin.com/in/example"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profileImageUrl">Profile Image URL</label>
                    <input
                        id="profileImageUrl"
                        name="profileImageUrl"
                        value={profile.profileImageUrl || ""}
                        onChange={handleChange}
                        placeholder="https://example.com/profile.jpg"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="biography">Biography</label>
                    <input
                        id="biography"
                        name="biography"
                        value={profile.biography || ""}
                        onChange={handleChange}
                        placeholder="Short professional summary"
                    />
                </div>

                <button className="primary-btn" disabled={saving}>
                    {saving
                        ? profileExists
                            ? "Updating..."
                            : "Creating..."
                        : profileExists
                            ? "Update Profile"
                            : "Create Profile"}
                </button>
            </form>
        </div>
    );
}

export default Profile;