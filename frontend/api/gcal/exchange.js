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

  const { code, trainer_id } = req.body;

  if (!code || !trainer_id) {
    return res.status(400).json({ error: 'code and trainer_id are required' });
  }

  try {
    const client_id = process.env.VITE_GOOGLE_CLIENT_ID || '1036495166418-fallbacksynthesizerdefault.apps.googleusercontent.com';
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;

    if (!client_secret) {
      return res.status(500).json({ error: 'Server error: GOOGLE_CLIENT_SECRET is not configured on Vercel.' });
    }

    // 1. Exchange auth code for Google tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri: 'postmessage',
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      throw new Error(`Google token exchange failed: ${errText}`);
    }

    const tokens = await tokenResponse.json();
    const refreshToken = tokens.refresh_token;
    const accessToken = tokens.access_token;
    const expiresAt = Date.now() + (tokens.expires_in || 3600) * 1000;

    if (!refreshToken) {
      console.warn("Google did not return a refresh token. User may need to unlink and link again.");
    }

    // 2. Save the gcal_refresh_token to Supabase profiles
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cehzhfsvlqqjfvmvqorx.supabase.co';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaHpoZnN2bHFxamZ2bXZxb3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzIxOTgsImV4cCI6MjA5MjQwODE5OH0.owSa24n75rp6Uf87O6OstuZZgpqO0C41H1NTDez_lxM';

    const updateUrl = `${supabaseUrl}/rest/v1/profiles?id=eq.${trainer_id}`;
    
    // Only update if we actually received a refresh token from Google
    if (refreshToken) {
      const supabaseRes = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gcal_refresh_token: refreshToken
        }),
      });

      if (!supabaseRes.ok) {
        const supErr = await supabaseRes.text();
        throw new Error(`Supabase profile update failed: ${supErr}`);
      }
    }

    return res.status(200).json({
      success: true,
      access_token: accessToken,
      expires_at: expiresAt,
      has_refresh_token: !!refreshToken
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
