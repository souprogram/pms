import { ChevronRight, Newspaper, Plus } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { CurrentUserAvatar } from "../../../components/current-user-avatar";
import { useCurrentUser } from "../../../hooks/use-current-user";
import { cn } from "../../../lib/utils";

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = useCurrentUser();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const title = {
    "/dashboard": "Moje novosti",
    "/dashboard/new-blog": "Dodaj novost",
    "/dashboard/profile": "Moj profil",
  } as { [key: string]: string };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          sidebarOpen ? "w-72" : "w-16",
          "bg-stone-100 transition-all duration-300 ease-in-out flex flex-col",
        )}
      >
        <div
          className={cn(
            "p-4 flex items-center justify-between transition h-17.25",
            !sidebarOpen && "px-2",
          )}
        >
          {sidebarOpen && (
            <h1 className="text-lg font-bold line-clamp-1">PMS Dashboard</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-foreground/10"
          >
            <ChevronRight
              className={cn(
                "transition-transform",
                sidebarOpen && "rotate-180",
              )}
            />
          </button>
        </div>

        <nav className="flex-1 p-2 border-t border-foreground/15">
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <Link
                to="/dashboard"
                className={cn(
                  "flex items-center p-2 hover:bg-foreground/10 transition-colors rounded-lg ",
                  location.pathname === "/dashboard" && "bg-foreground/10",
                )}
              >
                <Newspaper size="20" />
                {sidebarOpen && <span className="ml-3">Moje novosti</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/new-blog"
                className={cn(
                  "flex items-center p-2 hover:bg-foreground/10 transition-colors rounded-lg ",
                  location.pathname === "/dashboard/new-blog" &&
                    "bg-foreground/10",
                )}
              >
                <Plus size="20" />
                {sidebarOpen && <span className="ml-3">Dodaj novost</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* User info at bottom */}
        <div className="p-2 border-t border-foreground/15">
          <Link
            to="/dashboard/profile"
            className={cn(
              "flex items-center p-2 hover:bg-foreground/10 transition-colors rounded-lg",
              location.pathname === "/dashboard/profile" && "bg-foreground/10",
            )}
          >
            <CurrentUserAvatar />
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.profile.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.user.email ?? ""}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="bg-stone-100 p-2 pl-0 w-full">
        <div className="flex-1 flex flex-col overflow-hidden border border-foreground/15 rounded-lg h-full">
          {/* Header */}
          <header className="bg-white border-b z-10">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {title[location.pathname] ?? "Dashboard"}
              </h2>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-white">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
