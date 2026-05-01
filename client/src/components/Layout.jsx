import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Award,
    BarChart3,
    Bell,
    BookOpen,
    BriefcaseBusiness,
    CreditCard,
    GraduationCap,
    IdCard,
    KeyRound,
    LayoutDashboard,
    LogOut,
    Shield,
    UserCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await apiClient.get("/profiles/me");
                setProfile(res.data?.data || null);
            } catch (err) {
                setProfile(null);
            }
        };

        loadProfile();
    }, []);

    const navItems = [
        { path: "/", label: "Dashboard", icon: LayoutDashboard },
        { path: "/analytics", label: "Analytics", icon: BarChart3 },
        { path: "/alumni", label: "Alumni", icon: GraduationCap },
        { path: "/profile", label: "My Profile", icon: UserCircle },

        { path: "/degrees", label: "Degrees.jsx", icon: GraduationCap },
        { path: "/employment", label: "Employment", icon: BriefcaseBusiness },
        { path: "/certifications", label: "Certifications", icon: Award },
        { path: "/courses", label: "Courses", icon: BookOpen },
        { path: "/licences", label: "Licences", icon: IdCard },

        { path: "/bids", label: "Bids", icon: CreditCard },
        { path: "/notifications", label: "Notifications", icon: Bell },
        { path: "/api-keys", label: "API Keys", icon: KeyRound },
        { path: "/admin", label: "Admin", icon: Shield },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-icon">AI</div>
                    <div>
                        <h2>Alumni Intel</h2>
                        <p>University Dashboard</p>
                    </div>
                </div>

                <nav className="nav-list">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            <main className="main-content">
                <header className="topbar dashboard-topbar">
                    <div>
                        <h1>University Analytics Dashboard</h1>
                        <p>Graduate outcomes, skills gaps, and alumni intelligence.</p>
                    </div>

                    <div className="user-menu">
                        <div className="user-avatar">
                            {profile?.profileImageUrl ? (
                                <img
                                    src={profile.profileImageUrl}
                                    alt="Profile"
                                    className="avatar-img"
                                />
                            ) : (
                                <UserCircle size={28} />
                            )}
                        </div>

                        <div className="user-details">
                            <strong>{profile?.fullName || user?.email || "Logged in user"}</strong>
                            <span>{user?.role || "USER"}</span>
                        </div>

                        <button className="logout-btn" onClick={handleLogout}>
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </header>

                <section className="page-content">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}

export default Layout;