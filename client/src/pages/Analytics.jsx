import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import apiClient from "../api/apiClient";

const exportToCSV = (filename, rows) => {
    if (!rows || rows.length === 0) return;

    const headers = Object.keys(rows[0]);

    const csv = [
        headers.join(","),
        ...rows.map((row) =>
            headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
        ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
};

function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const res = await apiClient.get("/analytics/my-dashboard");
                setAnalytics(res.data?.data || null);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load analytics.");
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    if (loading) return <p>Loading analytics...</p>;
    if (error) return <div className="auth-error">{error}</div>;
    if (!analytics) return <p>No analytics data available.</p>;

    const profile = analytics.profile || {};
    const bids = analytics.bids || {};
    const notifications = analytics.notifications || {};

    const completeness = Number(profile.completenessPercentage || 0);

    const profileCompletionData = [
        { name: "Completed", value: completeness },
        { name: "Remaining", value: Math.max(100 - completeness, 0) },
    ];

    const profileBreakdownData = [
        { name: "Degrees", count: profile.totalDegrees || 0 },
        { name: "Employment", count: profile.totalEmploymentHistory || 0 },
        { name: "Certifications", count: profile.totalCertifications || 0 },
        { name: "Courses", count: profile.totalCourses || 0 },
        { name: "Licences", count: profile.totalLicences || 0 },
    ];

    const bidStatusData = [
        { name: "Active", value: bids.active || 0 },
        { name: "Won", value: bids.won || 0 },
        { name: "Lost", value: bids.lost || 0 },
        { name: "Cancelled", value: bids.cancelled || 0 },
    ];

    const notificationData = [
        { name: "Read", value: notifications.read || 0 },
        { name: "Unread", value: notifications.unread || 0 },
    ];

    const analyticsExportRows = [
        {
            metric: "Profile Completion",
            value: `${completeness}%`,
        },
        {
            metric: "Degrees",
            value: profile.totalDegrees || 0,
        },
        {
            metric: "Employment Records",
            value: profile.totalEmploymentHistory || 0,
        },
        {
            metric: "Certifications",
            value: profile.totalCertifications || 0,
        },
        {
            metric: "Courses",
            value: profile.totalCourses || 0,
        },
        {
            metric: "Licences",
            value: profile.totalLicences || 0,
        },
        {
            metric: "Total Bids",
            value: bids.total || 0,
        },
        {
            metric: "Active Bids",
            value: bids.active || 0,
        },
        {
            metric: "Won Bids",
            value: bids.won || 0,
        },
        {
            metric: "Lost Bids",
            value: bids.lost || 0,
        },
        {
            metric: "Cancelled Bids",
            value: bids.cancelled || 0,
        },
        {
            metric: "Total Notifications",
            value: notifications.total || 0,
        },
        {
            metric: "Read Notifications",
            value: notifications.read || 0,
        },
        {
            metric: "Unread Notifications",
            value: notifications.unread || 0,
        },
    ];

    const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

    return (
        <div>
            <div className="section-header">
                <h2>Analytics & Intelligence</h2>
                <p>
                    Live analytics generated from alumni profile, bidding, notification,
                    and professional development data.
                </p>

                <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => exportToCSV("analytics-dashboard.csv", analyticsExportRows)}
                >
                    Export Analytics CSV
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div>
                        <p className="stat-title">Profile Completion</p>
                        <h3>{completeness}%</h3>
                        <p className="stat-description">Current profile strength</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <p className="stat-title">Employment Records</p>
                        <h3>{profile.totalEmploymentHistory || 0}</h3>
                        <p className="stat-description">Career history entries</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <p className="stat-title">Professional Learning</p>
                        <h3>
                            {(profile.totalCertifications || 0) + (profile.totalCourses || 0)}
                        </h3>
                        <p className="stat-description">Certifications and courses</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <p className="stat-title">Bid Activity</p>
                        <h3>{bids.total || 0}</h3>
                        <p className="stat-description">Total bidding records</p>
                    </div>
                </div>
            </div>

            <div className="insight-grid" style={{ marginTop: 24 }}>
                <div className={`insight-card ${completeness < 50 ? "critical" : "emerging"}`}>
                    <span>{completeness < 50 ? "Critical Gap" : "Profile Status"}</span>
                    <h3>
                        {completeness < 50
                            ? "Incomplete Alumni Profile"
                            : "Strong Profile Completion"}
                    </h3>
                    <p>
                        {completeness < 50
                            ? "More education, employment, and professional development records are required."
                            : "This profile contains enough information to support meaningful university intelligence."}
                    </p>
                </div>

                <div className="insight-card significant">
                    <span>Professional Development</span>
                    <h3>Learning Activity</h3>
                    <p>
                        {(profile.totalCertifications || 0) + (profile.totalCourses || 0) > 0
                            ? "The alumnus has post-graduation learning records through certifications or courses."
                            : "No post-graduation learning records have been added yet."}
                    </p>
                </div>

                <div
                    className={`insight-card ${
                        (profile.totalEmploymentHistory || 0) > 0 ? "emerging" : "critical"
                    }`}
                >
                    <span>Career Signal</span>
                    <h3>Employment Evidence</h3>
                    <p>
                        {(profile.totalEmploymentHistory || 0) > 0
                            ? "Employment records are available and support career outcome analysis."
                            : "Employment history is missing, limiting career outcome analysis."}
                    </p>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Profile Completion</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={profileCompletionData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={95}
                                label
                            >
                                {profileCompletionData.map((entry, index) => (
                                    <Cell
                                        key={entry.name}
                                        fill={index === 0 ? "#6366f1" : "#e5e7eb"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Profile Data Breakdown</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={profileBreakdownData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Records" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Bid Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={bidStatusData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={95}
                                label
                            >
                                {bidStatusData.map((entry, index) => (
                                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Notification Engagement</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={notificationData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={95}
                                label
                            >
                                {notificationData.map((entry, index) => (
                                    <Cell
                                        key={entry.name}
                                        fill={index === 0 ? "#22c55e" : "#f59e0b"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Analytics;