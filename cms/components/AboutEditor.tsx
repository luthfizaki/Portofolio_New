import { useState, useEffect } from "react";
import { EditorShell, Card, FormField, Input, Textarea, SaveButton } from "./EditorUI";
import { getContent, updateContent } from "./api";

export function AboutEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getContent("about").then(setData).catch(console.error); }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateContent("about", data);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!data) return <EditorShell title="About Section" description="Loading..." />;

  return (
    <EditorShell title="About Section" description="Edit bio, info cards, and personal details">
      <Card>
        <div className="flex flex-col gap-5">
          <FormField label="Section Label">
            <Input value={data.sectionLabel} onChange={v => setData({ ...data, sectionLabel: v })} />
          </FormField>
          <FormField label="Bio" hint="Main description paragraph">
            <Textarea value={data.bio} onChange={v => setData({ ...data, bio: v })} rows={3} />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Location">
              <Input value={data.location} onChange={v => setData({ ...data, location: v })} />
            </FormField>
            <FormField label="Availability">
              <Input value={data.availability} onChange={v => setData({ ...data, availability: v })} />
            </FormField>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-medium mb-4">Info Cards</h3>
        <div className="flex flex-col gap-4">
          {data.infoCards.map((card: any, i: number) => (
            <div key={card.id} className="bg-[#0A1128] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Title">
                  <Input value={card.title} onChange={v => { const cards = [...data.infoCards]; cards[i] = { ...cards[i], title: v }; setData({ ...data, infoCards: cards }); }} />
                </FormField>
                <FormField label="Icon Name">
                  <Input value={card.icon} onChange={v => { const cards = [...data.infoCards]; cards[i] = { ...cards[i], icon: v }; setData({ ...data, infoCards: cards }); }} />
                </FormField>
              </div>
              <FormField label="Description">
                <Textarea value={card.description} onChange={v => { const cards = [...data.infoCards]; cards[i] = { ...cards[i], description: v }; setData({ ...data, infoCards: cards }); }} rows={2} />
              </FormField>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saving={saving} saved={saved} />
      </div>
    </EditorShell>
  );
}
