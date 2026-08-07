import { useEffect, useState } from "react";
import api from "../lib/api";

interface EmailJob {
  id: string;
  subject: string;
  recipient?: string;
  to: string[];
  sendAt: string;
  status: string;
}

export default function Scheduled() {
  const [emails, setEmails] = useState<EmailJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/scheduled")
      .then((res) => setEmails(res.data))
      .catch(() => setEmails([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-2">
        Scheduled Emails
      </h1>

      <p className="text-gray-500 mb-8">
        Emails waiting in the queue.
      </p>

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading...
        </div>
      ) : emails.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
          No scheduled emails.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-green-600 text-white">

              <tr>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Recipient</th>
                <th className="p-4 text-left">Send Time</th>
                <th className="p-4 text-left">Status</th>
              </tr>

            </thead>

            <tbody>

              {emails.map((mail) => (

                <tr
                  key={mail.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">{mail.subject}</td>

                  <td className="p-4">
                    {mail.recipient || mail.to.join(", ")}
                  </td>

                  <td className="p-4">
                    {new Date(mail.sendAt).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      {mail.status}
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