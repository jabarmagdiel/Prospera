"use client";

import { useState } from "react";
import { CorporateHome } from "../components/corporate-home";
import { ProjectDetail } from "../components/project-detail";
import { Header } from "../components/header";
import type { Project } from "../lib/types";

export function HomeClient({ initialSettings }: { initialSettings: any }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  function openProject(project: Project) {
    setSelectedProject(project);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 20);
  }

  if (selectedProject) {
    return (
      <ProjectDetail
        key={selectedProject.key}
        project={selectedProject}
        allProjects={initialSettings.projects}
        onSelectProject={openProject}
        onBack={() => {
          setSelectedProject(null);
          window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 20);
        }}
      />
    );
  }

  return <CorporateHome onOpenProject={openProject} projects={initialSettings.projects} content={initialSettings.content} />;
}
