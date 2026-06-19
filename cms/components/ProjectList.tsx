import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit3, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { EditorShell, Card } from "./EditorUI";
import { getProjects, deleteProject, reorderProjects } from "./api";

export function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = () => {
    setLoading(true);
    getProjects().then(setProjects).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await deleteProject(id);
    fetchProjects();
  };

  // Open a blank editor. Nothing is persisted until the user clicks Save —
  // ProjectEditor handles the create-on-save for the "new" route.
  const handleAdd = () => {
    navigate("/cms/projects/new");
  };

  const handleMove = async (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= projects.length) return;
    const next = [...projects];
    [next[index], next[to]] = [next[to], next[index]];
    setProjects(next); // optimistic update
    try {
      await reorderProjects(next.map(p => p.id));
    } catch (e) {
      console.error(e);
      fetchProjects(); // revert from server on failure
    }
  };

  return (
    <EditorShell title="Projects" description="Manage featured projects and case studies">
      <div className="flex justify-end mb-2">
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2B7FFF] to-[#5C32FF] text-white text-sm font-medium hover:shadow-[0_0_20px_rgba(43,127,255,0.2)] active:scale-[0.98] transition-all">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-[#060A14] border border-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj, index) => (
            <Card key={proj.id} className="group hover:border-white/10 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[#8B9DBB]/40 font-mono text-xs w-5 shrink-0">{(index + 1).toString().padStart(2, "0")}</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: proj.hex }} />
                  <div>
                    <h3 className="text-sm font-medium text-white">{proj.title}</h3>
                    <span className="text-xs text-[#8B9DBB] font-mono">{proj.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {proj.status === "draft" && <EyeOff className="w-3.5 h-3.5 text-yellow-500/50" />}
                  <button onClick={() => handleMove(index, -1)} disabled={index === 0} title="Move up" className="p-1.5 rounded-lg hover:bg-white/5 text-[#8B9DBB] hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleMove(index, 1)} disabled={index === projects.length - 1} title="Move down" className="p-1.5 rounded-lg hover:bg-white/5 text-[#8B9DBB] hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed"><ChevronDown className="w-3.5 h-3.5" /></button>
                  <button onClick={() => navigate(`/cms/projects/${proj.id}`)} title="Edit" className="p-1.5 rounded-lg hover:bg-white/5 text-[#8B9DBB] hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(proj.id, proj.title)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#8B9DBB]/30 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-[#8B9DBB] text-xs leading-relaxed line-clamp-2">{proj.overview}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${proj.featured ? "bg-[#2B7FFF]/10 text-[#2B7FFF]" : "bg-white/5 text-[#8B9DBB]"}`}>
                  {proj.featured ? "Featured" : "Hidden"}
                </span>
                <span className="text-[10px] text-[#8B9DBB] font-mono">{proj.tools?.join(", ")}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </EditorShell>
  );
}
