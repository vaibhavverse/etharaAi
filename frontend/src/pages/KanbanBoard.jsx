import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../components/ui/dialog";
import { Plus, MoreHorizontal, Calendar, User, Flag, Trash2, X, UserPlus, ArrowLeft, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth.store";
import { format } from "date-fns";

const PRIORITY_STYLES = {
  low: "priority-low",
  medium: "priority-medium",
  high: "priority-high",
  urgent: "priority-urgent",
};

const COLUMNS = {
  todo: { name: "To Do", dot: "bg-zinc-500" },
  "in-progress": { name: "In Progress", dot: "bg-indigo-500" },
  done: { name: "Done", dot: "bg-green-500" },
};

// ── Task Card ──────────────────────────────────────────────────────────────────
const TaskCard = ({ item, snapshot, provided, onClick, onDelete, canManageTasks }) => {
  const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && item.status !== "done";
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => onClick(item)}
      className={`mb-2.5 p-3.5 rounded-xl border cursor-pointer transition-all group
        ${snapshot.isDragging
          ? "bg-zinc-800 border-indigo-500/40 shadow-xl shadow-black/40 rotate-1"
          : "bg-zinc-900/60 border-white/8 hover:border-white/15 hover:bg-zinc-900"}`}
    >
      {/* Priority + delete */}
      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.medium}`}>
          {item.priority || "medium"}
        </span>
        {canManageTasks && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      <p className="text-sm font-medium text-white mb-2 leading-snug line-clamp-2">{item.title}</p>

      {item.description && (
        <p className="text-xs text-zinc-500 line-clamp-1 mb-2">{item.description}</p>
      )}

      <div className="flex items-center justify-between mt-1">
        {item.dueDate && (
          <span className={`flex items-center gap-1 text-[11px] ${isOverdue ? "text-red-400" : "text-zinc-500"}`}>
            <Calendar className="w-3 h-3" />
            {format(new Date(item.dueDate), "MMM d")}
            {isOverdue && " · Overdue"}
          </span>
        )}
        {item.assigneeId && (
          <div className="ml-auto w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[9px] font-bold text-indigo-400">
            {item.assigneeId.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Task Detail Modal ──────────────────────────────────────────────────────────
const TaskDetailModal = ({ task, open, onClose, onUpdate, project, user }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        assigneeId: task.assigneeId?._id || task.assigneeId || "",
      });
    }
  }, [task]);

  if (!task) return null;

  const projectRole = project?.members?.find(m => (m.user?._id || m.user) === user?._id)?.role;
  const isProjectAdmin = projectRole === "admin" || project?.ownerId === user?._id || project?.ownerId?._id === user?._id;
  const isAssignee = task.assigneeId?._id === user?._id || task.assigneeId === user?._id;
  const canEditTask = isProjectAdmin || isAssignee;

  const handleSave = () => {
    onUpdate(task._id, form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {canEditTask ? "Edit Task" : "Task Details"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Title</label>
            <Input 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })}
              disabled={!canEditTask}
              className="bg-zinc-900 border-white/10 text-white h-9 rounded-lg text-sm focus:border-indigo-500/50 disabled:opacity-70" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Description</label>
            <textarea 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })}
              disabled={!canEditTask}
              rows={3} 
              placeholder="Add a description..."
              className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-indigo-500/50 placeholder:text-zinc-600 disabled:opacity-70" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Status</label>
              <select 
                value={form.status} 
                onChange={e => setForm({ ...form, status: e.target.value })}
                disabled={!canEditTask}
                className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 disabled:opacity-70"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Priority</label>
              <select 
                value={form.priority} 
                onChange={e => setForm({ ...form, priority: e.target.value })}
                disabled={!canEditTask}
                className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 disabled:opacity-70"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Due Date</label>
              <Input 
                type="date" 
                value={form.dueDate} 
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                disabled={!canEditTask}
                className="bg-zinc-900 border-white/10 text-white h-9 rounded-lg text-sm focus:border-indigo-500/50 [color-scheme:dark] disabled:opacity-70" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Assignee</label>
              <select 
                value={form.assigneeId} 
                onChange={e => setForm({ ...form, assigneeId: e.target.value })}
                disabled={!isProjectAdmin}
                className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 disabled:opacity-70"
              >
                <option value="">Unassigned</option>
                {project?.members?.map(m => (
                  <option key={m.user?._id || m.user} value={m.user?._id || m.user}>{m.user?.name || "Member"}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
            {canEditTask ? "Cancel" : "Close"}
          </Button>
          {canEditTask && (
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">
              Save changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Member Management Modal ────────────────────────────────────────────────────
const MembersModal = ({ project, open, onClose, isOwner }) => {
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();

  const addMember = useMutation({
    mutationFn: (email) => api.post(`/projects/${project._id}/members/add`, { email }),
    onSuccess: () => {
      queryClient.invalidateQueries(["project", project._id]);
      toast.success("Member added!");
      setEmail("");
    },
    onError: (e) => toast.error(e.message || "Failed to add member"),
  });

  const removeMember = useMutation({
    mutationFn: (memberId) => api.post(`/projects/${project._id}/members/remove`, { memberId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["project", project._id]);
      toast.success("Member removed");
    },
    onError: () => toast.error("Failed to remove member"),
  });

  const allMembers = (project.members || []).map(m => ({
    ...m.user,
    role: m.role,
    isOwner: m.user?._id === project.ownerId?._id || m.user?._id === project.ownerId || m.user === project.ownerId
  }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-400" /> Team Members
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Current members */}
          <div className="space-y-2">
            {allMembers.map(m => (
              <div key={m._id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-sm shrink-0">
                  {m.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{m.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                    m.isOwner ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/20" : "bg-zinc-800 text-zinc-400 border-white/10"
                  }`}>
                    {m.role === "admin" ? "Admin" : "Member"}
                  </span>
                  {isOwner && !m.isOwner && (
                    <button onClick={() => removeMember.mutate(m._id)}
                      className="p-1 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add member (admin only) */}
          {isOwner && (
            <div className="pt-2 border-t border-white/5">
              <label className="text-xs font-medium text-zinc-400 block mb-2">Add member by email</label>
              <div className="flex gap-2">
                <Input value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="bg-zinc-900 border-white/10 text-white h-9 rounded-lg text-sm flex-1 placeholder:text-zinc-600 focus:border-indigo-500/50"
                  onKeyDown={e => e.key === "Enter" && email && addMember.mutate(email)} />
                <Button onClick={() => email && addMember.mutate(email)}
                  disabled={!email || addMember.isPending}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white h-9 px-4 rounded-lg text-sm shrink-0">
                  {addMember.isPending ? "..." : "Add"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── Main Kanban Board ──────────────────────────────────────────────────────────
const KanbanBoard = () => {
  const { id: projectId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [columns, setColumns] = useState({
    todo: { ...COLUMNS.todo, items: [] },
    "in-progress": { ...COLUMNS["in-progress"], items: [] },
    done: { ...COLUMNS.done, items: [] },
  });
  const [addingToCol, setAddingToCol] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}`);
      return res.data.data;
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await api.get(`/tasks/project/${projectId}`);
      return res.data.data;
    },
  });

  useEffect(() => {
    if (tasks) {
      const grouped = {
        todo: { ...COLUMNS.todo, items: [] },
        "in-progress": { ...COLUMNS["in-progress"], items: [] },
        done: { ...COLUMNS.done, items: [] },
      };
      tasks.forEach((t) => { if (grouped[t.status]) grouped[t.status].items.push(t); });
      setColumns(grouped);
    }
  }, [tasks]);

  const userProjectRole = project?.members?.find(m => (m.user?._id || m.user) === user?._id)?.role;
  const isOwner = project?.ownerId === user?._id || project?.ownerId?._id === user?._id;
  const isProjectAdmin = isOwner || userProjectRole === "admin";
  const canManageTasks = isProjectAdmin;


  const projectMembers = (project?.members || []).map(m => m.user);

  const updateTask = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/tasks/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(["tasks", projectId]),
    onError: () => { queryClient.invalidateQueries(["tasks", projectId]); toast.error("Failed to update task"); },
  });

  const createTask = useMutation({
    mutationFn: (data) => api.post("/tasks", data),
    onSuccess: () => { queryClient.invalidateQueries(["tasks", projectId]); setNewTaskTitle(""); setAddingToCol(null); },
    onError: () => toast.error("Failed to create task"),
  });

  const deleteTask = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(["tasks", projectId]); toast.success("Task deleted"); },
    onError: () => toast.error("Failed to delete task"),
  });

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const srcCol = columns[source.droppableId];
    const dstCol = columns[destination.droppableId];
    const srcItems = [...srcCol.items];
    const dstItems = source.droppableId === destination.droppableId ? srcItems : [...dstCol.items];
    const [moved] = srcItems.splice(source.index, 1);

    if (source.droppableId !== destination.droppableId) {
      moved.status = destination.droppableId;
      dstItems.splice(destination.index, 0, moved);
      setColumns({
        ...columns,
        [source.droppableId]: { ...srcCol, items: srcItems },
        [destination.droppableId]: { ...dstCol, items: dstItems },
      });
      updateTask.mutate({ id: moved._id, data: { status: destination.droppableId } });
    } else {
      srcItems.splice(destination.index, 0, moved);
      setColumns({ ...columns, [source.droppableId]: { ...srcCol, items: srcItems } });
    }
  };

  if (projectLoading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-zinc-500">Project not found</p>
      <Link to="/app/projects"><Button variant="outline">Back to Projects</Button></Link>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Board header */}
      <div className="px-5 md:px-8 py-5 border-b border-white/6 flex items-center gap-4 shrink-0">
        <Link to="/app/projects" className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">{project.title}</h1>
          {project.description && (
            <p className="text-xs text-zinc-500 truncate mt-0.5">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            onClick={() => setMembersOpen(true)}
            className="text-zinc-400 hover:text-white h-9 px-3 text-sm gap-2 rounded-lg"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Members</span>
            <span className="bg-indigo-500/20 text-indigo-400 text-xs px-1.5 py-0.5 rounded-md">
              {(project.members?.length || 0) + 1}
            </span>
          </Button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-5 md:p-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-5 h-full items-start min-w-max">
            {Object.entries(columns).map(([colId, col]) => (
              <div key={colId} className="w-72 shrink-0 flex flex-col max-h-full bg-zinc-900/40 rounded-2xl border border-white/6">
                {/* Column header */}
                <div className="p-3.5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <h3 className="text-sm font-semibold text-zinc-200">{col.name}</h3>
                    <span className="text-xs bg-white/8 text-zinc-500 px-1.5 py-0.5 rounded-md font-medium">
                      {col.items.length}
                    </span>
                  </div>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-3 overflow-y-auto min-h-[120px] transition-colors rounded-xl ${
                        snapshot.isDraggingOver ? "bg-indigo-500/5" : ""
                      }`}
                    >
                      {col.items.map((item, index) => (
                        <Draggable key={item._id} draggableId={item._id} index={index}>
                          {(provided, snapshot) => (
                            <TaskCard
                              item={item}
                              provided={provided}
                              snapshot={snapshot}
                              onClick={(t) => { setSelectedTask(t); setTaskModalOpen(true); }}
                              onDelete={(id) => {
                                if (window.confirm("Delete this task?")) deleteTask.mutate(id);
                              }}
                              canManageTasks={canManageTasks}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Add task inline */}
                      {canManageTasks && (
                        addingToCol === colId ? (
                          <div className="mt-1">
                            <Input
                              autoFocus
                              value={newTaskTitle}
                              onChange={e => setNewTaskTitle(e.target.value)}
                              placeholder="Task title..."
                              className="bg-zinc-900 border-white/10 text-sm h-9 rounded-lg text-white placeholder:text-zinc-600 focus:border-indigo-500/50"
                              onKeyDown={e => {
                                if (e.key === "Enter" && newTaskTitle.trim()) {
                                  createTask.mutate({ title: newTaskTitle, status: colId, projectId });
                                }
                                if (e.key === "Escape") { setAddingToCol(null); setNewTaskTitle(""); }
                              }}
                              onBlur={() => { if (!newTaskTitle.trim()) setAddingToCol(null); }}
                            />
                            <div className="flex gap-1.5 mt-1.5">
                              <Button size="sm" onClick={() => newTaskTitle.trim() && createTask.mutate({ title: newTaskTitle, status: colId, projectId })}
                                disabled={!newTaskTitle.trim() || createTask.isPending}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white h-7 text-xs rounded-lg px-3">
                                Add
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => { setAddingToCol(null); setNewTaskTitle(""); }}
                                className="text-zinc-500 hover:text-white h-7 text-xs rounded-lg">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAddingToCol(colId)}
                            className="w-full mt-1.5 flex items-center gap-2 px-2 py-2 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-colors text-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add task
                          </button>
                        )
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        open={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setSelectedTask(null); }}
        onUpdate={(id, data) => updateTask.mutate({ id, data })}
        project={project}
        user={user}
      />

      {/* Members Modal */}
      {project && (
        <MembersModal
          project={project}
          open={membersOpen}
          onClose={() => setMembersOpen(false)}
          isOwner={isProjectAdmin}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
