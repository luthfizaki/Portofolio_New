import { useState, useEffect, type ChangeEvent } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { EditorShell, Card, FormField, Input, SaveButton } from "./EditorUI";
import { getContent, updateContent, uploadFile } from "./api";

export function SettingsEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => { getContent("settings").then(setData).catch(console.error); }, []);

  const handleResumeUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    try {
      const { url } = await uploadFile(file);
      setData((d: any) => ({ ...d, resumeUrl: url, resumeName: file.name }));
    } catch (err) {
      console.error(err);
      alert("Resume upload failed. Please try again.");
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await updateContent("settings", data);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSection = (key: string) => {
    setData({ ...data, sectionVisibility: { ...data.sectionVisibility, [key]: !data.sectionVisibility[key] } });
  };

  if (!data) return <EditorShell title="Settings" description="Loading..." />;

  return (
    <EditorShell title="Settings" description="Global appearance, colors, personal info, and section visibility">
      <Card>
        <h3 className="text-sm font-medium mb-4">Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(data.colors).map(([key, val]: [string, any]) => (
            <FormField key={key} label={key}>
              <div className="flex items-center gap-2">
                <input type="color" value={val} onChange={e => setData({ ...data, colors: { ...data.colors, [key]: e.target.value } })} className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer bg-transparent" />
                <Input value={val} onChange={v => setData({ ...data, colors: { ...data.colors, [key]: v } })} />
              </div>
            </FormField>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-medium mb-4">Personal Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.personalInfo).map(([key, val]: [string, any]) => (
            <FormField key={key} label={key}>
              <Input value={val} onChange={v => setData({ ...data, personalInfo: { ...data.personalInfo, [key]: v } })} />
            </FormField>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-medium mb-1">Resume / CV</h3>
        <p className="text-xs text-[#8B9DBB] mb-4">Upload the PDF used by the “Download CV / View my resume” button on the site.</p>
        <div className="flex items-center gap-3 flex-wrap">
          <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${uploadingResume ? "border-white/5 text-[#8B9DBB]/50 cursor-wait" : "border-white/10 text-[#8B9DBB] hover:text-white hover:border-[#2B7FFF]/30 cursor-pointer"}`}>
            {uploadingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadingResume ? "Uploading..." : data.resumeUrl ? "Replace PDF" : "Upload PDF"}
            <input type="file" accept="application/pdf,.pdf" onChange={handleResumeUpload} className="hidden" disabled={uploadingResume} />
          </label>
          {data.resumeUrl && (
            <a href={data.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#2B7FFF] hover:underline">
              <FileText className="w-4 h-4" /> {data.resumeName || "View current resume"}
            </a>
          )}
        </div>
        {data.resumeUrl && (
          <div className="mt-4">
            <FormField label="Resume URL"><Input value={data.resumeUrl} onChange={v => setData({ ...data, resumeUrl: v })} /></FormField>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-sm font-medium mb-4">Section Visibility</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(data.sectionVisibility).map(([key, visible]: [string, any]) => (
            <button
              key={key}
              onClick={() => toggleSection(key)}
              className={`px-4 py-2.5 rounded-xl text-sm capitalize transition-all border ${
                visible
                  ? "bg-[#2B7FFF]/10 border-[#2B7FFF]/30 text-[#2B7FFF]"
                  : "bg-white/[0.02] border-white/5 text-[#8B9DBB]/50"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-medium mb-4">Footer</h3>
        <div className="flex flex-col gap-4">
          <FormField label="Tagline"><Input value={data.footer.tagline} onChange={v => setData({ ...data, footer: { ...data.footer, tagline: v } })} /></FormField>
          <FormField label="Copyright"><Input value={data.footer.copyright} onChange={v => setData({ ...data, footer: { ...data.footer, copyright: v } })} /></FormField>
          <FormField label="Availability"><Input value={data.footer.availability} onChange={v => setData({ ...data, footer: { ...data.footer, availability: v } })} /></FormField>
        </div>
      </Card>

      <div className="flex justify-end"><SaveButton onClick={handleSave} saving={saving} saved={saved} /></div>
    </EditorShell>
  );
}
