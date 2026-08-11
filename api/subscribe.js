export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, first_name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const response = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_3a5cfd67-2c37-4585-81bc-f1b21b59ee1c/subscriptions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
        },
        body: JSON.stringify({
          email,
          first_name: first_name || undefined,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: 'cashien_waitlist',
          utm_medium: 'organic'
        })
      }
    );

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const data = await response.json();
      return res.status(400).json({ error: data.message || 'Signup failed' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
