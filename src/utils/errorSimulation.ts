let globalErrorRate = 0.1;

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
