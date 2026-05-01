import { useEffect, useMemo, useState } from "react";
import { getAllProfiles } from "../api/alumniApi";

function Alumni() {
    const [profiles, setProfiles] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        company: "",
        jobTitle: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfiles = async () => {
            try {
                const res = await getAllProfiles();
                setProfiles(res.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load alumni.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProfiles();
    }, []);

    const filteredProfiles = useMemo(() => {
        return profiles.filter((profile) => {
            const search = filters.search.toLowerCase();

            const matchesSearch =
                !search ||
                profile.fullName?.toLowerCase().includes(search) ||
                profile.currentCompany?.toLowerCase().includes(search) ||
                profile.currentJobTitle?.toLowerCase().includes(search);

            const matchesCompany =
                !filters.company || profile.currentCompany === filters.company;

            const matchesJobTitle =
                !filters.jobTitle || profile.currentJobTitle === filters.jobTitle;

            return matchesSearch && matchesCompany && matchesJobTitle;
        });
    }, [profiles, filters]);

    const companies = [
        ...new Set(profiles.map((profile) => profile.currentCompany).filter(Boolean)),
    ];

    const jobTitles = [
        ...new Set(profiles.map((profile) => profile.currentJobTitle).filter(Boolean)),
    ];

    if (loading) {
        return <p>Loading alumni...</p>;
    }

    if (error) {
        return <div className="auth-error">{error}</div>;
    }

    return (
        <div>
            <div className="section-header">
                <h2>Alumni Directory</h2>
                <p>Search and filter alumni profiles using live backend data.</p>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search name, company, or job title"
                    value={filters.search}
                    onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                    }
                />

                <select
                    value={filters.company}
                    onChange={(e) =>
                        setFilters({ ...filters, company: e.target.value })
                    }
                >
                    <option value="">All Companies</option>
                    {companies.map((company) => (
                        <option key={company} value={company}>
                            {company}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.jobTitle}
                    onChange={(e) =>
                        setFilters({ ...filters, jobTitle: e.target.value })
                    }
                >
                    <option value="">All Job Titles</option>
                    {jobTitles.map((jobTitle) => (
                        <option key={jobTitle} value={jobTitle}>
                            {jobTitle}
                        </option>
                    ))}
                </select>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Current Role</th>
                    <th>Company</th>
                    <th>Profile Score</th>
                </tr>
                </thead>

                <tbody>
                {filteredProfiles.length === 0 ? (
                    <tr>
                        <td colSpan="4">No alumni found.</td>
                    </tr>
                ) : (
                    filteredProfiles.map((profile) => (
                        <tr key={profile.id}>
                            <td>{profile.fullName}</td>
                            <td>{profile.currentJobTitle || "Not provided"}</td>
                            <td>{profile.currentCompany || "Not provided"}</td>
                            <td>{profile.profileCompletenessScore || 0}%</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Alumni;