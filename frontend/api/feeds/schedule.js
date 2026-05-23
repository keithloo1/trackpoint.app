export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { trainer_id } = req.query;

  if (!trainer_id) {
    return res.status(400).send('trainer_id is required');
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cehzhfsvlqqjfvmvqorx.supabase.co';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaHpoZnN2bHFxamZ2bXZxb3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzIxOTgsImV4cCI6MjA5MjQwODE5OH0.owSa24n75rp6Uf87O6OstuZZgpqO0C41H1NTDez_lxM';

    const url = `${supabaseUrl}/rest/v1/sessions?trainer_id=eq.${trainer_id}&order=date.asc,time.asc`;
    const response = await fetch(url, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase API responded with status ${response.status}`);
    }

    const sessions = await response.json();

    // Helper functions for iCal parsing (UTC+8 shift for Malaysia time zone)
    function parseDateTimeToUTC(dateStr, timeStr) {
      try {
        const [year, month, day] = dateStr.split('-').map(Number);
        const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
        let hours = 9;
        let minutes = 0;
        if (match) {
          hours = Number(match[1]);
          minutes = Number(match[2]);
          const ampm = match[3].toUpperCase();
          if (ampm === 'PM' && hours < 12) {
            hours += 12;
          } else if (ampm === 'AM' && hours === 12) {
            hours = 0;
          }
        } else {
          const parts = timeStr.split(':');
          if (parts.length >= 2) {
            hours = Number(parts[0]) || 9;
            minutes = Number(parts[1].replace(/\D/g, '')) || 0;
            if (timeStr.toLowerCase().includes('pm') && hours < 12) {
              hours += 12;
            } else if (timeStr.toLowerCase().includes('am') && hours === 12) {
              hours = 0;
            }
          }
        }
        
        // Malaysia is UTC+8, so UTC time = Local numbers - 8 hours
        const utcMs = Date.UTC(year, month - 1, day, hours, minutes, 0);
        return new Date(utcMs - 8 * 60 * 60 * 1000);
      } catch (e) {
        return new Date();
      }
    }

    function getEndTimeUTC(startDateUTC, durationStr) {
      const durationMinutes = parseInt(durationStr) || 60;
      return new Date(startDateUTC.getTime() + durationMinutes * 60 * 1000);
    }

    function formatICalUTC(date) {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    }

    // Build the iCal feed string
    const now = new Date();
    const stampStr = formatICalUTC(now);

    let icalLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TrackPoint//Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:TrackPoint Schedule',
      'X-WR-TIMEZONE:Asia/Kuala_Lumpur'
    ];

    sessions.forEach(session => {
      const isBlocked = session.type === 'Blocked';
      const summary = isBlocked ? `[Blocked] ${session.title || 'Busy Time'}` : session.title;

      const startDateUTC = parseDateTimeToUTC(session.date, session.time);
      const endDateUTC = getEndTimeUTC(startDateUTC, session.duration);

      const startStr = formatICalUTC(startDateUTC);
      const endStr = formatICalUTC(endDateUTC);

      // Escape special characters in text strings for RFC 5545
      const escapeText = (text) => {
        if (!text) return '';
        return text
          .replace(/\\/g, '\\\\')
          .replace(/,/g, '\\,')
          .replace(/;/g, '\\;')
          .replace(/\n/g, '\\n');
      };

      const cleanLocation = escapeText(session.location || 'TrackPoint HQ');
      const cleanSummary = escapeText(summary || 'Group Class');
      const cleanDesc = escapeText(
        `Type: ${session.type || 'Group Class'}\n` +
        `Duration: ${session.duration || '60 min'}\n` +
        `Capacity: ${session.capacity || 10}`
      );

      icalLines.push('BEGIN:VEVENT');
      icalLines.push(`UID:session_${session.id}@trackpoint.app`);
      icalLines.push(`DTSTAMP:${stampStr}`);
      icalLines.push(`DTSTART:${startStr}`);
      icalLines.push(`DTEND:${endStr}`);
      icalLines.push(`SUMMARY:${cleanSummary}`);
      icalLines.push(`LOCATION:${cleanLocation}`);
      icalLines.push(`DESCRIPTION:${cleanDesc}`);
      icalLines.push('STATUS:CONFIRMED');
      icalLines.push('TRANSP:OPAQUE');
      icalLines.push('END:VEVENT');
    });

    icalLines.push('END:VCALENDAR');

    const icalContent = icalLines.join('\r\n');

    // Send response with proper calendar headers
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename=schedule.ics');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    
    return res.status(200).send(icalContent);
  } catch (error) {
    return res.status(500).send(`Error generating iCal feed: ${error.message}`);
  }
}
