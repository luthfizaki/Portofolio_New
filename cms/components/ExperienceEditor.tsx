import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { EditorShell, Card, FormField, Input, Textarea, SaveButton } from "./EditorUI";
import { getContent, updateContent } from "./api";

export function ExperienceEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getContent("experience").then(setData).catch(console.error); }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateContent("experience", data);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addExperience = () => {
    const newExp = { id: `exp-${Date.now()}`, year: "2025", company: "", role: "", date: "", location: "", description: "", icon: "Briefcase" };
    setData({ ...data, experiences: [...data.experiences, newExp] });
  };

  const removeExperience = (id: string) => {
    setData({ ...data, experiences: data.experiences.filter((e: any) => e.id !== id) });
  };

  const updateExp = (i: number, field: string, value: string) => {
    const exps = [...data.experiences];
    exps[i] = { ...exps[i], [field]: value };
    setData({ ...data, experiences: exps });
  };

  if (!data) return <EditorShell title="Experience" description="Loading..." />;

  return (
    <EditorShell title="Experience" description="Manage work experience timeline entries">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <FormField label="Section Label">
            <Input value={data.sectionLabel} onChange={v => setData({ ...data, sectionLabel: v })} />
          </FormField>
          <FormField label="Description">
            <Input value={data.description} onChange={v => setData({ ...data, description: v })} />
          </FormField>
        </div>
      </Card>

      {data.experiences.map((exp: any, i: number) => (
        <Card key={exp.id} className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-[#8B9DBB]/30" />
              <span className="text-sm font-medium text-white">{exp.company || `Experience ${i + 1}`}</span>
              <span className="text-xs text-[#8B9DBB] font-mono">{exp.year}</span>
            </div>
            <button onClick={() => removeExperience(exp.id)} className="text-[#8B9DBB]/30 hover:text-red-400 transition-colors p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Year"><Input value={exp.year} onChange={v => updateExp(i, "year", v)} /></FormField>
            <FormField label="Company"><Input value={exp.company} onChange={v => updateExp(i, "company", v)} /></FormField>
            <FormField label="Role"><Input value={exp.role} onChange={v => updateExp(i, "role", v)} /></FormField>
            <FormField label="Date Range"><Input value={exp.date} onChange={v => updateExp(i, "date", v)} placeholder="Jan 2022 – Present" /></FormField>
            <FormField label="Location"><Input value={exp.location} onChange={v => updateExp(i, "location", v)} /></FormField>
            <FormField label="Icon" hint="Lucide icon name"><Input value={exp.icon} onChange={v => updateExp(i, "icon", v)} /></FormField>
          </div>
          <div className="mt-4">
            <FormField label="Description"><Textarea value={exp.description} onChange={v => updateExp(i, "description", v)} rows={2} /></FormField>
          </div>
        </Card>
      ))}

      <button onClick={addExperience} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/10 text-[#8B9DBB] hover:text-white hover:border-[#2B7FFF]/30 hover:bg-[#2B7FFF]/5 transition-all text-sm w-full justify-center">
        <Plus className="w-4 h-4" /> Add Experience
      </button>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saving={saving} saved={saved} />
      </div>
    </EditorShell>
  );
}
