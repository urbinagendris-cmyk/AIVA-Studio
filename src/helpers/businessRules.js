/**
 * Helpers y funciones puras para reglas de negocio en AIVA Studio
 */

// Formateador de moneda / créditos
export const formatCredits = (amount) => {
  return new Intl.NumberFormat("es-CO").format(amount);
};

// Formateador de tiempo (segundos a mm:ss)
export const formatDuration = (totalSeconds = 0) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

/**
 * REGLA 1: Cálculo del costo en créditos para renderizar video.
 * @param {number} durationSeconds - Duración en segundos.
 * @param {number} costPerSecond - Costo por segundo configurado en el modelo de IA.
 * @returns {number} Costo total en créditos.
 */
export const calculateRenderCost = (durationSeconds, costPerSecond) => {
  const duration = Math.max(0, Number(durationSeconds) || 0);
  const cost = Math.max(0, Number(costPerSecond) || 0);
  return duration * cost;
};

/**
 * REGLA 2: Bonificación por recarga.
 * Otorga un 20% extra de créditos si el monto es mayor o igual a 500 créditos.
 * @param {number} amount - Monto nominal de créditos a comprar.
 * @returns {{ bonus: number, total: number, hasBonus: boolean }}
 */
export const calculateCreditRecharge = (amount) => {
  const nominal = Math.max(0, Number(amount) || 0);
  const hasBonus = nominal >= 500;
  const bonus = hasBonus ? Math.floor(nominal * 0.2) : 0;

  return {
    nominal,
    bonus,
    total: nominal + bonus,
    hasBonus,
  };
};

/**
 * Validador de saldo disponible contra costo estimado.
 * @param {number} availableCredits - Créditos actuales del usuario.
 * @param {number} requiredCredits - Costo calculado de la operación.
 * @returns {boolean} True si tiene fondos suficientes.
 */
export const hasSufficientCredits = (availableCredits, requiredCredits) => {
  return (Number(availableCredits) || 0) >= (Number(requiredCredits) || 0);
};