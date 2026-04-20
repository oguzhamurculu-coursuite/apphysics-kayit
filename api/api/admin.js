export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Panel</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f4ff; min-height: 100vh; padding: 2rem 1rem; }
  .container { max-width: 900px; margin: 0 auto; }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
  .header h1 { font-size: 22px; font-weight: 700; color: #1a1560; }
  .btn { padding: 9px 18px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: background .15s; }
  .btn-primary { background: #534AB7; color: #fff; }
  .btn-primary:hover { background: #3C3489; }
  .btn-danger { background: #e24b4a; color: #fff; }
  .btn-success { background: #1D9E75; color: #fff; }
  .btn-sm { padding: 5px 12px; font-size: 12px; border-radius: 8px; }
  .login-box { max-width: 360px; margin: 4rem auto; background: #fff; border: 1px solid #e0deff; border-radius: 16px; padding: 2rem; }
  .login-box h2 { font-size: 18px; font-weight: 700; color: #1a1560; margin-bottom: 1rem; }
  .field { margin-bottom: 14px; }
  .field label { display: block; font-size: 13px; color: #555; margin-bottom: 4px; }
  .field input, .field select, .field textarea { width: 100%; padding: 9px 12px; border: 1.5px solid #e0deff; border-radius: 8px; font-size: 14px; outline: none; background: #fff; }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: #534AB7; }
  .field textarea { resize: vertical; min-height: 80px; font-size: 13px; }
  .err-msg { font-size: 12px; color: #e24b4a; margin-top: 8px; display: none; }
  .courses-grid { display: grid; gap: 12px; }
  .course-card { background: #fff; border: 2px solid #1D9E75; border-radius: 16px; padding: 1.2rem 1.3rem; }
  .course-card.full { border-color: #e24b4a; }
  .course-card.inactive { border-color: #ccc; opacity: .7; }
  .card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
  .card-info { flex: 1; }
  .card-tags { display: flex; gap: 5px; margin-bottom: 6px; flex-wrap: wrap; }
  .tag { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
  .tag-physics { background: #534AB7; color: #fff; }
  .tag-calculus { background: #185FA5; color: #fff; }
  .tag-active { background: #1D9E75; color: #fff; }
  .tag-full { background: #e24b4a; color: #fff; }
  .tag-inactive { background: #ccc; color: #555; }
  .card-title { font-size: 15px; font-weight: 600; color: #1a1560; margin-bottom: 3px; }
  .card-date { font-size: 12px; color: #777; }
  .card-actions { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
  .topics-list { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
  .topic { background: #f0f0ff; color: #26215C; border-radius: 6px; padding: 4px 8px; font-size: 12px; }
  .modal-bg { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100; align-items: center; justify-content: center; }
  .modal-bg.open { display: flex; }
  .modal { background: #fff; border-radius: 16px; padding: 1.5rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; margin: 1rem; }
  .modal h2 { font-size: 18px; font-weight: 700; color: #1a1560; margin-bottom: 1rem; }
  .modal-footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1rem; }
  .checkbox-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 14px; color: #333; }
  .checkbox-row input { width: 16px; height: 16px; }
  .toast { display: none; position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: #1D9E75; color: #fff; padding: 10px 24px; border-radius: 10px; font-size: 14px; font-weight: 500; z-index: 200; }
</style>
</head>
<body>
<div id="login-screen">
  <div class="login-box">
    <h2>Admin Girişi</h2>
    <div class="field">
      <label>Şifre</label>
      <input type="password" id="login-pass" placeholder="Şifrenizi girin" onkeydown="if(event.key==='Enter')doLogin()">
    </div>
    <button class="btn btn-primary" style="width:100%" onclick="doLogin()">Giriş Yap</button>
    <div class="err-msg" id="login-err">Hatalı şifre.</div>
  </div>
</div>

<div id="main-screen" style="display:none">
  <div class="container">
    <div class="header">
      <h1>Admin Paneli</h1>
      <div style="display:flex;gap:10px;align-items:center">
        <a href="/" style="font-size:13px;color:#888;text-decoration:none">← Siteye dön</a>
        <button class="btn btn-primary" onclick="openAddModal()">+ Yeni Ders</button>
      </div>
    </div>
    <div class="courses-grid" id="courses-grid"></div>
  </div>
</div>

<div class="modal-bg" id="modal-bg">
  <div class="modal">
    <h2 id="modal-title">Yeni Ders</h2>
    <div class="field"><label>Ders</label>
      <select id="f-subject">
        <option value="physics">AP Physics 1</option>
        <option value="calculus">AP Calculus BC</option>
      </select>
    </div>
    <div class="field"><label>Başlık</label><input type="text" id="f-title" placeholder="ör. Series & Taylor"></div>
    <div class="field"><label>Tarih</label><input type="text" id="f-date" placeholder="ör. Mon, Apr 21"></div>
    <div class="field"><label>Saat</label><input type="text" id="f-time" placeholder="ör. 14:30–16:30 veya TBA"></div>
    <div class="field"><label>Süre</label><input type="text" id="f-duration" placeholder="ör. 2h"></div>
    <div class="field"><label>Konular (her satıra bir konu)</label>
      <textarea id="f-topics" placeholder="Infinite Sequences & Series&#10;Taylor & Maclaurin"></textarea>
    </div>
    <div class="checkbox-row"><input type="checkbox" id="f-online" checked><label for="f-online">Online</label></div>
    <div class="checkbox-row"><input type="checkbox" id="f-active" checked><label for="f-active">Aktif (kayıt açık)</label></div>
    <div class="checkbox-row"><input type="checkbox" id="f-full"><label for="f-full">Dolu</label></div>
    <div class="modal-footer">
      <button class="btn" style="background:#f0f0f0;color:#333" onclick="closeModal()">İptal</button>
      <button class="btn btn-primary" onclick="saveModal()">Kaydet</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
let password = '';
let courses = [];
let editingId = null;

function doLogin() {
  const pass = document.getElementById('login-pass').value;
  if (!pass) return;
  password = pass;
  loadCourses();
}

async function loadCourses() {
  try {
    const res = await fetch('/api/courses');
    courses = await res.json();
    if (!Array.isArray(courses)) throw new Error();
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'block';
    renderCourses();
  } catch(e) {
    document.getElementById('login-err').style.display = 'block';
    document.getElementById('login-err').textContent = 'Bağlantı hatası.';
  }
}

function renderCourses() {
  const grid = document.getElementById('courses-grid');
  grid.innerHTML = courses.map(c => \`
    <div class="course-card \${c.full ? 'full' : !c.active ? 'inactive' : ''}">
      <div class="card-top">
        <div class="card-info">
          <div class="card-tags">
            <span class="tag tag-\${c.subject}">\${c
