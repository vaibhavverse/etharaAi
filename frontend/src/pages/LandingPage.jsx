import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  CheckSquare, Zap, Users, BarChart3, ArrowRight,
  Star, Shield, Clock, Layers
} from "lucide-react";

const features = [
  { icon: Layers, title: "Kanban Boards", desc: "Drag-and-drop task management with real-time updates across your entire team." },
  { icon: Users, title: "Team Collaboration", desc: "Invite members, assign tasks, and track progress together in one place." },
  { icon: BarChart3, title: "Insightful Dashboard", desc: "See task distribution, overdue items, and completion rates at a glance." },
  { icon: Shield, title: "Role-Based Access", desc: "Admins manage projects, members focus on their tasks — clear boundaries." },
];

const stats = [
  { value: "10k+", label: "Teams using TeamPilot" },
  { value: "500k+", label: "Tasks completed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 200ms", label: "API response time" },
];

const MotionLink = motion(Link);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-black/70 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">TeamPilot</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white text-sm h-9">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm h-9 px-5 rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative">
        <div className="flex flex-col items-center justify-center text-center pt-24 pb-20 px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-8"
          >
            <Zap className="w-3.5 h-3.5" />
            Built for high-performing teams
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50">
              Ship faster,<br />together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            TeamPilot is the task management platform built for teams who want
            clarity, speed, and beautiful design — all in one tool.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/register">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-500 text-white w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-xl shadow-xl shadow-indigo-500/25 transition-all duration-200 group"
              >
                Start for free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-xl bg-transparent"
              >
                Sign in
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="max-w-6xl mx-auto px-6 mb-24"
        >
          <div className="rounded-2xl border border-white/8 bg-zinc-950/80 backdrop-blur overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.1)]">
            {/* Browser chrome */}
            <div className="h-10 bg-zinc-900/80 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="ml-4 flex-1 max-w-xs">
                <div className="h-5 bg-white/5 rounded-full text-xs text-zinc-600 flex items-center px-3">
                  app.teampilot.com
                </div>
              </div>
            </div>

            {/* Fake dashboard UI */}
            <div className="flex h-[420px] md:h-[520px]">
              {/* Sidebar */}
              <div className="w-52 border-r border-white/5 p-4 hidden sm:flex flex-col gap-2">
                <div className="h-6 w-20 skeleton mb-4 opacity-60" />
                {["Dashboard", "Projects", "My Tasks"].map((item, i) => (
                  <div key={item} className={`h-8 rounded-md flex items-center px-3 gap-2 ${i === 0 ? "bg-indigo-500/15" : ""}`}>
                    <div className="w-3 h-3 rounded skeleton opacity-40" />
                    <div className={`h-3 rounded skeleton opacity-40`} style={{ width: `${40 + i * 15}px` }} />
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="h-7 w-48 skeleton opacity-50 mb-6 rounded-lg" />
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[["Projects", "8", "indigo"], ["In Progress", "14", "amber"], ["Done", "67", "green"]].map(([label, val, color]) => (
                    <div key={label} className="bg-white/3 rounded-xl p-4 border border-white/5">
                      <div className="text-xs text-zinc-500 mb-1">{label}</div>
                      <div className={`text-2xl font-bold text-${color}-400`}>{val}</div>
                    </div>
                  ))}
                </div>
                {/* Kanban preview */}
                <div className="grid grid-cols-3 gap-3">
                  {["Todo", "In Progress", "Done"].map((col, ci) => (
                    <div key={col} className="bg-white/2 rounded-xl border border-white/5 p-3">
                      <div className="text-xs font-semibold text-zinc-500 mb-3 flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${ci === 0 ? "bg-zinc-500" : ci === 1 ? "bg-indigo-500" : "bg-green-500"}`} />
                        {col}
                      </div>
                      {[0, 1].slice(0, ci === 1 ? 2 : 1).map((i) => (
                        <div key={i} className="bg-white/4 rounded-lg p-2.5 mb-2 border border-white/5">
                          <div className="h-2.5 rounded skeleton opacity-40 mb-2 w-full" />
                          <div className="h-2 rounded skeleton opacity-30 w-2/3" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="border-y border-white/5 bg-white/2 py-12 mb-24">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-sm text-zinc-500">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything your team needs</h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Powerful features that don't get in the way. Built to feel effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="group glass rounded-2xl p-7 hover:border-indigo-500/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-lg">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto px-6 pb-32 text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                Join thousands of teams already using TeamPilot to ship faster and work smarter.
              </p>
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 px-10 text-base font-semibold rounded-xl shadow-xl shadow-indigo-500/25"
                >
                  Create your free account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-500 rounded-md flex items-center justify-center">
                <CheckSquare className="w-3 h-3 text-white" />
              </div>
              <span>TeamPilot © 2026</span>
            </div>
            <div className="flex gap-6">
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
