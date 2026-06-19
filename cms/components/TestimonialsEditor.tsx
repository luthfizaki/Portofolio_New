import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { EditorShell, Card, FormField, Input, Textarea, SaveButton } from "./EditorUI";
import { getContent, updateContent } from "./api";

export function TestimonialsEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getContent("testimonials").then(setData).catch(console.error); }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateContent("testimonials", data);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addTestimonial = () => {
    setData({ ...data, testimonials: [...data.testimonials, { id: `test-${Date.now()}`, content: "", author: "", role: "", company: "", initial: "?", order: data.testimonials.length }] });
  };

  const removeTestimonial = (id: string) => {
    setData({ ...data, testimonials: data.testimonials.filter((t: any) => t.id !== id) });
  };

  const updateTest = (i: number, field: string, value: string) => {
    const items = [...data.testimonials];
    items[i] = { ...items[i], [field]: value };
    setData({ ...data, testimonials: items });
  };

  if (!data) return <EditorShell title="Testimonials" description="Loading..." />;

  return (
    <EditorShell title="Testimonials" description="Manage colleague/client testimonials">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Section Label"><Input value={data.sectionLabel} onChange={v => setData({ ...data, sectionLabel: v })} /></FormField>
          <FormField label="Description"><Input value={data.description} onChange={v => setData({ ...data, description: v })} /></FormField>
        </div>
      </Card>

      {data.testimonials.map((t: any, i: number) => (
        <Card key={t.id}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white">{t.author || `Testimonial ${i + 1}`}</span>
            <button onClick={() => removeTestimonial(t.id)} className="text-[#8B9DBB]/30 hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="flex flex-col gap-4">
            <FormField label="Quote"><Textarea value={t.content} onChange={v => updateTest(i, "content", v)} rows={3} /></FormField>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <FormField label="Author"><Input value={t.author} onChange={v => updateTest(i, "author", v)} /></FormField>
              <FormField label="Role"><Input value={t.role} onChange={v => updateTest(i, "role", v)} /></FormField>
              <FormField label="Company"><Input value={t.company} onChange={v => updateTest(i, "company", v)} /></FormField>
              <FormField label="Initial"><Input value={t.initial} onChange={v => updateTest(i, "initial", v)} /></FormField>
            </div>
          </div>
        </Card>
      ))}

      <button onClick={addTestimonial} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/10 text-[#8B9DBB] hover:text-white hover:border-[#2B7FFF]/30 hover:bg-[#2B7FFF]/5 transition-all text-sm w-full justify-center">
        <Plus className="w-4 h-4" /> Add Testimonial
      </button>

      <div className="flex justify-end"><SaveButton onClick={handleSave} saving={saving} saved={saved} /></div>
    </EditorShell>
  );
}
