import assert from "node:assert/strict";
import test from "node:test";
import { calculateFinanceEstimate, calculateFrenchMonthlyPayment, getAnnualRate } from "../lib/finance";

test("replica la cuota generada por el sistema para Campo Grande III a 7 años", () => {
  assert.equal(calculateFrenchMonthlyPayment(7401, 12, 84), 130.65);
});

test("replica los casos contrastados contra el generador interno", () => {
  assert.equal(calculateFrenchMonthlyPayment(7400, 12, 120), 106.17);
  assert.equal(calculateFrenchMonthlyPayment(29830, 12, 84), 526.58);
  assert.equal(calculateFrenchMonthlyPayment(23940.52, 12, 60), 532.54);
  assert.equal(calculateFrenchMonthlyPayment(5130.94, 9, 84), 82.55);
});

test("usa tasa estática en Campo Grande y dinámica en La Fortuna", () => {
  assert.equal(getAnnualRate("campo-grande-3", 1), 12);
  assert.equal(getAnnualRate("campo-grande-3", 10), 12);
  assert.equal(getAnnualRate("la-fortuna", 1), 6);
  assert.equal(getAnnualRate("la-fortuna", 7), 9);
  assert.equal(getAnnualRate("la-fortuna", 10), 12);
});

test("calcula saldo, tasa, número de cuotas y cuota mensual", () => {
  assert.deepEqual(calculateFinanceEstimate("campo-grande-3", 7500, 100, 10), {
    annualRate: 12,
    months: 120,
    principal: 7400,
    monthlyPayment: 106.17,
  });
});
