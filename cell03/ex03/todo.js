// ---------- cookie helpers ----------
const COOKIE_NAME = "ft_todos";
function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days*864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}
function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[-.$?*|{}()[\]\\/+^]/g,'\\$&') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

// ---------- DOM refs ----------
const list = document.getElementById('ft_list');
const btnNew = document.getElementById('new');
const placeholder = document.getElementById('placeholder');

// ---------- core ----------
function updatePlaceholder() {
  placeholder.hidden = list.children.length > 0;
}

// สร้าง div งาน และติด handler ลบ
function createTodo(text) {
  const div = document.createElement('div');
  div.className = 'todo';
  div.textContent = text;
  div.addEventListener('click', () => {
    if (confirm('Do you want to remove this TO DO?')) {
      div.remove();
      saveToCookie();
      updatePlaceholder();
    }
  });
  return div;
}

// เพิ่มงาน (ไว้บนสุด) — ใช้ flex column-reverse จึง append ได้ผลบนสุด
function addTodo(text) {
  list.append(createTodo(text));
  saveToCookie();
  updatePlaceholder();
}

// เซฟรายการทั้งหมดเป็น array -> cookie
function saveToCookie() {
  const items = Array.from(list.children).map(el => el.textContent);
  setCookie(COOKIE_NAME, JSON.stringify(items));
}

// โหลดจาก cookie
function loadFromCookie() {
  const raw = getCookie(COOKIE_NAME);
  if (!raw) { updatePlaceholder(); return; }
  try {
    const arr = JSON.parse(raw);
    // เติมเรียงจากล่างขึ้นบน เพื่อให้ตอน append แล้วโชว์ถูก (เราใช้ column-reverse)
    arr.forEach(text => list.append(createTodo(text)));
  } catch { /* ignore bad cookie */ }
  updatePlaceholder();
}

// ---------- events ----------
btnNew.addEventListener('click', () => {
  const t = prompt('Enter a new TO DO:');
  if (t && t.trim() !== '') addTodo(t.trim());
});

// ---------- init ----------
loadFromCookie();