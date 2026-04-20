export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, email, session } = req.body;

  if (!name || !phone || !session) {
    return res.status(400).json({ error: 'Eksik bilgi' });
  }

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;
  const SHEETS_URL = process.env.SHEETS_URL;

  const message = `🎯 Yeni Kayıt!\n\n📚 ${session}\n\n👤 ${name}\n📞 ${phone}${email ? '\n📧 ' + email : ''}`;

  try {
    await Promise.all([
      fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
      }),
      fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, session })
      })
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Hata oluştu' });
  }
}
