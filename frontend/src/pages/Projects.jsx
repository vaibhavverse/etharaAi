import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../lib/axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter,
} from "../components/ui/dialog";
import { toast } from "sonner";
import {
  Plus, Layers, Users, ArrowRight, FolderOpen,
  MoreHorizontal, Trash2, UserPlus, X,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "from-indigo-600/20 to-violet-600/20",
  "from-blue-600/20 to-cyan-600/20",
  "from-emerald-600/20 to-teal-600/20",
  "from-orange-600/20 to-rose-600/20",
  "from-pink-600/20 to-fuchsia-600/20",
  "from-amber-600/20 to-yellow-600/20",
];

const getProjectColor = (id) => COLORS[parseInt(id?.slice(-1), 16) % COLORS.length];

const ProjectCard = ({ project, userId, onDelete }) => {
  const userRole = project.members?.find(m => (m.user?._id || m.user) === userId)?.role;
  const isAdmin = userRole === "admin" || project.ownerId?._id === userId || project.ownerId === userId;
  const memberCount = project.members?.length || 0;
  const gradient = getProjectColor(project._id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="group"
    >
      <div className="glass rounded-2xl overflow-hidden hover:border-white/12 transition-all duration-200 h-full flex flex-col">
        {/* Card gradient header */}
        <div className={`h-2 bg-gradient-to-r ${gradient}`} />

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/8 to-white/4 border border-white/8 flex items-center justify-center">
              <Layers className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isAdmin && (
                <button
                  onClick={(e) => { e.preventDefault(); onDelete(project._id); }}
                  className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <Link to={`/app/project/${project._id}`} className="flex-1 flex flex-col">
            <h3 className="font-semibold text-white mb-1.5 group-hover:text-indigo-200 transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-zinc-500 line-clamp-2 flex-1 leading-relaxed">
              {project.description || "No description provided."}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Users className="w-3.5 h-3.5" />
                <span>{memberCount + 1} member{memberCount !== 0 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isAdmin && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                    Admin
                  </span>
                )}
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data.data;
    },
  });

  const createProject = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/projects", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["dashboard-stats"]);
      setCreateOpen(false);
      setTitle("");
      setDescription("");
      toast.success("Project created 🎉");
    },
    onError: (err) => toast.error(err.message || "Failed to create project"),
  });

  const deleteProject = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["dashboard-stats"]);
      toast.success("Project deleted");
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete this project? This action cannot be undone.")) {
      deleteProject.mutate(id);
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Projects</h1>
          <p className="text-zinc-500 text-sm">
            {isLoading ? "Loading..." : `${projects?.length || 0} project${projects?.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-5 shadow-lg shadow-indigo-500/20 text-sm font-semibold transition-all">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-white/10 text-white rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Create new project</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createProject.mutate({ title, description }); }}>
              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Project name</label>
                  <Input
                    placeholder="e.g. Marketing Website Redesign"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-10 rounded-xl focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">
                    Description <span className="text-zinc-600">(optional)</span>
                  </label>
                  <textarea
                    placeholder="What is this project about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-600 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCreateOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProject.isPending || !title.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50"
                >
                  {createProject.isPending ? "Creating..." : "Create project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <div className="h-2 skeleton" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-9 w-9 rounded-xl" />
                <div className="skeleton h-5 w-2/3 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-4/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && projects?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-white/3 rounded-3xl flex items-center justify-center mb-6 border border-white/8">
            <FolderOpen className="w-9 h-9 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-zinc-500 text-sm mb-8 max-w-sm">
            Create your first project to start organizing your team's work.
          </p>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-6 shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create first project
          </Button>
        </div>
      )}

      {/* Projects grid */}
      {!isLoading && projects?.length > 0 && (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                userId={user?._id}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Projects;
