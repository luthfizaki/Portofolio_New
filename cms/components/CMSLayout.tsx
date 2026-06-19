import { type ReactNode } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Home, User, Briefcase, FolderOpen, Workflow,
  MessageSquare, Wrench, Mail, Settings, LogOut, Shield, ExternalLink, Inbox
} from "lucide-react";

const navItems = [
  { to: "/cms/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/cms/hero", icon: Home, label: "Hero" },
  { to: "/cms/about", icon: User, label: "About" },
  { to: "/cms/experience", icon: Briefcase, label: "Experience" },
  { to: "/cms/projects", icon: FolderOpen, label: "Projects" },
  { to: "/cms/process", icon: Workflow, label: "Process" },
  { to: "/cms/testimonials", icon: MessageSquare, label: "Testimonials" },
  { to: "/cms/skills", icon: Wrench, label: "Skills & Tools" },
  { to: "/cms/contact", icon: Mail, label: "Contact" },
  { to: "/cms/messages", icon: Inbox, label: "Messages" },
  { to: "/cms/settings", icon: Settings, label: "Settings" },
];

export function CMSLayout({ children }: { children?: ReactNode }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("cms_user") || "admin";

  const handleLogout = () => {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_user");
    navigate("/cms/login");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#060A14] border-r border-white/5 flex flex-col shrink-0 fixed inset-y-0 left-0 z-50">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2B7FFF] to-[#5C32FF] flex items-center justify-center shadow-[0_0_15px_rgba(43,127,255,0.2)]">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide">Portfolio CMS</span>
            <span className="text-[10px] text-[#8B9DBB] font-mono">Content Manager</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-[#2B7FFF]/10 text-[#2B7FFF] font-medium border border-[#2B7FFF]/20"
                    : "text-[#8B9DBB] hover:text-white hover:bg-white/5 border border-transparent"
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#8B9DBB] hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Portfolio</span>
          </a>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-[#2B7FFF]/10 border border-[#2B7FFF]/20 flex items-center justify-center text-[#2B7FFF] text-xs font-bold">
              {username[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-[#8B9DBB] flex-1">{username}</span>
            <button onClick={handleLogout} className="text-[#8B9DBB]/50 hover:text-red-400 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[240px] min-h-screen">
        <div className="max-w-[1100px] mx-auto px-8 py-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
