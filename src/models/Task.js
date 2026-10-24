// Model: describes what a study task looks like.

export const PRIORITIES = ['Low', 'Medium', 'High'];

export const createTask = ({
  title,
  subject = '',
  dueDate = '',
  priority = 'Medium',
  notes = '',
}) => ({
  id: Date.now().toString(),
  title: title.trim(),
  subject: subject.trim(),
  dueDate,
  priority,
  notes: notes.trim(),
  completed: false,
  createdAt: new Date().toISOString(),
});