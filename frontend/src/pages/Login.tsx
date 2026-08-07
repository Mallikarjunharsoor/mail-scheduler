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
      .then((res) => {
        console.log("Google URL:", res.data.url);
        setGoogleUrl(res.data.url)
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
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
      } else {
        await api.post("/auth/register", {
          name,
          email,
          password,
        });

        alert("Registration Successful");

        setIsLogin(true);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Something went wrong."
      );
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Mail Scheduler
        </h1>

        <p className="text-center text-gray-500 mb-8">
          {isLogin ? "Login to continue" : "Create your account"}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {!isLogin && (
            <input
              className="w-full border rounded-lg p-3"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          )}

          <input
            className="w-full border rounded-lg p-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            className="w-full border rounded-lg p-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>

        </form>

        <div className="my-6 text-center text-gray-400">
          OR
        </div>

        <a
          href={googleUrl}
          className="block text-center border rounded-lg p-3 hover:bg-gray-100"
        >
          Continue with Google
        </a>

        {error && (
          <p className="text-red-500 mt-5 text-center">
            {error}
          </p>
        )}

        <p className="text-center mt-6">

          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={() =>
              setIsLogin(!isLogin)
            }
            className="text-blue-600 ml-2"
          >
            {isLogin ? "Register" : "Login"}
          </button>

        </p>

      </div>
    </div>
  );
}