export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { action, sessionData, trainer_id } = req.body;

  if (!action || !sessionData || !trainer_id) {
    return res.status(400).json({ error: 'action, sessionData, and trainer_id are required' });
  }

  try {
    const client_id = process.env.VITE_GOOGLE_CLIENT_ID || '1036495166418-fallbacksynthesizerdefault.apps.googleusercontent.com';
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;

    if (!client_secret) {
      return res.status(500).json({ error: 'Server error: GOOGLE_CLIENT_SECRET is not configured on Vercel.' });
    }

    // 1. Fetch gcal_refresh_token from Supabase profiles
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cehzhfsvlqqjfvmvqorx.supabase.co';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaHpoZnN2bHFxamZ2bXZxb3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzIxOTgsImV4cCI6MjA5MjQwODE5OH0.owSa24n75rp6Uf87O6OstuZZgpqO0C41H1NTDez_lxM';

    const getProfileUrl = `${supabaseUrl}/rest/v1/profiles?id=eq.${trainer_id}&select=gcal_refresh_token`;
    const profileRes = await fetch(getProfileUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      }
    });

    if (!profileRes.ok) {
      const errTxt = await profileRes.text();
      throw new Error(`Failed to fetch trainer profile from Supabase: ${errTxt}`);
    }

    const profiles = await profileRes.json();
    const refresh_token = profiles[0]?.gcal_refresh_token;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Google Calendar integration is not linked or has been unlinked (missing refresh token).' });
    }

    // 2. Fetch fresh access token from Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id,
        client_secret,
        refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      throw new Error(`Failed to refresh Google access token: ${errText}`);
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    // Helper functions for iCal parsing (UTC+8 shift)
    const parseDateTimeToISO = (dateStr, timeStr, durationStr, isEnd = false) => {
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

        let dt = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
        dt = new Date(dt.getTime() - 8 * 60 * 60 * 1000);

        if (isEnd) {
          const durationMinutes = parseInt(durationStr) || 60;
          dt = new Date(dt.getTime() + durationMinutes * 60 * 1000);
        }

        return dt.toISOString();
      } catch (e) {
        return new Date().toISOString();
      }
    };

    const googleEventId = sessionData.id.replace(/-/g, '').toLowerCase();

    // 3. Process the DELETE request
    if (action === 'DELETE') {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok && response.status !== 404) {
        const errText = await response.text();
        throw new Error(`Google Calendar API DELETE failed: ${errText}`);
      }
      return res.status(200).json({ success: true, action: 'DELETE' });
    }

    // Prepare Event Payload for CREATE / UPDATE
    const startISO = parseDateTimeToISO(sessionData.date, sessionData.time, sessionData.duration, false);
    const endISO = parseDateTimeToISO(sessionData.date, sessionData.time, sessionData.duration, true);

    const eventPayload = {
      id: googleEventId,
      summary: sessionData.title || 'Group Class',
      location: sessionData.location || 'TrackPoint HQ',
      description: `Type: ${sessionData.type || 'Group Class'}\nDuration: ${sessionData.duration || '60 min'}\nCapacity: ${sessionData.capacity || 10}`,
      start: {
        dateTime: startISO,
        timeZone: 'Asia/Kuala_Lumpur'
      },
      end: {
        dateTime: endISO,
        timeZone: 'Asia/Kuala_Lumpur'
      },
      status: 'confirmed'
    };

    // Helper function for creating the event
    const createEvent = async () => {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPayload)
      });
      return response;
    };

    // Helper function for updating the event
    const updateEvent = async () => {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPayload)
      });
      return response;
    };

    let response;
    let actualAction = action;

    if (action === 'CREATE') {
      response = await createEvent();
      if (!response.ok && response.status === 409) {
        // Event already exists, fallback to update
        response = await updateEvent();
        actualAction = 'UPDATE';
      }
    } else if (action === 'UPDATE') {
      response = await updateEvent();
      if (!response.ok && response.status === 404) {
        // Event doesn't exist, fallback to create
        response = await createEvent();
        actualAction = 'CREATE';
      }
    }

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(`Google Calendar API failed: ${errData.error?.message || response.statusText}`);
    }

    return res.status(200).json({ success: true, action: actualAction });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
