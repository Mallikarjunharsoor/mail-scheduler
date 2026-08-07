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
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: 420,
          background: "white",
          padding: 30,
          borderRadius: 15,
          boxShadow: "0 5px 15px rgba(0,0,0,.15)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Mail Scheduler
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: 25,
            color: "#666",
          }}
        >
          {isLogin
            ? "Login to continue"
            : "Create your account"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label>Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                style={{
                  width: "100%",
                  padding: 12,
                  marginBottom: 15,
                }}
              />
            </>
          )}

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15,
            }}
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 20,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {loading
              ? "Please Wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        <div
          style={{
            marginTop: 20,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          OR
        </div>

        <a
          href={googleUrl}
          style={{
            display: "block",
            textAlign: "center",
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            textDecoration: "none",
            color: "#111",
          }}
        >
          Continue with Google
        </a>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: 20,
            }}
          >
            {error}
          </p>
        )}

        <p
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={() =>
              setIsLogin(!isLogin)
            }
            style={{
              marginLeft: 8,
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}