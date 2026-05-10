import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { api } from "../../lib/axios";
import {
  LayoutDashboard,
  CheckSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/app", exact: true },
  { icon: CheckSquare, label: "Projects", to: "/app/projects" },
];

const SidebarItem = ({ icon: Icon, label, to, active, onClick }) => (
  <Link to={to} onClick={onClick}>
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
        active
          ? "bg-indigo-500/15 text-indigo-300"
          : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
      }`}
    >
      <Icon
        className={`w-4 h-4 shrink-0 ${active ? "text-indigo-400" : "group-hover:text-zinc-300"}`}
      />
      <span className="text-sm font-medium">{label}</span>
      {active && <ChevronRight className="w-3 h-3 ml-auto text-indigo-400/60" />}
    </div>
  </Link>
);

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {}
    localStorage.removeItem("token");
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/95 border-r border-white/6">
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
            <CheckSquare className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">TeamPilot</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-white lg:hidden p-1 rounded-md hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.to}
            {...item}
            active={isActive(item)}
            onClick={onClose}
          />
        ))}

        <div className="pt-4 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-3 mb-2">
            Quick Actions
          </p>
          <Link to="/app/projects" onClick={onClose}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-dashed border-white/8 text-zinc-500 hover:border-white/15 hover:text-zinc-300 transition-all duration-150 cursor-pointer">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="text-sm">New Project</span>
            </div>
          </Link>
        </div>
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-white/6 shrink-0">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Get page title
  const getTitle = () => {
    const path = location.pathname;
    if (path === "/app") return "Dashboard";
    if (path.startsWith("/app/projects")) return "Projects";
    if (path.startsWith("/app/project/")) return "Board";
    return "Dashboard";
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-white/6 flex items-center justify-between px-4 md:px-6 bg-zinc-950/80 backdrop-blur-xl shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-white">{getTitle()}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            </button>
            {/* Avatar (mobile) */}
            <div className="lg:hidden">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  {useAuthStore.getState().user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
