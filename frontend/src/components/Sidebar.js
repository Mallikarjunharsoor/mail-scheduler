import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
export default function Sidebar({ user, onLogout }) {
    return (_jsxs("aside", { className: "w-64 min-h-screen bg-slate-900 text-white flex flex-col", children: [_jsxs("div", { className: "p-6 border-b border-slate-700", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Mail Scheduler" }), _jsxs("div", { className: "mt-5", children: [_jsx("p", { className: "font-semibold", children: user?.name }), _jsx("p", { className: "text-sm text-slate-400", children: user?.email })] })] }), _jsxs("nav", { className: "flex-1 p-4 space-y-2", children: [_jsx(NavLink, { to: "/dashboard", className: ({ isActive }) => `block rounded-lg px-4 py-3 ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"}`, children: "Dashboard" }), _jsx(NavLink, { to: "/compose", className: ({ isActive }) => `block rounded-lg px-4 py-3 ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"}`, children: "Compose" }), _jsx(NavLink, { to: "/scheduled", className: ({ isActive }) => `block rounded-lg px-4 py-3 ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"}`, children: "Scheduled" }), _jsx(NavLink, { to: "/sent", className: ({ isActive }) => `block rounded-lg px-4 py-3 ${isActive
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"}`, children: "Sent" })] }), _jsx("div", { className: "p-4 border-t border-slate-700", children: _jsx("button", { onClick: onLogout, className: "w-full rounded-lg bg-red-500 py-2 hover:bg-red-600", children: "Logout" }) })] }));
}
