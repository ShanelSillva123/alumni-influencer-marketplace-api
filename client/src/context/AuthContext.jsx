import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user on app start
    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await getCurrentUser();
                setUser(res.data);
            } catch (error) {
                console.error("Auth error:", error);
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login
    const login = async (credentials) => {
        const res = await loginUser(credentials);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setUser(res.data.user);
    };

    // Logout
    const logout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout error:", err);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook
export const useAuth = () => useContext(AuthContext);