import { ChevronRight, Newspaper, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router";
import { cn } from "../../../lib/utils";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
            <div className="h-10 w-10 rounded-full bg-foreground/25 flex items-center justify-center">
              <span className="text-white">AU</span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">Author User</p>
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
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center">
                <span className="text-stone-700 text-sm">AU</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
