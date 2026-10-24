

export const SUBJECT_COLORS = [
  '#4F46E5', '#10B981', '#F59E0B', '#EF4444',
  '#0EA5E9', '#EC4899', '#8B5CF6', '#14B8A6',
];

export const createSubject = ({ name, colorIndex = 0 }) => ({
  id: Date.now().toString(),
  name: name.trim(),
  color: SUBJECT_COLORS[colorIndex % SUBJECT_COLORS.length],
  createdAt: new Date().toISOString(),
});