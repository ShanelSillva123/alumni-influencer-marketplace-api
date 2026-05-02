import { useEffect, useMemo, useState } from "react";
import { getAllProfiles } from "../api/alumniApi";

const getPrimaryDegree = (profile) => {
    return profile.degrees?.[0] || null;
};

const getGraduationYear = (profile) => {
    const degree = getPrimaryDegree(profile);
    if (!degree?.completionDate) return "";
    return new Date(degree.completionDate).getFullYear().toString();
};

const getProgramme = (profile) => {
    const degree = getPrimaryDegree(profile);
    return degree?.title || "";
};

const getIndustrySector = (profile) => {
    return profile.currentCompany || profile.currentJobTitle || "";
};

function Alumni() {
    const [profiles, setProfiles] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        programme: "",
        graduationYear: "",
        industrySector: "",
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
            } finally {
                setLoading(false);
            }
        };

        loadProfiles();
    }, []);

    const programmes = useMemo(() => {
        return [...new Set(profiles.map(getProgramme).filter(Boolean))];
    }, [profiles]);

    const graduationYears = useMemo(() => {
        return [...new Set(profiles.map(getGraduationYear).filter(Boolean))].sort(
            (a, b) => b - a
        );
    }, [profiles]);

    const industrySectors = useMemo(() => {
        return [...new Set(profiles.map(getIndustrySector).filter(Boolean))];
    }, [profiles]);

    const filteredProfiles = useMemo(() => {
        return profiles.filter((profile) => {
            const search = filters.search.toLowerCase();

            const programme = getProgramme(profile);
            const graduationYear = getGraduationYear(profile);
            const industrySector = getIndustrySector(profile);

            const matchesSearch =
                !search ||
                profile.fullName?.toLowerCase().includes(search) ||
                profile.currentCompany?.toLowerCase().includes(search) ||
                profile.currentJobTitle?.toLowerCase().includes(search) ||
                programme.toLowerCase().includes(search);

            const matchesProgramme =
                !filters.programme || programme === filters.programme;

            const matchesGraduationYear =
                !filters.graduationYear || graduationYear === filters.graduationYear;

            const matchesIndustrySector =
                !filters.industrySector || industrySector === filters.industrySector;

            return (
                matchesSearch &&
                matchesProgramme &&
                matchesGraduationYear &&
                matchesIndustrySector
            );
        });
    }, [profiles, filters]);

    if (loading) return <p>Loading alumni...</p>;
    if (error) return <div className="auth-error">{error}</div>;

    return (
        <div>
            <div className="section-header">
                <h2>Alumni Directory</h2>
                <p>
                    Search and filter alumni by programme, graduation year, and industry
                    sector using live backend data.
                </p>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search name, company, role, or programme"
                    value={filters.search}
                    onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                    }
                />

                <select
                    value={filters.programme}
                    onChange={(e) =>
                        setFilters({ ...filters, programme: e.target.value })
                    }
                >
                    <option value="">All Programmes</option>
                    {programmes.map((programme) => (
                        <option key={programme} value={programme}>
                            {programme}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.graduationYear}
                    onChange={(e) =>
                        setFilters({ ...filters, graduationYear: e.target.value })
                    }
                >
                    <option value="">All Graduation Years</option>
                    {graduationYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.industrySector}
                    onChange={(e) =>
                        setFilters({ ...filters, industrySector: e.target.value })
                    }
                >
                    <option value="">All Industry Sectors</option>
                    {industrySectors.map((sector) => (
                        <option key={sector} value={sector}>
                            {sector}
                        </option>
                    ))}
                </select>
            </div>

            <table className="alumni-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Programme</th>
                    <th>Graduation Year</th>
                    <th>Current Role</th>
                    <th>Industry / Company</th>
                    <th>Profile Score</th>
                </tr>
                </thead>

                <tbody>
                {filteredProfiles.length === 0 ? (
                    <tr>
                        <td colSpan="6">No alumni found.</td>
                    </tr>
                ) : (
                    filteredProfiles.map((profile) => {
                        const programme = getProgramme(profile);
                        const graduationYear = getGraduationYear(profile);
                        const industrySector = getIndustrySector(profile);

                        return (
                            <tr key={profile.id}>
                                <td>{profile.fullName}</td>
                                <td>{programme || "Not provided"}</td>
                                <td>{graduationYear || "Not provided"}</td>
                                <td>{profile.currentJobTitle || "Not provided"}</td>
                                <td>{industrySector || "Not provided"}</td>
                                <td>{profile.profileCompletenessScore || 0}%</td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Alumni;