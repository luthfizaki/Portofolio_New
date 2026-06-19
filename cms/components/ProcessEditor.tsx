import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { EditorShell, Card, FormField, Input, Textarea, SaveButton } from "./EditorUI";
import { getContent, updateContent } from "./api";

export function ProcessEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getContent("process").then(setData).catch(console.error); }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateContent("process", data);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addStage = () => {
    const num = String(data.stages.length + 1).padStart(2, "0");
    setData({ ...data, stages: [...data.stages, { id: `stage-${Date.now()}`, number: num, title: "", description: "", iconName: "Target", order: data.stages.length }] });
  };

  const removeStage = (id: string) => {
    setData({ ...data, stages: data.stages.filter((s: any) => s.id !== id) });
  };

  const updateStage = (i: number, field: string, value: string | number) => {
    const stages = [...data.stages];
    stages[i] = { ...stages[i], [field]: value };
    setData({ ...data, stages });
  };

  if (!data) return <EditorShell title="Design Process" description="Loading..." />;

  return (
    <EditorShell title="Design Process" description="Manage your design process stages">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Section Label"><Input value={data.sectionLabel} onChange={v => setData({ ...data, sectionLabel: v })} /></FormField>
          <FormField label="Description"><Input value={data.description} onChange={v => setData({ ...data, description: v })} /></FormField>
        </div>
      </Card>

      {data.stages.map((stage: any, i: number) => (
        <Card key={stage.id} className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#2B7FFF] font-mono">{stage.number}. {stage.title || "New Stage"}</span>
            <button onClick={() => removeStage(stage.id)} className="text-[#8B9DBB]/30 hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Number"><Input value={stage.number} onChange={v => updateStage(i, "number", v)} /></FormField>
            <FormField label="Title"><Input value={stage.title} onChange={v => updateStage(i, "title", v)} /></FormField>
            <FormField label="Icon Name"><Input value={stage.iconName} onChange={v => updateStage(i, "iconName", v)} /></FormField>
          </div>
          <div className="mt-4">
            <FormField label="Description"><Textarea value={stage.description} onChange={v => updateStage(i, "description", v)} rows={2} /></FormField>
          </div>
        </Card>
      ))}

      <button onClick={addStage} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/10 text-[#8B9DBB] hover:text-white hover:border-[#2B7FFF]/30 hover:bg-[#2B7FFF]/5 transition-all text-sm w-full justify-center">
        <Plus className="w-4 h-4" /> Add Stage
      </button>

      <div className="flex justify-end"><SaveButton onClick={handleSave} saving={saving} saved={saved} /></div>
    </EditorShell>
  );
}
