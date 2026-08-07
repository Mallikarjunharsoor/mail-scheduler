import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Scheduled from "./pages/Scheduled";
import Sent from "./pages/Sent";
import Compose from "./pages/Compose";
import AuthSuccess from "./pages/AuthSuccess";
function ProtectedRoute({ children }) {
    const { user } = useAuth();
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return children;
}
function AppRoutes() {
    const { user, logout } = useAuth();
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/login", replace: true }) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/auth/success", element: _jsx(AuthSuccess, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/login", replace: true }) })] }) }));
    }
    return (_jsxs("div", { className: "flex min-h-screen bg-gray-100", children: [_jsx(Sidebar, { user: user, onLogout: logout }), _jsx("main", { className: "flex-1 p-6 overflow-auto", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/compose", element: _jsx(ProtectedRoute, { children: _jsx(Compose, {}) }) }), _jsx(Route, { path: "/scheduled", element: _jsx(ProtectedRoute, { children: _jsx(Scheduled, {}) }) }), _jsx(Route, { path: "/sent", element: _jsx(ProtectedRoute, { children: _jsx(Sent, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) })] }));
}
function App() {
    return _jsx(AppRoutes, {});
}
export default function AppWrapper() {
    return (_jsx(AuthProvider, { children: _jsx(App, {}) }));
}
