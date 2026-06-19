import { useState, useEffect, type MouseEvent } from "react";
import { Trash2, Clock, RefreshCw, Inbox, CornerUpLeft, Mail } from "lucide-react";
import { EditorShell, Card } from "./EditorUI";
import { getMessages, markMessageRead, deleteMessage } from "./api";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function MessagesEditor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const fetchMessages = () => {
    setLoading(true);
    getMessages().then(setMessages).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { fetchMessages(); }, []);

  const handleOpen = async (m: Message) => {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.read) {
      try { await markMessageRead(m.id); } catch (e) { console.error(e); }
      setMessages(prev => prev.map(x => (x.id === m.id ? { ...x, read: true } : x)));
    }
  };

  const handleDelete = async (e: MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this message?")) return;
    await deleteMessage(id);
    setMessages(prev => prev.filter(x => x.id !== id));
  };

  const unread = messages.filter(m => !m.read).length;
  const fmtDate = (iso: string) => {
    try { return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
    catch { return iso; }
  };

  return (
    <EditorShell title="Messages" description={`Contact form submissions${unread ? ` · ${unread} unread` : ""}`}>
      <div className="flex justify-end -mt-2">
        <button onClick={fetchMessages} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-[#8B9DBB] hover:text-white hover:border-white/20 text-xs transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-[#060A14] border border-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : messages.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <Inbox className="w-8 h-8 text-[#8B9DBB]/30" />
          <p className="text-[#8B9DBB] text-sm">No messages yet.</p>
          <p className="text-[#8B9DBB]/50 text-xs">Submissions from the site's contact form will appear here.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map(m => {
            const open = openId === m.id;
            return (
              <div
                key={m.id}
                onClick={() => handleOpen(m)}
                className={`cursor-pointer rounded-2xl border transition-all ${
                  m.read ? "bg-[#060A14]/80 border-white/5" : "bg-[#0A1128] border-[#2B7FFF]/30"
                } hover:border-white/20`}
              >
                <div className="flex items-center gap-3 p-4">
                  {!m.read && <span className="w-2 h-2 rounded-full bg-[#2B7FFF] shrink-0 shadow-[0_0_8px_#2B7FFF]" />}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${m.read ? "bg-white/5 text-[#8B9DBB]" : "bg-[#2B7FFF]/15 text-[#2B7FFF]"}`}>
                    {m.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm truncate ${m.read ? "text-white/80" : "text-white font-medium"}`}>{m.name}</span>
                      <span className="text-[#8B9DBB]/60 text-xs truncate hidden sm:inline">{m.email}</span>
                    </div>
                    <span className="text-[#8B9DBB] text-xs truncate block">{m.subject || m.message.slice(0, 60)}</span>
                  </div>
                  <span className="text-[#8B9DBB]/50 text-[11px] font-mono shrink-0 hidden md:flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {fmtDate(m.createdAt)}
                  </span>
                  <button onClick={(e) => handleDelete(e, m.id)} className="p-1.5 rounded-lg text-[#8B9DBB]/30 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {open && (
                  <div className="px-4 pb-4 pt-1 border-t border-white/5 mt-1" onClick={(e) => e.stopPropagation()}>
                    <p className="text-[#E0E7F1] text-sm leading-relaxed whitespace-pre-wrap mt-3">{m.message}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "Your message"))}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2B7FFF]/10 border border-[#2B7FFF]/30 text-[#2B7FFF] text-xs hover:bg-[#2B7FFF]/20 transition-all"
                      >
                        <CornerUpLeft className="w-3.5 h-3.5" /> Reply
                      </a>
                      <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 text-[#8B9DBB] hover:text-white text-xs transition-colors">
                        <Mail className="w-3.5 h-3.5" /> {m.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </EditorShell>
  );
}
