import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { EditorShell, Card, FormField, Input, SaveButton } from "./EditorUI";
import { getContent, updateContent } from "./api";

export function SkillsEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getContent("skills").then(setData).catch(console.error); }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateContent("skills", data);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateItem = (section: string, i: number, field: string, value: string) => {
    const items = [...data[section]];
    items[i] = { ...items[i], [field]: value };
    setData({ ...data, [section]: items });
  };

  const addItem = (section: string, template: any) => {
    setData({ ...data, [section]: [...data[section], template] });
  };

  const removeItem = (section: string, i: number) => {
    setData({ ...data, [section]: data[section].filter((_: any, idx: number) => idx !== i) });
  };

  const renderList = (title: string, sectionKey: string, items: any[], fields: { key: string; label: string }[]) => (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="text-xs text-[#8B9DBB] font-mono">{items.length} items</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-3 bg-[#0A1128] border border-white/5 rounded-xl p-3">
            <div className="flex-1 grid grid-cols-2 gap-3">
              {fields.map(f => (
                <Input key={f.key} value={item[f.key] || ""} onChange={v => updateItem(sectionKey, i, f.key, v)} placeholder={f.label} />
              ))}
            </div>
            <button onClick={() => removeItem(sectionKey, i)} className="text-[#8B9DBB]/30 hover:text-red-400 transition-colors shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
      <button onClick={() => addItem(sectionKey, fields.reduce((a, f) => ({ ...a, [f.key]: "" }), {}))} className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg border border-dashed border-white/10 text-[#8B9DBB] hover:text-white hover:border-[#2B7FFF]/30 text-xs w-full justify-center transition-all">
        <Plus className="w-3.5 h-3.5" /> Add
      </button>
    </Card>
  );

  if (!data) return <EditorShell title="Skills & Tools" description="Loading..." />;

  return (
    <EditorShell title="Skills & Tools" description="Manage skills, design tools, AI toolkit, and collaboration areas">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Section Label"><Input value={data.sectionLabel} onChange={v => setData({ ...data, sectionLabel: v })} /></FormField>
          <FormField label="Description"><Input value={data.description} onChange={v => setData({ ...data, description: v })} /></FormField>
        </div>
      </Card>

      {renderList("Core Skills", "coreSkills", data.coreSkills, [{ key: "name", label: "Skill Name" }, { key: "icon", label: "Icon" }])}
      {renderList("Design Tools", "designTools", data.designTools, [{ key: "name", label: "Tool Name" }, { key: "iconType", label: "Icon Type" }])}
      {renderList("AI Toolkit", "aiToolkit", data.aiToolkit, [{ key: "name", label: "Skill Name" }, { key: "icon", label: "Icon" }])}
      {renderList("Collaboration", "collaboration", data.collaboration, [{ key: "name", label: "Area" }, { key: "icon", label: "Icon" }])}

      <div className="flex justify-end"><SaveButton onClick={handleSave} saving={saving} saved={saved} /></div>
    </EditorShell>
  );
}
