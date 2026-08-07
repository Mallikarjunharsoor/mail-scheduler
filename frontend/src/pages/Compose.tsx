import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import CSVUploader from "../components/CSVUploader";

const getDefaultTime = () => {
  const date = new Date(Date.now() + 60000);
  return date.toISOString().slice(0, 16);
};

export default function Compose() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [from, setFrom] = useState(user?.email || "");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sendAt, setSendAt] = useState(getDefaultTime());

  const [delayBetweenSeconds, setDelay] = useState(2);
  const [hourlyLimit, setHourlyLimit] = useState(200);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const recipients = to
    .split(/[\n,;]/)
    .map((x) => x.trim())
    .filter(Boolean);

  function handleCSV(rows: string[][]) {
    const emails = rows
      .flat()
      .filter((email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      );

    setTo(emails.join(", "));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/schedule", {
        from,
        to: recipients,
        subject,
        body,
        sendAt: new Date(sendAt).toISOString(),
        delayBetweenSeconds,
        hourlyLimit,
      });

      setMessage(
        `${res.data.scheduled} email(s) scheduled successfully`
      );

      setTimeout(() => navigate("/scheduled"), 1200);
    } catch (err: any) {
      setMessage(
        err?.response?.data?.error ||
          "Unable to schedule email."
      );
    }

    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        Compose Email
      </h1>

      <form
        onSubmit={submit}
        className="space-y-6"
      >        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-semibold">
              From
            </label>

            <input
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Schedule Time
            </label>

            <input
              type="datetime-local"
              value={sendAt}
              min={getDefaultTime()}
              onChange={(e) => setSendAt(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

        </div>

        <div>

          <label className="block mb-2 font-semibold">
            Recipients
          </label>

          <textarea
            rows={3}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="abc@gmail.com, xyz@gmail.com"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <div className="mt-3">
            <CSVUploader onUpload={handleCSV} />
          </div>

        </div>

        <div>

          <label className="block mb-2 font-semibold">
            Subject
          </label>

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

        </div>

        <div>

          <label className="block mb-2 font-semibold">
            Message
          </label>

          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-semibold">
              Delay Between Emails (Seconds)
            </label>

            <input
              type="number"
              value={delayBetweenSeconds}
              min={0}
              onChange={(e) =>
                setDelay(Number(e.target.value))
              }
              className="w-full border rounded-lg px-4 py-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-semibold">
              Hourly Limit
            </label>

            <input
              type="number"
              value={hourlyLimit}
              min={1}
              onChange={(e) =>
                setHourlyLimit(Number(e.target.value))
              }
              className="w-full border rounded-lg px-4 py-3"
            />

          </div>

        </div>

        <div className="flex justify-between items-center pt-4">

          <div className="text-gray-500">

            {recipients.length} recipient
            {recipients.length !== 1 && "s"}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            {loading ? "Scheduling..." : "Send Later"}
          </button>

        </div>

        {message && (

          <div
            className={`mt-4 rounded-lg p-4 ${
              message.toLowerCase().includes("unable") ||
              message.toLowerCase().includes("error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>

        )}

      </form>

    </div>
  );
}
      