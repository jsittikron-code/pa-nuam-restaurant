/* ================================================================
   store.js — "ฐานข้อมูล" ของระบบ เก็บออเดอร์ไว้ใน localStorage ของเบราว์เซอร์
   หน้า index.html (สั่งอาหาร) กับ kitchen.html (จอครัว) ใช้ไฟล์นี้ร่วมกัน
   ================================================================ */

const DB = (() => {
  const KEY = 'panuam.orders.v1';

  /* --- ตัวช่วยทั่วไป --- */
  const money = n => '฿' + Number(n || 0).toLocaleString('th-TH');
  const pad = n => String(n).padStart(2, '0');
  const dateKey = (d = new Date()) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const timeText = ts => {
    const d = new Date(ts);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  /* --- อ่าน/เขียนออเดอร์ --- */
  function all() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
    // แจ้งหน้าอื่นในแท็บเดียวกันให้รีเฟรช (storage event ยิงเฉพาะข้ามแท็บ)
    window.dispatchEvent(new CustomEvent('db:changed'));
  }
  const today = () => all().filter(o => o.day === dateKey());

  /* --- สร้างออเดอร์ใหม่ --- */
  function addOrder(order) {
    const list = all();
    const day = dateKey();
    const queue = list.filter(o => o.day === day).length + 1;   // เลขคิวของวัน
    const full = {
      id: `PN${day}-${pad(queue)}`,
      day, queue,
      ts: Date.now(),
      status: 'new',            // new → cooking → ready → paid
      ...order,
    };
    list.push(full);
    save(list);
    return full;
  }

  function setStatus(id, status) {
    const list = all();
    const o = list.find(x => x.id === id);
    if (!o) return;
    o.status = status;
    o.updated = Date.now();
    save(list);
  }

  function remove(id) {
    save(all().filter(o => o.id !== id));
  }

  function clearToday() {
    save(all().filter(o => o.day !== dateKey()));
  }

  /* --- สรุปยอดขายของวันนี้ --- */
  function summary() {
    const list = today();
    const paid = list.filter(o => o.status === 'paid');
    const sales = paid.reduce((s, o) => s + o.total, 0);
    const count = {};
    paid.forEach(o => o.items.forEach(it => {
      count[it.th] = (count[it.th] || 0) + it.qty;
    }));
    const best = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return {
      orders: list.length,
      paidCount: paid.length,
      waiting: list.filter(o => o.status === 'new' || o.status === 'cooking').length,
      sales,
      avg: paid.length ? Math.round(sales / paid.length) : 0,
      best,
    };
  }

  /* --- ร้านเปิดอยู่ไหม (เทียบกับเวลาเครื่อง) --- */
  function isOpen() {
    const [oh, om] = SHOP.open.split(':').map(Number);
    const [ch, cm] = SHOP.close.split(':').map(Number);
    const now = new Date();
    const m = now.getHours() * 60 + now.getMinutes();
    return m >= oh * 60 + om && m <= ch * 60 + cm;
  }

  return { all, today, addOrder, setStatus, remove, clearToday, summary, isOpen, money, timeText, dateKey };
})();

// ผูกไว้กับ window ให้ปุ่ม onclick ในหน้า HTML และหน้าอื่นเรียกใช้ได้แน่นอน
window.DB = DB;
