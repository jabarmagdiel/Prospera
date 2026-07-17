# Auditoría del simulador financiero de Prospera

Fecha de contraste: 12/07/2026  
Alcance: lectura del formulario de venta, parámetros por urbanización y generación de planes de pago sin registrar operaciones.

## Hallazgo

El simulador anterior no reproducía el sistema interno. Calculaba:

`(USD 9.800 - inicial) / (años × 12)`

Ese cálculo suponía interés cero, usaba un valor fijo no vinculado a un lote, iniciaba en USD 99 y solo permitía hasta 7 años.

## Lógica verificada en el sistema

1. El monto del terreno se obtiene de superficie por valor unitario.
2. El saldo a financiar descuenta la cuota inicial, el descuento y cualquier anticipo de reserva.
3. La modalidad activa es el sistema francés de cuota fija.
4. La tasa mensual utilizada es la tasa anual dividida entre 12.
5. Los plazos configurados van de 1 a 10 años.
6. Al seleccionar una venta a crédito, el formulario interno carga USD 100 como cuota inicial base; el campo puede modificarse.

Fórmula replicada en la web:

`cuota = saldo × tasa_mensual / (1 - (1 + tasa_mensual)^(-número_de_cuotas))`

## Tasas observadas

| Proyecto en la web | Proyecto en el sistema | Tasa anual |
|---|---|---:|
| Campo Grande 1 | Campo Grande | 12 % para 1–10 años |
| Campo Grande 2 | Campo Grande II | 12 % para 1–10 años |
| Campo Grande 3 | Campo Grande III | 12 % para 1–10 años |
| La Fortuna | La Fortuna | 6 %, 6,5 %, 7 %, 7,5 %, 8 %, 8,5 %, 9 %, 10 %, 11 % y 12 % para 1–10 años respectivamente |

## Casos contrastados

| Caso | Saldo | Plazo | Tasa | Cuota del sistema | Cuota de la web |
|---|---:|---:|---:|---:|---:|
| Campo Grande III | USD 7.401,00 | 84 meses | 12 % | USD 130,65 | USD 130,65 |
| Campo Grande III | USD 7.400,00 | 120 meses | 12 % | USD 106,17 | USD 106,17 |
| Campo Grande | USD 29.830,00 | 84 meses | 12 % | USD 526,58 | USD 526,58 |
| Campo Grande II | USD 23.940,52 | 60 meses | 12 % | USD 532,54 | USD 532,54 |
| La Fortuna | USD 5.130,94 | 84 meses | 9 % | USD 82,55 | USD 82,55 |

## Límites deliberados de la versión pública

- No se conecta directamente al sistema interno ni publica su inventario.
- No confirma disponibilidad en tiempo real.
- No incluye seguro, descuento o anticipos de reserva porque dependen de la operación concreta.
- Simula en dólares. Una operación en bolivianos debe usar el tipo de cambio configurado por Prospera para la fecha de registro, no un valor fijo ni la frase “tipo de cambio oficial”.
- La cotización final debe asociarse a un lote específico y validarse con un asesor.

## Pruebas automatizadas

Los casos anteriores están incorporados en `tests/finance.test.ts`. La compilación y el conjunto de pruebas deben pasar antes de publicar una versión.
