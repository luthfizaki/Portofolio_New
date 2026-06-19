import { useState, useEffect, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { EditorShell, Card, FormField, Input, Textarea, SaveButton } from "./EditorUI";
import { getProject, createProject, updateProject, uploadFile, uploadFiles } from "./api";

// Blank project used by the "new" route. Nothing is written to the backend
// until the user explicitly saves.
const blankProject = () => ({
  title: "",
  category: "",
  fullCategory: "",
  iconName: "FolderOpen",
  overview: "",
  contributions: [],
  impact: "",
  tools: [],
  hex: "#2B7FFF",
  mockupType: "mobile-double",
  featured: true,
  status: "draft",
  gallery: [],
  caseStudy: { problem: "", solution: "", myRole: "", teamSize: 1, timeline: "", platforms: [], processSteps: [] },
});

export function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) getProject(id).then(setData).catch(console.error);
    else setData(blankProject()); // New project: start from a blank in-memory draft
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        // Create only now, then move to the real edit URL so future saves update it.
        const created = await createProject(data);
        setData(created);
        navigate(`/cms/projects/${created.id}`, { replace: true });
      } else {
        await updateProject(id!, data);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
      alert("Failed to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateCaseStudy = (field: string, value: any) => {
    setData({ ...data, caseStudy: { ...data.caseStudy, [field]: value } });
  };

  const addStep = () => {
    const steps = [...(data.caseStudy?.processSteps || [])];
    steps.push({ id: `step-${Date.now()}`, title: "", description: "", imageUrl: "", order: steps.length });
    updateCaseStudy("processSteps", steps);
  };

  const updateStep = (i: number, field: string, value: any) => {
    const steps = [...data.caseStudy.processSteps];
    steps[i] = { ...steps[i], [field]: value };
    updateCaseStudy("processSteps", steps);
  };

  const removeStep = (i: number) => {
    updateCaseStudy("processSteps", data.caseStudy.processSteps.filter((_: any, idx: number) => idx !== i));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, stepIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await uploadFile(file);
    updateStep(stepIndex, "imageUrl", url);
  };

  // ─── Project Gallery (multiple photos shown on the detail page) ───────────────
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const uploaded = await uploadFiles(Array.from(files));
      setData((d: any) => ({ ...d, gallery: [...(d.gallery || []), ...uploaded.map((u) => u.url)] }));
    } catch (err) {
      console.error(err);
      alert("One or more photos failed to upload.");
    } finally {
      setUploadingGallery(false);
      e.target.value = ""; // allow re-selecting the same file
    }
  };

  const removeGalleryImage = (i: number) => {
    setData((d: any) => ({ ...d, gallery: (d.gallery || []).filter((_: any, idx: number) => idx !== i) }));
  };

  const addToArray = (field: string) => {
    setData({ ...data, [field]: [...(data[field] || []), ""] });
  };

  const updateArrayItem = (field: string, i: number, value: string) => {
    const items = [...data[field]];
    items[i] = value;
    setData({ ...data, [field]: items });
  };

  const removeArrayItem = (field: string, i: number) => {
    setData({ ...data, [field]: data[field].filter((_: any, idx: number) => idx !== i) });
  };

  if (!data) return <EditorShell title="Project Editor" description="Loading..." />;

  return (
    <EditorShell title={data.title || "New Project"} description="Edit project details and case study">
      {/* Back button */}
      <button onClick={() => navigate("/cms/projects")} className="flex items-center gap-2 text-[#8B9DBB] hover:text-white text-sm transition-colors -mt-2">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </button>

      {/* Basic Info */}
      <Card>
        <h3 className="text-sm font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Title"><Input value={data.title} onChange={v => setData({ ...data, title: v })} /></FormField>
          <FormField label="Category"><Input value={data.category} onChange={v => setData({ ...data, category: v })} /></FormField>
          <FormField label="Full Category"><Input value={data.fullCategory} onChange={v => setData({ ...data, fullCategory: v })} /></FormField>
          <FormField label="Icon Name"><Input value={data.iconName} onChange={v => setData({ ...data, iconName: v })} /></FormField>
          <FormField label="Hex Color">
            <div className="flex items-center gap-2">
              <input type="color" value={data.hex} onChange={e => setData({ ...data, hex: e.target.value })} className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
              <Input value={data.hex} onChange={v => setData({ ...data, hex: v })} />
            </div>
          </FormField>
          <FormField label="Mockup Type"><Input value={data.mockupType} onChange={v => setData({ ...data, mockupType: v })} /></FormField>
          <FormField label="Status">
            <select value={data.status} onChange={e => setData({ ...data, status: e.target.value })} className="w-full bg-[#0A1128] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2B7FFF]/50 transition-all">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </FormField>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={data.featured} onChange={e => setData({ ...data, featured: e.target.checked })} className="w-4 h-4 rounded accent-[#2B7FFF]" />
              <span className="text-sm text-[#8B9DBB]">Featured</span>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <FormField label="Overview"><Textarea value={data.overview} onChange={v => setData({ ...data, overview: v })} rows={3} /></FormField>
        </div>
        <div className="mt-4">
          <FormField label="Impact"><Textarea value={data.impact} onChange={v => setData({ ...data, impact: v })} rows={2} /></FormField>
        </div>
      </Card>

      {/* Gallery */}
      <Card>
        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            <h3 className="text-sm font-medium">Project Gallery</h3>
            <p className="text-xs text-[#8B9DBB] mt-0.5">Multiple photos shown on the project detail page. You can upload several at once.</p>
          </div>
          <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs shrink-0 transition-all ${uploadingGallery ? "border-white/5 text-[#8B9DBB]/50 cursor-wait" : "border-white/10 text-[#8B9DBB] hover:text-white hover:border-[#2B7FFF]/30 cursor-pointer"}`}>
            {uploadingGallery ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploadingGallery ? "Uploading..." : "Upload Photos"}
            <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={uploadingGallery} />
          </label>
        </div>
        {(data.gallery || []).length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-xl py-10 flex flex-col items-center justify-center text-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#8B9DBB]/40" />
            <span className="text-xs text-[#8B9DBB]/60">No photos yet — upload to build the gallery</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(data.gallery || []).map((url: string, i: number) => (
              <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-[#0A1128]">
                <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                <button onClick={() => removeGalleryImage(i)} className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 backdrop-blur text-white/80 hover:text-red-400 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1.5 left-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white/70">{i + 1}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Contributions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Contributions</h3>
          <button onClick={() => addToArray("contributions")} className="flex items-center gap-1 text-xs text-[#2B7FFF] hover:text-white transition-colors"><Plus className="w-3.5 h-3.5" /> Add</button>
        </div>
        <div className="flex flex-col gap-2">
          {(data.contributions || []).map((item: string, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={item} onChange={v => updateArrayItem("contributions", i, v)} />
              <button onClick={() => removeArrayItem("contributions", i)} className="text-[#8B9DBB]/30 hover:text-red-400 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </Card>

      {/* Tools */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Tools</h3>
          <button onClick={() => addToArray("tools")} className="flex items-center gap-1 text-xs text-[#2B7FFF] hover:text-white transition-colors"><Plus className="w-3.5 h-3.5" /> Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data.tools || []).map((item: string, i: number) => (
            <div key={i} className="flex items-center gap-1 bg-[#0A1128] border border-white/10 rounded-lg px-3 py-1.5">
              <input value={item} onChange={e => updateArrayItem("tools", i, e.target.value)} className="bg-transparent text-sm text-white outline-none w-24" />
              <button onClick={() => removeArrayItem("tools", i)} className="text-[#8B9DBB]/30 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      </Card>

      {/* Case Study */}
      <Card className="border-[#2B7FFF]/10">
        <h3 className="text-sm font-medium mb-4 text-[#2B7FFF]">Case Study</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="My Role"><Input value={data.caseStudy?.myRole || ""} onChange={v => updateCaseStudy("myRole", v)} /></FormField>
          <FormField label="Team Size"><Input value={String(data.caseStudy?.teamSize || "")} onChange={v => updateCaseStudy("teamSize", Number(v) || 0)} /></FormField>
          <FormField label="Timeline"><Input value={data.caseStudy?.timeline || ""} onChange={v => updateCaseStudy("timeline", v)} /></FormField>
          <FormField label="Platforms"><Input value={(data.caseStudy?.platforms || []).join(", ")} onChange={v => updateCaseStudy("platforms", v.split(",").map((s: string) => s.trim()))} hint="Comma separated" /></FormField>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <FormField label="Problem Statement"><Textarea value={data.caseStudy?.problem || ""} onChange={v => updateCaseStudy("problem", v)} rows={3} /></FormField>
          <FormField label="Solution"><Textarea value={data.caseStudy?.solution || ""} onChange={v => updateCaseStudy("solution", v)} rows={3} /></FormField>
        </div>
      </Card>

      {/* Process Steps */}
      <Card className="border-[#5C32FF]/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#5C32FF]">Case Study Process Steps</h3>
          <button onClick={addStep} className="flex items-center gap-1 text-xs text-[#5C32FF] hover:text-white transition-colors"><Plus className="w-3.5 h-3.5" /> Add Step</button>
        </div>
        <div className="flex flex-col gap-4">
          {(data.caseStudy?.processSteps || []).map((step: any, i: number) => (
            <div key={step.id} className="bg-[#0A1128] border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#5C32FF] font-mono">Step {i + 1}</span>
                <button onClick={() => removeStep(i)} className="text-[#8B9DBB]/30 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Title"><Input value={step.title} onChange={v => updateStep(i, "title", v)} /></FormField>
                <FormField label="Image">
                  <div className="flex items-center gap-2">
                    <Input value={step.imageUrl} onChange={v => updateStep(i, "imageUrl", v)} placeholder="/uploads/image.png" />
                    <label className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 hover:border-[#2B7FFF]/30 cursor-pointer transition-all shrink-0">
                      <Upload className="w-4 h-4 text-[#8B9DBB]" />
                      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, i)} className="hidden" />
                    </label>
                  </div>
                </FormField>
              </div>
              <div className="mt-3">
                <FormField label="Description"><Textarea value={step.description} onChange={v => updateStep(i, "description", v)} rows={2} /></FormField>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end"><SaveButton onClick={handleSave} saving={saving} saved={saved} /></div>
    </EditorShell>
  );
}
