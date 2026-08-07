import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface EmailJob {
  id: string;
  subject: string;
  recipient?: string;
  to: string[];
  sendAt: string;
  status: string;
}

export default function Dashboard() {
  const { user } = useAuth();

  const [scheduled, setScheduled] = useState<EmailJob[]>([]);
  const [sent, setSent] = useState<EmailJob[]>([]);
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

  const sentCount = sent.filter(
    (job) => job.status === "sent"
  ).length;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.name}
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your email campaigns
          </p>
        </div>

        <Link
          to="/compose"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          Compose Email
        </Link>

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Scheduled Emails
          </h3>

          <p className="text-4xl font-bold mt-3">
            {scheduled.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Sent Emails
          </h3>

          <p className="text-4xl font-bold mt-3">
            {sentCount}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Failed Emails
          </h3>

          <p className="text-4xl font-bold mt-3 text-red-600">
            {sent.filter((x) => x.status === "failed").length}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow">

        <div className="border-b p-5">
          <h2 className="text-xl font-semibold">
            Recent Scheduled Emails
          </h2>
        </div>

        {loading ? (

          <p className="p-6">
            Loading...
          </p>

        ) : scheduled.length === 0 ? (

          <p className="p-6 text-gray-500">
            No scheduled emails.
          </p>

        ) : (

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  Recipient
                </th>

                <th className="text-left p-4">
                  Subject
                </th>

                <th className="text-left p-4">
                  Send Time
                </th>

                <th className="text-left p-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {scheduled.slice(0, 5).map((job) => (

                <tr
                  key={job.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {job.recipient || job.to[0]}
                  </td>

                  <td className="p-4">
                    {job.subject}
                  </td>

                  <td className="p-4">
                    {new Date(job.sendAt).toLocaleString()}
                  </td>

                  <td className="p-4">

                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">

                      {job.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}