import { ChevronRight, Newspaper, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router";
import { cn } from "../../../lib/utils";
import { CurrentUserAvatar } from "../../../components/current-user-avatar";
import { useCurrentUserName } from "../../../hooks/use-current-user-name";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const username = useCurrentUserName();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-primary/90 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold line-clamp-1">Author Dashboard</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-primary"
          >
            <ChevronRight
              className={cn(
                "transition-transform",
                sidebarOpen && "rotate-180",
              )}
            />
          </button>
        </div>

        <nav className="flex-1 mt-6">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-4 hover:bg-primary transition-colors"
              >
                <Newspaper />
                {sidebarOpen && <span className="ml-3">My Blogs</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/new-blog"
                className="flex items-center p-4 hover:bg-primary transition-colors"
              >
                <Plus />
                {sidebarOpen && <span className="ml-3">New Blog</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* User info at bottom */}
        <div className="p-4 border-t border-foreground/15">
          <div className="flex items-center">
            <CurrentUserAvatar />
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">{username}</p>
                <p className="text-xs text-background/75">author@example.com</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button className="mt-3 w-full text-left text-sm hover:bg-primary p-2 rounded-lg flex items-center">
              <Settings />
              <span className="ml-2">Settings</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Dashboard Overview
            </h2>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
