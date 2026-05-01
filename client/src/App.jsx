import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Alumni from "./pages/Alumni";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import Bids from "./pages/Bids";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import AdminRoute from "./routes/AdminRoute";
import ApiKeys from "./pages/ApiKeys";
import Certifications from "./pages/Certifications";
import Courses from "./pages/Courses";
import Employment from "./pages/Employment";
import Degrees from "./pages/Degrees";
import Licences from "./pages/Licences";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <Router>
            <Routes>

                {/* Public Route */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="alumni" element={<Alumni />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="bids" element={<Bids />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="api-keys" element={<ApiKeys />} />
                    <Route path="certifications" element={<Certifications />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="/employment" element={<Employment />} />
                    <Route path="/degrees" element={<Degrees />} />
                    <Route path="/licences" element={<Licences />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route
                        path="admin"
                        element={
                            <AdminRoute>
                                <Admin />
                            </AdminRoute>
                        }
                    />
                </Route>

            </Routes>
        </Router>
    );
}

export default App;