const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\migue\\.gemini\\antigravity-ide\\brain\\182d93b2-48bb-4cdb-9b81-e6631b85a50d\\.system_generated\\steps\\905\\content.md', 'utf-8');

let mainStart = content.indexOf('<main class="corporate-site">');
let mainEnd = content.indexOf('</main>') + 7;
let mainHtml = content.substring(mainStart, mainEnd);

mainHtml = mainHtml.replace(/class=/g, 'className=');
mainHtml = mainHtml.replace(/for=/g, 'htmlFor=');
mainHtml = mainHtml.replace(/<!-- -->/g, '');

let projectGridStart = mainHtml.indexOf('<div className="project-grid">');
let projectGridEnd = mainHtml.indexOf('</div><p className="portfolio-note">') + 6;

const dynamicProjects = '\n<div className="project-grid">\n  {projects && projects.length > 0 ? projects.map((p, idx) => (\n    <button key={p.key || idx} className="project-card villa" onClick={() => onOpenProject(p)}>\n      <span className="project-index">0{idx + 1}</span>\n      <div className="project-art">\n        <img src={p.gallery && p.gallery.length > 0 ? p.gallery[0] : (p.logo || "/images/about.png")} alt={p.name} />\n        <span className="phase-stamp">{p.family}</span>\n      </div>\n      <div className="project-card-copy">\n        <small>{p.short}</small>\n        <h3>{p.name}</h3>\n        <p>{p.description}</p>\n        <span className="project-link">Conocer {p.name} <i>→</i></span>\n      </div>\n    </button>\n  )) : (\n    <p>No hay proyectos disponibles</p>\n  )}\n</div>\n';

mainHtml = mainHtml.substring(0, projectGridStart) + dynamicProjects + mainHtml.substring(projectGridEnd);

let heroStageStart = mainHtml.indexOf('<div className="corp-hero-stage">');
let heroStageEnd = mainHtml.indexOf('</div></section>', heroStageStart) + 6;

let heroCarouselCode = '\n<div className="corp-hero-stage relative overflow-hidden">\n  <div className="sun-disc relative z-10"></div>\n  <div className="horizon horizon-one relative z-10"></div>\n  <div className="horizon horizon-two relative z-10"></div>\n  <div className="corp-logo-panel relative z-10">\n    <img src="/brand/prospera.png" alt="Prospera" />\n    <span>Desarrollamos oportunidades para vivir, invertir y construir futuro.</span>\n  </div>\n  <div className="portfolio-count relative z-10">\n    <b>Desde</b><strong>Santa Cruz</strong><span>planificamos el futuro con vos</span>\n  </div>\n  <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none">\n    <HeroCarousel />\n  </div>\n</div>\n';

mainHtml = mainHtml.substring(0, heroStageStart) + heroCarouselCode + mainHtml.substring(heroStageEnd);

// Wrap in component
const reactComponent = `"use client";

import { useState } from "react";
import type { Project } from "../lib/types";
import { HeroCarousel } from "./hero-carousel";

export function CorporateHome({ onOpenProject, content, projects }: { onOpenProject: (project: Project) => void, content?: any, projects?: any[] }) {
  const [toast, setToast] = useState("");

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3600);
  }

  return (
    ${mainHtml}
  );
}
`;

fs.writeFileSync('c:/Users/migue/Desktop/marketing/empresa_de_terreno/Prospera_VSCode_Estructurado/prospera-site/components/corporate-home.tsx', reactComponent);
console.log("Restored CorporateHome from URL HTML successfully!");
