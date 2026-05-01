import { useEffect, useState } from "react";
import { Briefcase, GraduationCap, KeyRound, Users } from "lucide-react";
import { getMyDashboardAnalytics } from "../api/analyticsApi";

function Dashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const res = await getMyDashboardAnalytics();
                setAnalytics(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load dashboard data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
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

    return (
        <div>
            <div className="section-header">
                <h2>Dashboard Overview</h2>
                <p>Live platform metrics from your backend API.</p>
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