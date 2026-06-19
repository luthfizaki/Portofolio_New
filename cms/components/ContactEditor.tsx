import { useState, useEffect } from "react";
import { EditorShell, Card, FormField, Input, Textarea, SaveButton } from "./EditorUI";
import { getContent, updateContent } from "./api";

export function ContactEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getContent("contact").then(setData).catch(console.error); }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateContent("contact", data);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCard = (i: number, field: string, value: string) => {
    const cards = [...data.contactCards];
    cards[i] = { ...cards[i], [field]: value };
    setData({ ...data, contactCards: cards });
  };

  if (!data) return <EditorShell title="Contact Section" description="Loading..." />;

  return (
    <EditorShell title="Contact Section" description="Edit contact info, links, and form settings">
      <Card>
        <div className="flex flex-col gap-5">
          <FormField label="Section Label"><Input value={data.sectionLabel} onChange={v => setData({ ...data, sectionLabel: v })} /></FormField>
          <FormField label="Description"><Textarea value={data.description} onChange={v => setData({ ...data, description: v })} rows={2} /></FormField>
          <FormField label="Submit Button Text"><Input value={data.submitButtonText} onChange={v => setData({ ...data, submitButtonText: v })} /></FormField>
          <FormField label="Privacy Notice"><Input value={data.privacyNotice} onChange={v => setData({ ...data, privacyNotice: v })} /></FormField>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-medium mb-4">Contact Cards</h3>
        <div className="flex flex-col gap-3">
          {data.contactCards.map((card: any, i: number) => (
            <div key={card.id} className="bg-[#0A1128] border border-white/5 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Label"><Input value={card.label} onChange={v => updateCard(i, "label", v)} /></FormField>
                <FormField label="Value"><Input value={card.value} onChange={v => updateCard(i, "value", v)} /></FormField>
                <FormField label="Link / Href"><Input value={card.href} onChange={v => updateCard(i, "href", v)} /></FormField>
                <FormField label="Icon"><Input value={card.icon} onChange={v => updateCard(i, "icon", v)} /></FormField>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-medium mb-4">Form Field Labels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.formLabels).map(([key, val]: [string, any]) => (
            <FormField key={key} label={key}><Input value={val} onChange={v => setData({ ...data, formLabels: { ...data.formLabels, [key]: v } })} /></FormField>
          ))}
        </div>
      </Card>

      <div className="flex justify-end"><SaveButton onClick={handleSave} saving={saving} saved={saved} /></div>
    </EditorShell>
  );
}
