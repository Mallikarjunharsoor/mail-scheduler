import { NavLink } from "react-router-dom";
import { AuthUser } from "../lib/auth";

interface Props {
  user: AuthUser | null;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: Props) {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">Mail Scheduler</h1>

        <div className="mt-5">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/compose"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`
          }
        >
          Compose
        </NavLink>

        <NavLink
          to="/scheduled"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`
          }
        >
          Scheduled
        </NavLink>

        <NavLink
          to="/sent"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`
          }
        >
          Sent
        </NavLink>

      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full rounded-lg bg-red-500 py-2 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}