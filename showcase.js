/* ==================================================================
   showcase.js — หน้าเว็บสำหรับลูกค้า: เรนเดอร์เนื้อหา + ภาพเคลื่อนไหว
   ใช้ข้อมูลจาก menu-data.js (เมนู) และ reviews.js (รีวิว)
   ================================================================== */
(function () {
  'use strict';

  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"]/g, m =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const money = n => '฿' + Number(n).toLocaleString('th-TH');

  /* ================================================================
     โหมดพรีวิว — เจ้าของร้านเปิดด้วย ?preview=1 เพื่อดูดีไซน์หน้ารีวิว
     คนทั่วไปที่เข้าเว็บปกติจะไม่เห็นรีวิวตัวอย่างเลย
     ================================================================ */
  const PREVIEW = new URLSearchParams(location.search).get('preview') === '1';
  const REAL    = Array.isArray(window.REVIEWS) ? window.REVIEWS : [];
  const LIST    = REAL.length ? REAL : (PREVIEW ? (window.REVIEWS_PREVIEW || []) : []);
  const IS_DEMO = !REAL.length && LIST.length > 0;

  /* ---------- ดาว ---------- */
  const stars = n => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);

  /* ---------- เมนูที่ยังไม่มีไฟล์รูป ----------
     เปลี่ยนเป็นการ์ด "รูปเร็ว ๆ นี้" แทนที่จะโชว์รูปแตก
     พอวางไฟล์รูปลง img/ แล้วส่วนนี้จะเลิกทำงานเอง */
  window.noPic = img => {
    const box = img.closest('.sg, .d, .lb-img');
    if (box && !box.classList.contains('nopic')) {
      box.classList.add('nopic');
      const s = document.createElement('span');
      s.className = 'soon';
      s.innerHTML = '<em>🍽️</em>รูปเร็ว ๆ นี้';
      box.appendChild(s);
    }
    img.remove();
  };

  /* ---------- คะแนนรวม / คะแนนรายเมนู ---------- */
  const avg = LIST.length ? LIST.reduce((s, r) => s + r.rating, 0) / LIST.length : 0;
  const byDish = {};
  LIST.forEach(r => {
    if (!r.dish) return;
    (byDish[r.dish] = byDish[r.dish] || []).push(r);
  });
  const dishRate = id => {
    const l = byDish[id];
    return l ? { n: l.length, avg: l.reduce((s, r) => s + r.rating, 0) / l.length } : null;
  };

  /* ================================================================
     1) ฉากหลังฮีโร่ — ภาพอาหารสลับพร้อมซูมช้า (Ken Burns)
     ================================================================ */
  function heroBg() {
    const box = $('#heroBg');
    const pics = MENU.filter(m => m.hot).concat(MENU[5], MENU[15]).slice(0, 6);
    pics.forEach((m, i) => {
      const img = new Image();
      img.src = m.img; img.alt = '';
      if (i === 0) img.classList.add('on');
      box.appendChild(img);
    });
    if (calm || pics.length < 2) return;
    let i = 0;
    setInterval(() => {
      const imgs = box.children;
      imgs[i].classList.remove('on');
      i = (i + 1) % imgs.length;
      imgs[i].classList.remove('on');
      void imgs[i].offsetWidth;          // รีสตาร์ตอนิเมชันซูม
      imgs[i].classList.add('on');
    }, 6500);
  }

  /* ================================================================
     2) เข้าฉากเมื่อเลื่อนถึง
     ================================================================ */
  const io = 'IntersectionObserver' in window && !calm
    ? new IntersectionObserver(rows => rows.forEach(r => {
        if (!r.isIntersecting) return;
        r.target.classList.add('in');
        io.unobserve(r.target);
      }), { threshold: .12, rootMargin: '0px 0px -6% 0px' })
    : null;

  function watch(scope) {
    const els = (scope || document).querySelectorAll('.reveal:not(.in), .mask:not(.in)');
    if (!io) { els.forEach(e => e.classList.add('in')); return; }
    els.forEach((e, i) => {
      // .mask หน่วงที่ตัวอักษรข้างใน ส่วน .reveal หน่วงที่ตัวมันเอง
      const t = e.classList.contains('mask') ? e.firstElementChild : e;
      if (t && !t.style.transitionDelay) t.style.transitionDelay = Math.min(i, 8) * 70 + 'ms';
      io.observe(e);
    });
  }

  /* ================================================================
     3) แถบเมนูบน + แถบความคืบหน้า + แสงตามเมาส์
     ================================================================ */
  function chrome() {
    const nav = $('#nav'), bar = $('#progressBar');
    const onScroll = () => {
      const y = scrollY;
      nav.classList.toggle('stuck', y > 60);
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // เมนูมือถือ
    const burger = $('#burger'), links = $('.links');
    burger.addEventListener('click', () => {
      burger.classList.toggle('on');
      links.classList.toggle('open');
    });
    links.addEventListener('click', e => {
      if (e.target.tagName === 'A') { burger.classList.remove('on'); links.classList.remove('open'); }
    });

    // ไฮไลต์เมนูตามส่วนที่กำลังดู
    const map = {};
    $$('.links a').forEach(a => { map[a.getAttribute('href').slice(1)] = a; });
    const secs = Object.keys(map).map(id => document.getElementById(id)).filter(Boolean);
    if ('IntersectionObserver' in window && secs.length) {
      const spy = new IntersectionObserver(rows => rows.forEach(r => {
        if (r.isIntersecting) {
          $$('.links a').forEach(a => a.classList.remove('active'));
          map[r.target.id].classList.add('active');
        }
      }), { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach(s => spy.observe(s));
    }

    // แสงนวลตามเมาส์ (เฉพาะเครื่องที่มีเมาส์จริง)
    if (!calm && matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.body.classList.add('pointer');
      const sp = $('#spotlight');
      addEventListener('pointermove', e => {
        sp.style.setProperty('--mx', e.clientX + 'px');
        sp.style.setProperty('--my', e.clientY + 'px');
      }, { passive: true });
    }
  }

  /* ================================================================
     4) ตัวเลขวิ่งขึ้น
     ================================================================ */
  function counters() {
    const els = $$('[data-count]');
    if (!els.length) return;
    const run = el => {
      const to = +el.dataset.count, sfx = el.dataset.suffix || '';
      if (calm) { el.textContent = to + sfx; return; }
      const dur = 1400, t0 = performance.now();
      const tick = t => {
        const p = Math.min((t - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);            // ease-out
        el.textContent = Math.round(to * e) + sfx;
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0' + sfx;
      requestAnimationFrame(tick);
      // กันเหนียว: ถ้า requestAnimationFrame ไม่ทำงาน (แท็บพื้นหลัง ฯลฯ) ให้เติมเลขจริงไว้
      setTimeout(() => { el.textContent = to + sfx; }, dur + 400);
    };
    if (!('IntersectionObserver' in window)) return els.forEach(run);
    const ob = new IntersectionObserver(rows => rows.forEach(r => {
      if (r.isIntersecting) { run(r.target); ob.unobserve(r.target); }
    }), { threshold: .5 });
    els.forEach(e => ob.observe(e));
  }

  /* ================================================================
     5) เมนูขึ้นชื่อ
     ================================================================ */
  function signature() {
    const list = MENU.filter(m => m.hot).slice(0, 4);
    $('#sig').innerHTML = list.map((m, i) => {
      const r = dishRate(m.id);
      return `<article class="sg reveal" data-id="${m.id}">
        <img src="${m.img}" alt="${esc(m.th)}" loading="lazy" onerror="noPic(this)">
        <span class="sg-n">${String(i + 1).padStart(2, '0')}</span>
        <span class="sg-p">${money(m.price)}</span>
        <div class="sg-t">
          ${r ? `<div class="sg-r">${stars(Math.round(r.avg))} <span>${r.avg.toFixed(1)}</span></div>` : ''}
          <h3>${esc(m.th)}</h3>
          <p>${esc(m.en)}</p>
        </div>
      </article>`;
    }).join('');
  }

  /* ================================================================
     6) เมนูทั้งหมด + ตัวกรองหมวด
     ================================================================ */
  let cat = 'ทั้งหมด';
  let shown = [];

  function filters() {
    $('#filters').innerHTML = ['ทั้งหมด', ...CATS.map(c => c.id)]
      .map(c => `<button class="f${c === cat ? ' on' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`)
      .join('');
  }

  function dishes() {
    shown = cat === 'ทั้งหมด' ? MENU : MENU.filter(m => m.cat === cat);
    const box = $('#dishes');
    box.innerHTML = shown.length ? shown.map(m => `
      <article class="d reveal" data-id="${m.id}">
        <img src="${m.img}" alt="${esc(m.th)}" loading="lazy" onerror="noPic(this)">
        ${m.hot ? '<span class="d-hot">ขายดี</span>' : ''}
        <span class="d-p">${money(m.price)}</span>
        <div class="d-zoom"><span>⤢</span></div>
        <div class="d-t"><h4>${esc(m.th)}</h4><small>${esc(m.en)}</small></div>
      </article>`).join('')
      : '<p class="noresult">ไม่มีเมนูในหมวดนี้</p>';
    watch(box);
  }

  /* ================================================================
     7) ภาพใหญ่ (Lightbox)
     ================================================================ */
  let lbIdx = -1, lbPool = [];

  function openLb(id) {
    // กดจากตารางเมนู → เลื่อนดูเฉพาะหมวดที่กรองอยู่
    // กดจากเมนูขึ้นชื่อ → เลื่อนดูได้ทั้งเมนู
    lbPool = shown.some(m => m.id === id) ? shown : MENU;
    lbIdx = lbPool.findIndex(m => m.id === id);
    drawLb();
    $('#lb').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function drawLb() {
    const m = lbPool[lbIdx];
    if (!m) return;
    const r = dishRate(m.id);
    const c = CATS.find(x => x.id === m.cat) || {};
    const revs = (byDish[m.id] || []).slice(0, 2);

    $('#lbIn').innerHTML = `
      <div class="lb-img"><img src="${m.img}" alt="${esc(m.th)}" onerror="noPic(this)"></div>
      <div class="lb-b">
        <span class="lb-cat">${esc(m.cat)}${m.hot ? ' · ขายดี' : ''}</span>
        <h3>${esc(m.th)}</h3>
        <div class="lb-en">${esc(m.en)}</div>
        <div class="lb-cn">${esc(m.cn)}</div>
        <div class="lb-price">${money(m.price)}</div>
        ${r ? `<div class="lb-hr"></div>
          <div class="lb-rev"><span class="st">${stars(Math.round(r.avg))}</span>
            ${r.avg.toFixed(1)} จาก ${r.n} รีวิว
            ${revs.map(v => `<p style="margin-top:10px">“${esc(v.text)}” — ${esc(v.name)}</p>`).join('')}
          </div>` : ''}
      </div>`;
    // รีสตาร์ตอนิเมชันซูมภาพทุกครั้งที่เปลี่ยนจาน
    const el = $('#lbIn'); el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  }

  function closeLb() {
    $('#lb').classList.remove('show');
    document.body.style.overflow = '';
    lbIdx = -1;
  }
  const stepLb = d => { lbIdx = (lbIdx + d + lbPool.length) % lbPool.length; drawLb(); };

  /* ================================================================
     8) รีวิว
     ================================================================ */
  function reviews() {
    const zone = $('#reviewZone');

    /* ---- ดาวเฉลี่ยในฮีโร่ (ขึ้นเมื่อมีรีวิวเท่านั้น) ---- */
    if (LIST.length) {
      $('#heroRate').innerHTML = `<a class="hrate" href="#reviews">
        <span style="color:var(--gold);letter-spacing:2px">${stars(Math.round(avg))}</span>
        <b>${avg.toFixed(1)}</b> จาก ${LIST.length} รีวิว</a>`;
    }

    /* ---- ยังไม่มีรีวิวจริง ---- */
    if (!LIST.length) {
      zone.innerHTML = `
        <div class="rempty reveal">
          <div class="qm">“</div>
          <h3>ยังไม่มีรีวิวบนหน้านี้</h3>
          <p>ถ้าเคยแวะมาทานแล้วถูกปาก<br>ฝากรีวิวไว้ให้คนอื่นได้รู้จักร้านหน่อยนะครับ 🙏</p>
          <div class="rlinks">
            <a class="btn line" target="_blank" rel="noopener"
               href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('ร้านอาหารป้านวม สุขุมวิท 20')}">
              เขียนรีวิวบน Google</a>
            <a class="btn line" href="tel:0826414370">โทรหาร้าน</a>
          </div>
        </div>`;
      watch(zone);
      return;
    }

    /* ---- สรุปคะแนน ---- */
    const dist = [5, 4, 3, 2, 1].map(n => ({ n, c: LIST.filter(r => r.rating === n).length }));
    const top = Math.max(...dist.map(d => d.c), 1);

    const cards = LIST.map(r => {
      const dish = MENU.find(m => m.id === r.dish);
      const d = new Date(r.date);
      const when = isNaN(d) ? '' : d.toLocaleDateString('th-TH', { month: 'short', year: 'numeric' });
      return `<article class="rc">
        <div class="st">${stars(r.rating)}</div>
        ${dish ? `<div class="dish">${esc(dish.th)}</div>` : ''}
        <q>${esc(r.text)}</q>
        <div class="who">
          <span class="av">${esc(r.name.trim().charAt(0) || '?')}</span>
          <div><b>${esc(r.name)}</b><small>${esc(r.source || '')}${when ? ' · ' + when : ''}</small></div>
        </div>
      </article>`;
    }).join('');

    // ทำซ้ำให้แถบเลื่อนต่อเนื่องไม่ขาดตอน
    const reps = Math.max(2, Math.ceil(8 / LIST.length) * 2);

    zone.innerHTML = `
      ${IS_DEMO ? `<div class="pvbar">👀 โหมดพรีวิว — รีวิวด้านล่างเป็น
        <b>ตัวอย่างสำหรับดูดีไซน์</b> ไม่ใช่รีวิวจากลูกค้าจริง
        (คนที่เข้าเว็บปกติจะไม่เห็นส่วนนี้)</div>` : ''}

      <div class="rsum reveal">
        <div class="rbig">
          <b>${avg.toFixed(1)}</b>
          <div class="st" style="color:var(--gold);letter-spacing:3px">${stars(Math.round(avg))}</div>
          <small>จาก ${LIST.length} รีวิว</small>
        </div>
        <div class="bars">
          ${dist.map(d => `<div class="bar">
            <u>${d.n} ดาว</u><i><b data-w="${(d.c / top) * 100}"></b></i><span>${d.c}</span>
          </div>`).join('')}
        </div>
      </div>

      <div class="rtrack"><div class="rrow">${cards.repeat(reps)}</div></div>`;

    // แถบคะแนนวิ่งเมื่อเลื่อนถึง
    const sum = zone.querySelector('.rsum');
    const fill = () => zone.querySelectorAll('.bar b').forEach(b => { b.style.width = b.dataset.w + '%'; });
    if ('IntersectionObserver' in window && !calm) {
      const ob = new IntersectionObserver(rows => rows.forEach(r => {
        if (r.isIntersecting) { fill(); ob.disconnect(); }
      }), { threshold: .4 });
      ob.observe(sum);
    } else fill();

    // ความเร็วแถบเลื่อนให้พอดีกับจำนวนการ์ด
    const row = zone.querySelector('.rrow');
    if (row) row.style.animationDuration = Math.max(28, LIST.length * reps * 4) + 's';

    watch(zone);
  }

  /* ================================================================
     9) สถานะเปิด/ปิดร้าน
     ================================================================ */
  function openNow() {
    const el = $('#openNow');
    const [oh, om] = SHOP.open.split(':').map(Number);
    const [ch, cm] = SHOP.close.split(':').map(Number);
    const now = new Date(), m = now.getHours() * 60 + now.getMinutes();
    const on = m >= oh * 60 + om && m <= ch * 60 + cm;
    el.className = 'now ' + (on ? 'open' : 'shut');
    el.innerHTML = `<span class="dot"></span>${on ? 'ตอนนี้เปิดอยู่ — แวะมาได้เลย' : 'ตอนนี้ปิดแล้ว — พรุ่งนี้เจอกัน 07:00'}`;
  }

  /* ================================================================
     เริ่มทำงาน
     ================================================================ */
  function start() {
    heroBg();
    chrome();
    signature();
    filters();
    dishes();
    reviews();
    openNow();
    counters();
    watch();

    // เปิดม่านหัวเรื่องในฮีโร่ทันทีที่โหลดเสร็จ
    requestAnimationFrame(() => $$('.hero .mask, .hero .reveal').forEach(e => e.classList.add('in')));

    // กดการ์ดเมนู → เปิดภาพใหญ่
    document.addEventListener('click', e => {
      const card = e.target.closest('.sg, .d');
      if (card) return openLb(+card.dataset.id);
      const f = e.target.closest('.f');
      if (f) { cat = f.dataset.cat; filters(); dishes(); }
    });

    $('#lbX').addEventListener('click', closeLb);
    $('#lbPrev').addEventListener('click', () => stepLb(-1));
    $('#lbNext').addEventListener('click', () => stepLb(1));
    $('#lb').addEventListener('click', e => { if (e.target.id === 'lb') closeLb(); });
    addEventListener('keydown', e => {
      if (lbIdx < 0) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') stepLb(-1);
      if (e.key === 'ArrowRight') stepLb(1);
    });
  }

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start);
  else start();
})();
