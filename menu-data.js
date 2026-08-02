/* ================================================================
   menu-data.js — ข้อมูลร้าน + เมนูทั้งหมด (ดึงจากโปสเตอร์เมนูป้านวม)
   แก้ราคา/เพิ่มเมนู ให้แก้ที่ไฟล์นี้ไฟล์เดียว หน้าเว็บอัปเดตตามทันที
   ================================================================ */

window.SHOP = {
  name: 'ป้านวม',
  nameEn: 'PANUAM KITCHEN',
  tagline: 'เมนูสดใหม่ ควงตะหลิวไฟแรง 🔥',
  phone: '082-641-4370',
  address: 'สุขุมวิท 20 ปากซอย กรุงเทพฯ',
  addressEn: 'Soi Sukhumvit 20, Bangkok',
  addressCn: '曼谷素坤逸20巷口',
  open: '07:00',
  close: '15:30',
  tables: 12,          // จำนวนโต๊ะในร้าน
  boxFee: 5,           // ค่ากล่อง/รายการ เมื่อสั่งกลับบ้าน
  // ตัวเลือกเสริมที่บวกเพิ่มได้ทุกเมนู
  addons: [
    { id: 'egg',     label: 'เพิ่มไข่ดาว',       price: 10 },
    { id: 'rice',    label: 'เพิ่มข้าว',         price: 10 },
    { id: 'special', label: 'พิเศษ (เพิ่มเนื้อ)', price: 10 },
  ],
  spicy: ['ไม่เผ็ด', 'เผ็ดน้อย', 'เผ็ดปกติ', 'เผ็ดมาก'],
};

// หมวดหมู่ + สีประจำหมวด (ใช้ทำชิปกรอง และแถบสีบนการ์ด)
window.CATS = [
  { id: 'หมู',      c1: '#ff9bb0', c2: '#ff5e1a' },
  { id: 'ไก่',      c1: '#ffd24a', c2: '#ff8a1b' },
  { id: 'เนื้อ',    c1: '#ff5a5a', c2: '#c81e4e' },
  { id: 'ทะเล',     c1: '#46dcff', c2: '#ff7a4d' },
  { id: 'สุกี้น้ำ', c1: '#b98bff', c2: '#5e6bff' },
  { id: 'ผัก',      c1: '#39e0a0', c2: '#9bd64a' },
];

window.MENU = [
  { id: 1,  cat: 'ไก่',      price: 80, th: 'กะเพราไก่ไข่ดาว',            en: 'Chicken Basil w/ Fried Egg',      cn: '打抛鸡肉饭配煎蛋', img: 'img/01.jpg', hot: true },
  { id: 2,  cat: 'หมู',      price: 80, th: 'กะเพราหมูสับไข่ดาว',         en: 'Minced Pork Basil w/ Fried Egg',  cn: '打抛猪肉饭配煎蛋', img: 'img/02.jpg', hot: true },
  { id: 3,  cat: 'เนื้อ',    price: 80, th: 'กะเพราเนื้อไข่ดาว',          en: 'Beef Basil w/ Fried Egg',         cn: '打抛牛肉饭配煎蛋', img: 'img/03.jpg' },
  { id: 4,  cat: 'เนื้อ',    price: 70, th: 'กะเพราเนื้อ (จานเนื้อล้วน)', en: 'Basil Beef',                      cn: '打抛牛肉',        img: 'img/04.jpg' },
  { id: 5,  cat: 'ทะเล',     price: 80, th: 'กะเพราปลาหมึกไข่ดาว',        en: 'Squid Basil w/ Fried Egg',        cn: '打抛鱿鱼配煎蛋',   img: 'img/05.jpg' },
  { id: 6,  cat: 'ทะเล',     price: 80, th: 'ข้าวกะเพรากุ้งไข่ดาว',       en: 'Shrimp Basil w/ Fried Egg',       cn: '打抛虾饭配煎蛋',   img: 'img/06.jpg' },
  { id: 7,  cat: 'หมู',      price: 80, th: 'ข้าวกะเพราหมู',              en: 'Pork Basil Fried Rice',           cn: '打抛猪肉饭',      img: 'img/07.jpg' },
  { id: 8,  cat: 'หมู',      price: 80, th: 'หมูสับผัดกระเทียมไข่ดาว',    en: 'Minced Pork w/ Garlic & Fried Egg', cn: '蒜香猪肉配煎蛋', img: 'img/08.jpg' },
  { id: 9,  cat: 'หมู',      price: 80, th: 'หมูกระเทียมพริกไทยไข่ดาว',   en: 'Garlic Pepper Pork w/ Fried Egg', cn: '蒜香胡椒猪肉配煎蛋', img: 'img/09.jpg' },
  { id: 10, cat: 'หมู',      price: 80, th: 'พริกแกงหมูไข่เจียว',         en: 'Pork w/ Curry Paste & Omelette',  cn: '咖喱酱猪肉配煎蛋卷', img: 'img/10.jpg' },
  { id: 11, cat: 'หมู',      price: 80, th: 'ข้าวไข่เจียวหมูสับ',         en: 'Minced Pork Omelette on Rice',    cn: '猪肉煎蛋卷饭',    img: 'img/11.jpg' },
  { id: 12, cat: 'หมู',      price: 70, th: 'ข้าวผัดหมู',                 en: 'Pork Fried Rice',                 cn: '猪肉炒饭',        img: 'img/12.jpg', hot: true },
  { id: 13, cat: 'หมู',      price: 70, th: 'ผัดซีอิ๊วหมู',               en: 'Pad See Ew w/ Pork',              cn: '猪肉炒河粉',      img: 'img/13.jpg' },
  { id: 14, cat: 'หมู',      price: 70, th: 'สุกี้แห้งหมูนุ่ม',           en: 'Dry Pork Sukiyaki',               cn: '干式猪肉寿喜烧',   img: 'img/14.jpg' },
  { id: 15, cat: 'สุกี้น้ำ', price: 70, th: 'สุกี้น้ำ',                   en: 'Sukiyaki Soup',                   cn: '汤式寿喜烧',      img: 'img/15.jpg' },
  { id: 16, cat: 'ทะเล',     price: 70, th: 'กุ้งคั่วพริกเกลือ',          en: 'Shrimp w/ Garlic & Chili',        cn: '椒盐虾',          img: 'img/16.jpg' },
  { id: 17, cat: 'ทะเล',     price: 70, th: 'หมึกทอดกระเทียม',            en: 'Crispy Garlic Calamari',          cn: '蒜香炸鱿鱼',      img: 'img/17.jpg' },
  { id: 18, cat: 'เนื้อ',    price: 80, th: 'เนื้อพริกหยวกไข่ดาว',        en: 'Beef w/ Green Pepper & Fried Egg', cn: '青椒牛肉配煎蛋',  img: 'img/18.jpg' },
  { id: 19, cat: 'ผัก',      price: 70, th: 'ผักบุ้งไฟแดง',               en: 'Stir-fried Morning Glory',        cn: '猛火炒空心菜',    img: 'img/19.jpg', hot: true },
];
