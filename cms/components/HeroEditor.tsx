import { useState, useEffect } from "react";
import { EditorShell, Card, FormField, Input, Textarea, SaveButton } from "./EditorUI";
import { getContent, updateContent } from "./api";

export function HeroEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getContent("hero").then(setData).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateContent("hero", data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!data) return <EditorShell title="Hero Section" description="Loading..." />;

  return (
    <EditorShell title="Hero Section" description="Edit the main hero area content">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="First Name">
            <Input value={data.firstName} onChange={v => setData({ ...data, firstName: v })} />
          </FormField>
          <FormField label="Last Name">
            <Input value={data.lastName} onChange={v => setData({ ...data, lastName: v })} />
          </FormField>
          <FormField label="Role">
            <Input value={data.role} onChange={v => setData({ ...data, role: v })} placeholder="UI/UX Designer" />
          </FormField>
          <FormField label="Years Range">
            <Input value={data.yearsRange} onChange={v => setData({ ...data, yearsRange: v })} placeholder="2022 - 2026" />
          </FormField>
          <FormField label="Experience Years">
            <Input value={data.experienceYears} onChange={v => setData({ ...data, experienceYears: v })} placeholder="4+ yrs exp." />
          </FormField>
          <FormField label="CTA Button Text">
            <Input value={data.ctaText} onChange={v => setData({ ...data, ctaText: v })} />
          </FormField>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-5">
          <FormField label="Tagline">
            <Textarea value={data.tagline} onChange={v => setData({ ...data, tagline: v })} rows={2} />
          </FormField>
          <FormField label="Tagline Highlight Word" hint="This word gets the shimmer effect">
            <Input value={data.taglineHighlight} onChange={v => setData({ ...data, taglineHighlight: v })} />
          </FormField>
          <FormField label="Scroll Indicator Text">
            <Input value={data.scrollIndicatorText} onChange={v => setData({ ...data, scrollIndicatorText: v })} />
          </FormField>
        </div>
      </Card>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saving={saving} saved={saved} />
      </div>
    </EditorShell>
  );
}
