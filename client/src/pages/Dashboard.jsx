import { useEffect, useState } from "react";
import { Briefcase, GraduationCap, KeyRound, Star, Users } from "lucide-react";
import { getMyDashboardAnalytics } from "../api/analyticsApi";


function Dashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [alumniOfDay, setAlumniOfDay] = useState(null);

    const [loading, setLoading] = useState(true);
    const [alumniLoading, setAlumniLoading] = useState(true);

    const [error, setError] = useState("");
    const [alumniOfDayError, setAlumniOfDayError] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const res = await getMyDashboardAnalytics();
                setAnalytics(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        const loadAlumniOfTheDay = async () => {
            try {
                const apiKey = import.meta.env.VITE_ALUMNI_OF_DAY_API_KEY;

                if (!apiKey) {
                    throw new Error("Alumni of the Day API key is not configured.");
                }

                const res = await fetch("http://localhost:5000/api/public/alumni-of-day", {
                    headers: {
                        "x-api-key": apiKey,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to load Alumni of the Day.");
                }

                setAlumniOfDay(data.data);
            } catch (err) {
                setAlumniOfDayError(err.message);
            } finally {
                setAlumniLoading(false);
            }
        };

        loadAnalytics();
        loadAlumniOfTheDay();
    }, []);

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return <div className="auth-error">{error}</div>;
    }

    const stats = [
        {
            title: "Profile Completeness",
            value: `${analytics?.profile?.completenessPercentage || 0}%`,
            description: "Current profile completion score",
            icon: Users,
        },
        {
            title: "Total Bids",
            value: analytics?.bids?.total || 0,
            description: "Total bidding activity",
            icon: Briefcase,
        },
        {
            title: "Certifications",
            value: analytics?.profile?.totalCertifications || 0,
            description: "Professional credentials tracked",
            icon: GraduationCap,
        },
        {
            title: "Unread Notifications",
            value: analytics?.notifications?.unread || 0,
            description: "Pending user alerts",
            icon: KeyRound,
        },
    ];

    const featuredProfile = alumniOfDay?.user?.profile;

    return (
        <div>
            <div className="section-header">
                <h2>Dashboard Overview</h2>
                <p>Live platform metrics from your backend API.</p>
            </div>

            <div className="stat-card" style={{ marginBottom: 24 }}>
                <div className="stat-icon">
                    <Star size={22} />
                </div>

                <div>
                    <p className="stat-title">Alumni of the Day</p>

                    {alumniLoading ? (
                        <p className="stat-description">Loading featured alumnus...</p>
                    ) : alumniOfDayError ? (
                        <p className="stat-description">{alumniOfDayError}</p>
                    ) : featuredProfile ? (
                        <>
                            <h3>{featuredProfile.fullName}</h3>
                            <p className="stat-description">
                                {featuredProfile.currentJobTitle || "Role not provided"} at{" "}
                                {featuredProfile.currentCompany || "Company not provided"}
                            </p>
                            <p className="stat-description">
                                Winning bid: £{Number(alumniOfDay?.bid?.amount || 0).toFixed(2)}
                            </p>
                        </>
                    ) : (
                        <p className="stat-description">No featured alumnus selected today.</p>
                    )}
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div className="stat-card" key={item.title}>
                            <div className="stat-icon">
                                <Icon size={22} />
                            </div>

                            <div>
                                <p className="stat-title">{item.title}</p>
                                <h3>{item.value}</h3>
                                <p className="stat-description">{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Dashboard;