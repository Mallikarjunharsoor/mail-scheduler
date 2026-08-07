import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [googleUrl, setGoogleUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        api
            .get("/auth/google/url")
            .then((res) => setGoogleUrl(res.data.url))
            .catch(() => { });
    }, []);
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (isLogin) {
                const res = await api.post("/auth/login", {
                    email,
                    password,
                });
                login(res.data.token);
                navigate("/dashboard");
            }
            else {
                await api.post("/auth/register", {
                    name,
                    email,
                    password,
                });
                alert("Registration Successful");
                setIsLogin(true);
            }
        }
        catch (err) {
            setError(err?.response?.data?.error ||
                "Something went wrong.");
        }
        setLoading(false);
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-100 p-4", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-xl p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-center mb-2", children: "Mail Scheduler" }), _jsx("p", { className: "text-center text-gray-500 mb-8", children: isLogin ? "Login to continue" : "Create your account" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [!isLogin && (_jsx("input", { className: "w-full border rounded-lg p-3", placeholder: "Full Name", value: name, onChange: (e) => setName(e.target.value), required: true })), _jsx("input", { className: "w-full border rounded-lg p-3", type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("input", { className: "w-full border rounded-lg p-3", type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("button", { className: "w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3", disabled: loading, children: loading
                                ? "Please wait..."
                                : isLogin
                                    ? "Login"
                                    : "Register" })] }), _jsx("div", { className: "my-6 text-center text-gray-400", children: "OR" }), _jsx("a", { href: googleUrl, className: "block text-center border rounded-lg p-3 hover:bg-gray-100", children: "Continue with Google" }), error && (_jsx("p", { className: "text-red-500 mt-5 text-center", children: error })), _jsxs("p", { className: "text-center mt-6", children: [isLogin
                            ? "Don't have an account?"
                            : "Already have an account?", _jsx("button", { onClick: () => setIsLogin(!isLogin), className: "text-blue-600 ml-2", children: isLogin ? "Register" : "Login" })] })] }) }));
}
