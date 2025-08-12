export function generateICS(options: {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
}): string {
  const dt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lucero Rodriguez Morales//Bookings//ES',
    'BEGIN:VEVENT',
    `UID:${crypto.randomUUID()}`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(options.start)}`,
    `DTEND:${dt(options.end)}`,
    `SUMMARY:${options.title}`,
    options.description ? `DESCRIPTION:${options.description}` : '',
    options.location ? `LOCATION:${options.location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\n');
}
