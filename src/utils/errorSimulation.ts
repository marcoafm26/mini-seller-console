// Global error rate configuration for API simulation
let globalErrorRate = 0.05; // 5% default error rate

export const setErrorRate = (rate: number): void => {
  globalErrorRate = Math.max(0, Math.min(1, rate)); // Clamp between 0 and 1
};

export const getErrorRate = (): number => {
  return globalErrorRate;
};

export const shouldSimulateError = (): boolean => {
  return Math.random() < globalErrorRate;
};

export const getErrorRatePercentage = (): number => {
  return Math.round(globalErrorRate * 100);
};
