import { useAuthStore } from "../store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  AlertTriangle,
  Layers,
  TrendingUp,
  Circle,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PRIORITY_COLORS = {
  low: "text-green-400",
  medium: "text-amber-400",
  high: "text-orange-400",
  urgent: "text-red-400",
};

const STATUS_CONFIG = {
  todo: { label: "To Do", color: "bg-zinc-500", textColor: "text-zinc-400" },
  "in-progress": { label: "In Progress", color: "bg-indigo-500", textColor: "text-indigo-400" },
  done: { label: "Done", color: "bg-green-500", textColor: "text-green-400" },
};

const StatCard = ({ icon: Icon, label, value, sub, color = "indigo", loading }) => {
  const colorMap = {
    indigo: "bg-indigo-500/15 text-indigo-400",
    green: "bg-green-500/15 text-green-400",
    amber: "bg-amber-500/15 text-amber-400",
    red: "bg-red-500/15 text-red-400",
  };

  return (
    <div className="glass rounded-2xl p-5 hover:border-white/12 transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <TrendingUp className="w-4 h-4 text-zinc-600 group-hover:text-zinc-500 transition-colors" />
      </div>
      {loading ? (
        <div>
          <div className="skeleton h-8 w-16 rounded-lg mb-1" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
      ) : (
        <div>
          <div className="text-3xl font-bold text-white mb-0.5">{value}</div>
          <div className="text-sm text-zinc-500">{label}</div>
          {sub && <div className="text-xs text-zinc-600 mt-1">{sub}</div>}
        </div>
      )}
    </div>
  );
};

const TaskRow = ({ task }) => {
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors group">
      <div className={`w-2 h-2 rounded-full shrink-0 ${status.color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{task.title}</p>
        <p className="text-xs text-zinc-500 mt-0.5 truncate">
          {task.projectId?.title || "Unknown Project"}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {task.dueDate && (
          <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-400" : "text-zinc-500"}`}>
            <Clock className="w-3 h-3" />
            {isOverdue ? "Overdue" : formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
          </span>
        )}
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
          task.priority === "urgent" ? "priority-urgent" :
          task.priority === "high" ? "priority-high" :
          task.priority === "medium" ? "priority-medium" : "priority-low"
        }`}>
          {task.priority || "med"}
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/projects/dashboard/stats");
      return res.data.data;
    },
    staleTime: 30_000,
  });

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "Good morning" :
    greetingHour < 17 ? "Good afternoon" : "Good evening";

  const completionRate = stats
    ? stats.totalTasks > 0 ? Math.round((stats.tasksByStatus.done / stats.totalTasks) * 100) : 0
    : 0;

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {greeting}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-zinc-500 text-sm md:text-base">
          Here's an overview of your team's progress today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Layers}
          label="Total Projects"
          value={isLoading ? "–" : stats?.totalProjects ?? 0}
          color="indigo"
          loading={isLoading}
        />
        <StatCard
          icon={CheckSquare}
          label="Total Tasks"
          value={isLoading ? "–" : stats?.totalTasks ?? 0}
          sub={`${completionRate}% complete`}
          color="green"
          loading={isLoading}
        />
        <StatCard
          icon={Circle}
          label="In Progress"
          value={isLoading ? "–" : stats?.tasksByStatus?.["in-progress"] ?? 0}
          color="amber"
          loading={isLoading}
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value={isLoading ? "–" : stats?.overdueTasks ?? 0}
          color="red"
          loading={isLoading}
        />
      </div>

      {/* Progress + Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Task Status Breakdown */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-zinc-400" />
            Task Breakdown
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-10 rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const count = stats?.tasksByStatus?.[key] ?? 0;
                const total = stats?.totalTasks || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
                        <span className="text-sm text-zinc-400">{cfg.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${cfg.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-white/5">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{completionRate}%</div>
              <div className="text-xs text-zinc-500 mt-0.5">Overall completion rate</div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="lg:col-span-3 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              Recent Tasks
            </h2>
            <Link
              to="/app/projects"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
                  <div className="skeleton w-2 h-2 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3 w-3/4 rounded" />
                    <div className="skeleton h-2.5 w-1/2 rounded" />
                  </div>
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : stats?.recentTasks?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckSquare className="w-10 h-10 text-zinc-700 mb-3" />
              <p className="text-zinc-500 text-sm">No tasks yet</p>
              <p className="text-zinc-600 text-xs mt-1">Create a project and add your first task</p>
            </div>
          ) : (
            <div className="space-y-1">
              {(stats?.recentTasks || []).map((task) => (
                <TaskRow key={task._id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
