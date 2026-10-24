

export const DAYS = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export const createSession = ({
  subject,
  day,
  startTime,
  endTime,
  notes = '',
}) => ({
  id: Date.now().toString(),
  subject: subject.trim(),
  day,
  startTime: startTime.trim(),
  endTime: endTime.trim(),
  notes: notes.trim(),
  createdAt: new Date().toISOString(),
});