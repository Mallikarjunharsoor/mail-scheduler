import { useEffect, useState } from "react";
import api from "../lib/api";
import Loader from "../components/Loader";

interface EmailJob {
  id: string;
  subject: string;
  to: string[];
  updatedAt: string;
  status: string;
}

export default function Sent() {
  const [sent, setSent] = useState<EmailJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSent();
  }, []);

  async function loadSent() {
    try {
      const res = await api.get("/sent");
      setSent(res.data);
    } catch {
      setSent([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sent Emails</h1>
          <p className="text-gray-500">
            Review delivered campaigns and failures.
          </p>
        </div>

        <button
          onClick={loadSent}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>

      {sent.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          No sent emails available.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Subject</th>
                <th className="text-left p-4">Recipients</th>
                <th className="text-left p-4">Updated</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {sent.map((job) => (
                <tr key={job.id} className="border-t">
                  <td className="p-4">{job.subject}</td>

                  <td className="p-4">
                    {job.to.join(", ")}
                  </td>

                  <td className="p-4">
                    {new Date(job.updatedAt).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        job.status === "sent"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}