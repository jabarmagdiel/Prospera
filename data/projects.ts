import type { Audience, Project } from "../lib/types";

export const projects: Project[] = [
  {
    key: "la-fortuna",
    systemId: 5,
    name: "La Fortuna",
    family: "Expansión · entrada accesible",
    short: "LF",
    description: "Un proyecto con alternativas para empezar, comparar ubicaciones y construir patrimonio paso a paso.",
    tone: "villa",
    plan: "/projects/la-fortuna-plan.jpg",
    planAlt: "Plano general de la urbanización La Fortuna",
    surfaceRange: "274–683 m²",
    planDate: "12/07/2026",
  },
  {
    key: "campo-grande-1",
    systemId: 1,
    name: "Campo Grande 1",
    family: "Vivienda · etapa consolidada",
    short: "CG1",
    description: "Una etapa madura del macroproyecto para comparar ubicación y oportunidades según disponibilidad.",
    tone: "cg-one",
    logo: "/brand/campo-grande.png",
    plan: "/projects/campo-grande-1-plan.jpg",
    planAlt: "Plano general de Campo Grande 1",
    surfaceRange: "299–787 m²",
    planDate: "12/07/2026",
  },
  {
    key: "campo-grande-2",
    systemId: 2,
    name: "Campo Grande 2",
    family: "Vivienda · equilibrio y avance",
    short: "CG2",
    description: "Una alternativa para quienes quieren proyectar vivienda y avanzar dentro de un entorno en consolidación.",
    tone: "cg-two",
    logo: "/brand/campo-grande.png",
    plan: "/projects/campo-grande-2-plan.jpg",
    planAlt: "Plano general de Campo Grande 2",
    surfaceRange: "259–1.412 m²",
    planDate: "12/07/2026",
  },
  {
    key: "campo-grande-3",
    systemId: 3,
    name: "Campo Grande 3",
    family: "Inversión · visión de futuro",
    short: "CG3",
    description: "Una etapa para quienes buscan entrar a tiempo, entender la oportunidad y construir patrimonio a futuro.",
    tone: "cg-three",
    logo: "/brand/campo-grande.png",
    plan: "/projects/campo-grande-3-plan.jpg",
    planAlt: "Plano general de Campo Grande 3",
    surfaceRange: "202–1.256 m²",
    planDate: "12/07/2026",
  },
];

export const audiences: Record<Audience, { label: string; eyebrow: string; text: string; cta: string }> = {
  "santa-cruz": {
    label: "Estoy en Santa Cruz",
    eyebrow: "Visita en terreno",
    text: "Conocé la ubicación, recorré el proyecto y conversá con un asesor sin compromiso.",
    cta: "Agendar visita presencial",
  },
  bolivia: {
    label: "Estoy en otra ciudad de Bolivia",
    eyebrow: "La Paz, Oruro y todo el país",
    text: "Primero hacemos una videollamada, revisamos mapa y documentos, y luego coordinamos tu visita.",
    cta: "Coordinar visita asistida",
  },
  exterior: {
    label: "Estoy fuera de Bolivia",
    eyebrow: "Acompañamiento a distancia",
    text: "Recorré el proyecto por video en vivo, incorporá a tu familia y entendé cada paso antes de decidir.",
    cta: "Agendar visita virtual",
  },
};

export const journey = [
  ["01", "Explorá", "Ubicación, recorrido y estado actual en un solo lugar."],
  ["02", "Conversá", "Un asesor entiende tu objetivo y responde con claridad."],
  ["03", "Verificá", "Revisá documentos, disponibilidad y condiciones vigentes."],
  ["04", "Visitá", "Elegí recorrido presencial o videollamada desde el terreno."],
] as const;
