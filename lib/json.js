export const parseJson = (s, fb = []) => {
  try { const v = JSON.parse(s); return Array.isArray(v) ? v : fb; } catch { return fb; }
};
