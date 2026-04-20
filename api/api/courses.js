const DEFAULT_COURSES = [
  { id: "ph1", subject: "physics", title: "Conceptual Marathon — Rotational & SHM", date: "Thu, Apr 16", time: "11:00 / 19:30", duration: "", online: true, active: false, full: true, topics: ["Rotational Dynamics", "Simple Harmonic Motion", "Logic-Based Questions"] },
  { id: "bc1", subject: "calculus", title: "Series & Taylor", date: "Mon, Apr 14", time: "15:30–17:30", duration: "2h", online: true, active: false, full: true, topics: ["Infinite Sequences & Series", "Taylor & Maclaurin", "Power Series I & II", "Lagrange Error Bound"] },
  { id: "bc2", subject: "calculus", title: "Parametric, Polar & Vector", date: "Tue, Apr 15", time: "14:30–16:30", duration: "2h", online: true, active: false, full: true, topics: ["Parametric & Vector Calculus", "Polar Intro & Derivatives", "Polar Area"] },
  { id: "ph2", subject: "physics", title: "Rotational Motion and Simple Harmonic Motion", date: "Mon, Apr 21", time: "14:30–16:30", duration: "2h", online: true, active: true, full: false, topics: ["Rotational Motion", "SHM"] },
  { id: "bc3", subject: "calculus", title: "Series & Taylor", date: "Fri, Apr 25", time: "TBA", duration: "", online: true, active: true, full: false, topics: ["Infinite Sequences & Series", "Taylor & Maclaurin", "Power Series I & II", "Lagrange Error Bound"] },
  { id: "bc4", subject: "calculus", title: "Series & Taylor", date: "Wed, Apr 22", time: "17:00–19:00", duration: "2h", online: true, active: true, full: false, topics: ["Infinite Sequences & Series", "Taylor & Maclaurin", "Power Series I & II", "Lagrange Error Bound"] }
];

async function redis(method, ...args) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const res = await fetch(`${url}/${method}/${args.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.result;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const data = await redis('get', 'courses');
      const courses = data ? JSON.parse(data) : DEFAULT_COURSES;
      return res.status(200).json(courses);
    } catch (e) {
      return res.status(200).json(DEFAULT_COURSES);
    }
  }

  if (req.method === 'POST') {
    const adminPass = req.headers['x-admin-password'];
    if (adminPass !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Yetkisiz' });
    }
    try {
      const courses = req.body;
      await redis('set', 'courses', JSON.stringify(courses));
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
}
