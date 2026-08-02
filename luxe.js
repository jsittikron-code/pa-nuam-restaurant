/* ==================================================================
   luxe.js — ตัวขับเคลื่อนลูกเล่นภาพ (ทำงานคู่กับ luxe.css)
   ไม่ยุ่งกับข้อมูลหรือตรรกะการขายเลย ลบไฟล์นี้ออกระบบยังทำงานครบ
   ================================================================== */
(function () {
  'use strict';

  // ถ้าผู้ใช้ตั้งค่า "ลดการเคลื่อนไหว" ในเครื่อง ให้ข้ามลูกเล่นทั้งหมด
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1) ละอองไฟลอยขึ้น ---------- */
  function embers(n) {
    const box = document.querySelector('.embers');
    if (!box || calm) return;
    for (let i = 0; i < n; i++) {
      const e = document.createElement('span');
      e.className = 'ember';
      e.style.left = Math.random() * 100 + '%';
      e.style.animationDuration = (13 + Math.random() * 16) + 's';
      e.style.animationDelay = (-Math.random() * 25) + 's';
      e.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
      const s = 2 + Math.random() * 2.5;
      e.style.width = e.style.height = s + 'px';
      box.appendChild(e);
    }
  }

  /* ---------- 2) ม่านเปิดร้าน ---------- */
  function intro() {
    const el = document.getElementById('intro');
    if (!el) return;
    const close = () => el.classList.add('gone');
    if (calm) return close();
    setTimeout(close, 1250);
    el.addEventListener('click', close);          // กดข้ามได้
  }

  /* ---------- 3) ค่อย ๆ ลอยขึ้นเมื่อเลื่อนถึง ---------- */
  const seen = new WeakSet();
  const io = 'IntersectionObserver' in window && !calm
    ? new IntersectionObserver((rows) => {
        rows.forEach(r => { if (r.isIntersecting) { r.target.classList.add('in'); io.unobserve(r.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 })
    : null;

  function reveal(scope) {
    if (!io) return;
    const list = (scope || document).querySelectorAll('.pc:not(.rv)');
    list.forEach((el, i) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add('rv');
      el.style.transitionDelay = (i % 12) * 45 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- 4) การ์ดเอียงตามเมาส์ (ทำงานกับการ์ดที่วาดใหม่ด้วย) ---------- */
  function tilt(grid) {
    if (calm) return;
    grid.addEventListener('mousemove', e => {
      const c = e.target.closest('.pc');
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;   // -0.5 … 0.5
      const y = (e.clientY - r.top) / r.height - .5;
      c.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
      c.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg');
    });
    grid.addEventListener('mouseleave', () => {
      grid.querySelectorAll('.pc').forEach(c => {
        c.style.removeProperty('--rx'); c.style.removeProperty('--ry');
      });
    }, true);
  }

  /* ---------- 5) คลื่นกระเพื่อมตอนกดปุ่ม ---------- */
  document.addEventListener('pointerdown', e => {
    if (calm) return;
    const b = e.target.closest('.btn, .chip, .opt, .seg button, .add');
    if (!b) return;
    const r = b.getBoundingClientRect();
    const d = Math.max(r.width, r.height);
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.width = s.style.height = d + 'px';
    s.style.left = (e.clientX - r.left - d / 2) + 'px';
    s.style.top = (e.clientY - r.top - d / 2) + 'px';
    b.appendChild(s);
    setTimeout(() => s.remove(), 620);
  });

  /* ---------- 6) ตัวเลขเด้งเมื่อค่าเปลี่ยน ---------- */
  function watchNumber(el, cls) {
    if (!el || calm) return;
    let last = el.textContent;
    new MutationObserver(() => {
      if (el.textContent === last) return;
      last = el.textContent;
      const t = cls ? el.closest('.kpi') : el;
      if (!t) return;
      t.classList.remove(cls || 'bump');
      void t.offsetWidth;                    // บังคับให้เริ่มอนิเมชันใหม่
      t.classList.add(cls || 'bump');
      setTimeout(() => t.classList.remove(cls || 'bump'), 550);
    }).observe(el, { childList: true, characterData: true, subtree: true });
  }

  /* ---------- เริ่มทำงาน ---------- */
  function start() {
    embers(18);
    intro();

    const grid = document.getElementById('grid');
    if (grid) {
      tilt(grid);
      reveal(grid);
      // renderGrid() วาดการ์ดใหม่ทุกครั้งที่ค้นหา/เปลี่ยนหมวด → ต้องผูกลูกเล่นให้การ์ดชุดใหม่ด้วย
      new MutationObserver(() => reveal(grid)).observe(grid, { childList: true });
    }

    watchNumber(document.getElementById('cartTotal'));

    // จอครัว: ให้ตัวเลข KPI เด้งเมื่อมีออเดอร์/ยอดขายเปลี่ยน
    const kpis = document.getElementById('kpis');
    if (kpis && !calm) {
      let snap = kpis.textContent;
      new MutationObserver(() => {
        if (kpis.textContent === snap) return;
        snap = kpis.textContent;
        kpis.querySelectorAll('.kpi').forEach(k => {
          k.classList.remove('flash'); void k.offsetWidth; k.classList.add('flash');
        });
      }).observe(kpis, { childList: true, subtree: true, characterData: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
