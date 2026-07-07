import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import type { UserRole } from "@/domain/models";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Clock,
  Menu,
  X,
  ChevronDown,
  Bot,
  UserCog,
  Layers,
  CalendarDays,
  Shield,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/staff", label: "Staff", icon: UserCog },
  { to: "/services", label: "Services", icon: Layers },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/time", label: "Time Log", icon: Clock },
  { to: "/ai", label: "AI Assistant", icon: Bot },
];

const roleLabels: Record<UserRole, string> = {
  partner: "Partner",
  manager: "Manager",
  staff: "Staff",
  trainee: "Trainee",
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAppSelector((state) => state.auth);

  const adminNavItems = isAdmin ? [{ to: "/users", label: "User Management", icon: Shield }] : [];

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  function renderNav(items: typeof navItems) {
    return items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={() => setSidebarOpen(false)}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )
        }
      >
        <item.icon className="h-4 w-4" />
        {item.label}
      </NavLink>
    ));
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">CJ</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Chauhan & Jain</p>
            <p className="text-xs text-muted-foreground">Practice Manager</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {renderNav(navItems)}
          {adminNavItems.length > 0 && (
            <>
              <div className="my-2 border-t" />
              {renderNav(adminNavItems)}
            </>
          )}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-64 bg-card shadow-xl">
            <div className="flex h-16 items-center justify-between border-b px-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">CJ</span>
                </div>
                <p className="text-sm font-semibold">Chauhan & Jain</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1 p-4">
              {renderNav(navItems)}
              {adminNavItems.length > 0 && (
                <>
                  <div className="my-2 border-t" />
                  {renderNav(adminNavItems)}
                </>
              )}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xs font-medium text-primary">
                  {currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">
                  {roleLabels[currentUser.role]} · {currentUser.office}
                  {isAdmin && " · Admin"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {profileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border bg-card p-1 shadow-lg">
                  <button
                    onClick={() => { navigate("/profile"); setProfileMenuOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => { navigate("/users"); setProfileMenuOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Shield className="h-4 w-4" />
                      User Management
                    </button>
                  )}
                  <div className="my-1 border-t" />
                  <button
                    onClick={() => { handleLogout(); setProfileMenuOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
