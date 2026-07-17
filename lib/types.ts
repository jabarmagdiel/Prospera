import type { ProjectKey } from "./finance";

export type Audience = "santa-cruz" | "bolivia" | "exterior";
export type VisitType = "virtual" | "presencial";

export type Project = {
  key: ProjectKey;
  systemId: 1 | 2 | 3 | 5;
  name: string;
  family: string;
  short: string;
  description: string;
  tone: string;
  logo?: string;
  plan: string;
  planAlt: string;
  surfaceRange: string;
  planDate: string;
  gallery?: string[];
};

export type SelectedLot = {
  markerId: string;
  projectName: string;
  uv: string;
  manzano: string;
  lote: string;
  surface: number;
  priceUsd: number;
  status: string;
};
