import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
export default function Dashboard() {
    const { user } = useAuth();
    const [scheduled, setScheduled] = useState([]);
    const [sent, setSent] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            api.get("/scheduled"),
            api.get("/sent"),
        ])
            .then(([scheduledRes, sentRes]) => {
            setScheduled(scheduledRes.data);
            setSent(sentRes.data);
        })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const sentCount = sent.filter((job) => job.status === "sent").length;
    return (_jsxs("div", { className: "p-8 bg-gray-100 min-h-screen", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold", children: ["Welcome, ", user?.name] }), _jsx("p", { className: "text-gray-500 mt-2", children: "Manage your email campaigns" })] }), _jsx(Link, { to: "/compose", className: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg", children: "Compose Email" })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-xl shadow p-6", children: [_jsx("h3", { className: "text-gray-500", children: "Scheduled Emails" }), _jsx("p", { className: "text-4xl font-bold mt-3", children: scheduled.length })] }), _jsxs("div", { className: "bg-white rounded-xl shadow p-6", children: [_jsx("h3", { className: "text-gray-500", children: "Sent Emails" }), _jsx("p", { className: "text-4xl font-bold mt-3", children: sentCount })] }), _jsxs("div", { className: "bg-white rounded-xl shadow p-6", children: [_jsx("h3", { className: "text-gray-500", children: "Failed Emails" }), _jsx("p", { className: "text-4xl font-bold mt-3 text-red-600", children: sent.filter((x) => x.status === "failed").length })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow", children: [_jsx("div", { className: "border-b p-5", children: _jsx("h2", { className: "text-xl font-semibold", children: "Recent Scheduled Emails" }) }), loading ? (_jsx("p", { className: "p-6", children: "Loading..." })) : scheduled.length === 0 ? (_jsx("p", { className: "p-6 text-gray-500", children: "No scheduled emails." })) : (_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-4", children: "Recipient" }), _jsx("th", { className: "text-left p-4", children: "Subject" }), _jsx("th", { className: "text-left p-4", children: "Send Time" }), _jsx("th", { className: "text-left p-4", children: "Status" })] }) }), _jsx("tbody", { children: scheduled.slice(0, 5).map((job) => (_jsxs("tr", { className: "border-t", children: [_jsx("td", { className: "p-4", children: job.recipient || job.to[0] }), _jsx("td", { className: "p-4", children: job.subject }), _jsx("td", { className: "p-4", children: new Date(job.sendAt).toLocaleString() }), _jsx("td", { className: "p-4", children: _jsx("span", { className: "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm", children: job.status }) })] }, job.id))) })] }))] })] }));
}
