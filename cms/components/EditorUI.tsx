import { type ReactNode } from "react";
import { Save, CheckCircle, Loader2 } from "lucide-react";

export function EditorShell({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-wide">{title}</h1>
        {description && <p className="text-[#8B9DBB] text-sm font-light">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = "", ...props }: { children: ReactNode; className?: string; [key: string]: any }) {
  return (
    <div className={`bg-[#060A14]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

export function FormField({ label, children, hint, ...props }: { label: string; children: ReactNode; hint?: string; [key: string]: any }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#8B9DBB] text-xs font-mono uppercase tracking-wider">{label}</label>
      {children}
      {hint && <span className="text-[#8B9DBB]/50 text-xs">{hint}</span>}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type = "text", ...props }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; [key: string]: any }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0A1128] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#2B7FFF]/50 focus:ring-1 focus:ring-[#2B7FFF]/20 transition-all"
    />
  );
}

export function Textarea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#0A1128] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#2B7FFF]/50 focus:ring-1 focus:ring-[#2B7FFF]/20 transition-all resize-y"
    />
  );
}

export function SaveButton({ onClick, saving, saved, disabled }: { onClick: () => void; saving: boolean; saved: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving || disabled}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
        saved
          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
          : "bg-gradient-to-r from-[#2B7FFF] to-[#5C32FF] text-white hover:shadow-[0_0_20px_rgba(43,127,255,0.2)] active:scale-[0.98]"
      }`}
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
    </button>
  );
}

export function useSaveState() {
  return { saving: false, saved: false };
}
