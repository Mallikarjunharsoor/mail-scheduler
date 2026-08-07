import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "../lib/api";
import Loader from "../components/Loader";
export default function Sent() {
    const [sent, setSent] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadSent();
    }, []);
    async function loadSent() {
        try {
            const res = await api.get("/sent");
            setSent(res.data);
        }
        catch {
            setSent([]);
        }
        finally {
            setLoading(false);
        }
    }
    if (loading)
        return _jsx(Loader, {});
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Sent Emails" }), _jsx("p", { className: "text-gray-500", children: "Review delivered campaigns and failures." })] }), _jsx("button", { onClick: loadSent, className: "bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg", children: "Refresh" })] }), sent.length === 0 ? (_jsx("div", { className: "bg-white rounded-xl shadow p-10 text-center text-gray-500", children: "No sent emails available." })) : (_jsx("div", { className: "bg-white rounded-xl shadow overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-4", children: "Subject" }), _jsx("th", { className: "text-left p-4", children: "Recipients" }), _jsx("th", { className: "text-left p-4", children: "Updated" }), _jsx("th", { className: "text-left p-4", children: "Status" })] }) }), _jsx("tbody", { children: sent.map((job) => (_jsxs("tr", { className: "border-t", children: [_jsx("td", { className: "p-4", children: job.subject }), _jsx("td", { className: "p-4", children: job.to.join(", ") }), _jsx("td", { className: "p-4", children: new Date(job.updatedAt).toLocaleString() }), _jsx("td", { className: "p-4", children: _jsx("span", { className: `px-3 py-1 rounded-full text-white text-sm ${job.status === "sent"
                                                ? "bg-green-500"
                                                : "bg-red-500"}`, children: job.status }) })] }, job.id))) })] }) }))] }));
}
