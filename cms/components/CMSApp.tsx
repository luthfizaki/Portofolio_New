import { type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CMSLayout } from "./CMSLayout";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { HeroEditor } from "./HeroEditor";
import { AboutEditor } from "./AboutEditor";
import { ExperienceEditor } from "./ExperienceEditor";
import { ProjectList } from "./ProjectList";
import { ProjectEditor } from "./ProjectEditor";
import { ProcessEditor } from "./ProcessEditor";
import { TestimonialsEditor } from "./TestimonialsEditor";
import { SkillsEditor } from "./SkillsEditor";
import { ContactEditor } from "./ContactEditor";
import { MessagesEditor } from "./MessagesEditor";
import { SettingsEditor } from "./SettingsEditor";

function AuthGuard({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("cms_token");
  if (!token) return <Navigate to="/cms/login" replace />;
  return <>{children}</>;
}

export function CMSApp() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        path="*"
        element={
          <AuthGuard>
            <CMSLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Navigate to="/cms/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="hero" element={<HeroEditor />} />
        <Route path="about" element={<AboutEditor />} />
        <Route path="experience" element={<ExperienceEditor />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/new" element={<ProjectEditor />} />
        <Route path="projects/:id" element={<ProjectEditor />} />
        <Route path="process" element={<ProcessEditor />} />
        <Route path="testimonials" element={<TestimonialsEditor />} />
        <Route path="skills" element={<SkillsEditor />} />
        <Route path="contact" element={<ContactEditor />} />
        <Route path="messages" element={<MessagesEditor />} />
        <Route path="settings" element={<SettingsEditor />} />
      </Route>
    </Routes>
  );
}
