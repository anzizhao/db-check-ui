export const PERFORMANCE_START = 'PERFORMANCE_START';
export const PERFORMANCE_END = 'PERFORMANCE_END';

export function startPerformance() {
  return {
    type: PERFORMANCE_START,
  };
}
export function endPerformance() {
  return {
    type: PERFORMANCE_END,
  };
}
