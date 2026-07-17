export type ProjectKey = "la-fortuna" | "campo-grande-1" | "campo-grande-2" | "campo-grande-3";

export type FinancingConfig = {
  systemName: string;
  referencePriceUsd: number;
  priceMinUsd: number;
  priceMaxUsd: number;
  staticAnnualRate?: number;
  annualRateByYears?: Record<number, number>;
};

export const financingByProject: Record<ProjectKey, FinancingConfig> = {
  "campo-grande-1": {
    systemName: "Campo Grande",
    referencePriceUsd: 29930,
    priceMinUsd: 10785,
    priceMaxUsd: 36014,
    staticAnnualRate: 12,
  },
  "campo-grande-2": {
    systemName: "Campo Grande II",
    referencePriceUsd: 24040.52,
    priceMinUsd: 8829,
    priceMaxUsd: 54984,
    staticAnnualRate: 12,
  },
  "campo-grande-3": {
    systemName: "Campo Grande III",
    referencePriceUsd: 7500,
    priceMinUsd: 5054,
    priceMaxUsd: 64617,
    staticAnnualRate: 12,
  },
  "la-fortuna": {
    systemName: "La Fortuna",
    referencePriceUsd: 5230.94,
    priceMinUsd: 3015,
    priceMaxUsd: 10708,
    annualRateByYears: {
      1: 6,
      2: 6.5,
      3: 7,
      4: 7.5,
      5: 8,
      6: 8.5,
      7: 9,
      8: 10,
      9: 11,
      10: 12,
    },
  },
};

export function getAnnualRate(projectKey: ProjectKey, years: number) {
  const config = financingByProject[projectKey];
  if (config.staticAnnualRate !== undefined) return config.staticAnnualRate;
  const rate = config.annualRateByYears?.[years];
  if (rate === undefined) throw new RangeError(`No existe una tasa configurada para ${years} años.`);
  return rate;
}

export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateFrenchMonthlyPayment(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return roundCurrency(principal / months);
  const payment = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  return roundCurrency(payment);
}

export function calculateFinanceEstimate(projectKey: ProjectKey, price: number, initial: number, years: number) {
  const months = years * 12;
  const annualRate = getAnnualRate(projectKey, years);
  const principal = roundCurrency(Math.max(0, price - initial));
  return {
    annualRate,
    months,
    principal,
    monthlyPayment: calculateFrenchMonthlyPayment(principal, annualRate, months),
  };
}
