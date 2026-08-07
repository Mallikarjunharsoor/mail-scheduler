import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "../lib/api";
export default function Scheduled() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api
            .get("/scheduled")
            .then((res) => setEmails(res.data))
            .catch(() => setEmails([]))
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "Scheduled Emails" }), _jsx("p", { className: "text-gray-500 mb-8", children: "Emails waiting in the queue." }), loading ? (_jsx("div", { className: "text-center py-20 text-gray-500", children: "Loading..." })) : emails.length === 0 ? (_jsx("div", { className: "bg-white rounded-xl shadow p-12 text-center text-gray-500", children: "No scheduled emails." })) : (_jsx("div", { className: "bg-white rounded-xl shadow overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-green-600 text-white", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4 text-left", children: "Subject" }), _jsx("th", { className: "p-4 text-left", children: "Recipient" }), _jsx("th", { className: "p-4 text-left", children: "Send Time" }), _jsx("th", { className: "p-4 text-left", children: "Status" })] }) }), _jsx("tbody", { children: emails.map((mail) => (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "p-4", children: mail.subject }), _jsx("td", { className: "p-4", children: mail.recipient || mail.to.join(", ") }), _jsx("td", { className: "p-4", children: new Date(mail.sendAt).toLocaleString() }), _jsx("td", { className: "p-4", children: _jsx("span", { className: "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm", children: mail.status }) })] }, mail.id))) })] }) }))] }));
}
