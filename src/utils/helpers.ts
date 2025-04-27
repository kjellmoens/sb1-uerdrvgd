export function generateId(): string {
  // Use crypto.randomUUID() to generate proper UUIDs
  return crypto.randomUUID();
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return '';
  
  // Format the date as Month Year (e.g., "January 2025")
  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}