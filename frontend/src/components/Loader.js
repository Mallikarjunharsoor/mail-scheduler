import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx("div", { style: {
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f5f5f5",
        }, children: _jsxs("div", { style: {
                width: 420,
                background: "white",
                padding: 30,
                borderRadius: 15,
                boxShadow: "0 5px 15px rgba(0,0,0,.15)",
            }, children: [_jsx("h1", { style: {
                        textAlign: "center",
                        marginBottom: 10,
                    }, children: "Mail Scheduler" }), _jsx("p", { style: {
                        textAlign: "center",
                        marginBottom: 25,
                        color: "#666",
                    }, children: isLogin
                        ? "Login to continue"
                        : "Create your account" }), _jsxs("form", { onSubmit: handleSubmit, children: [!isLogin && (_jsxs(_Fragment, { children: [_jsx("label", { children: "Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, style: {
                                        width: "100%",
                                        padding: 12,
                                        marginBottom: 15,
                                    } })] })), _jsx("label", { children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, style: {
                                width: "100%",
                                padding: 12,
                                marginBottom: 15,
                            } }), _jsx("label", { children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, style: {
                                width: "100%",
                                padding: 12,
                                marginBottom: 20,
                            } }), _jsx("button", { type: "submit", disabled: loading, style: {
                                width: "100%",
                                padding: 12,
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                            }, children: loading
                                ? "Please Wait..."
                                : isLogin
                                    ? "Login"
                                    : "Register" })] }), _jsx("div", { style: {
                        marginTop: 20,
                        marginBottom: 20,
                        textAlign: "center",
                    }, children: "OR" }), _jsx("a", { href: googleUrl, style: {
                        display: "block",
                        textAlign: "center",
                        padding: 12,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        textDecoration: "none",
                        color: "#111",
                    }, children: "Continue with Google" }), error && (_jsx("p", { style: {
                        color: "red",
                        marginTop: 20,
                    }, children: error })), _jsxs("p", { style: {
                        marginTop: 20,
                        textAlign: "center",
                    }, children: [isLogin
                            ? "Don't have an account?"
                            : "Already have an account?", _jsx("button", { onClick: () => setIsLogin(!isLogin), style: {
                                marginLeft: 8,
                                background: "none",
                                border: "none",
                                color: "#2563eb",
                                cursor: "pointer",
                            }, children: isLogin ? "Register" : "Login" })] })] }) }));
}
