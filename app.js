/* ===================================================================
مجد الدين - منطق الموقع
لا حاجة لتعديل هذا الملف. كل التعديلات تصير في products.js
=================================================================== */

let cart = {}; // { cartKey: { key, size, qty } }

function productKey(p) {
   return p.category + '__' + p.name;
}

function findProduct(key) {
   return PRODUCTS.find(p => productKey(p) === key);
}

// هل يُباع الصنف بالكيلو؟
function isKilo(p) {
   return p.unit === 'كيلو';
}

// مفتاح فريد للسلة يجمع المنتج مع الحجم المختار
function makeCartKey(key, size) {
   return key + '##' + size;
}

// سعر الوحدة حسب الحجم (نص كيلو = نصف السعر)
function unitPriceFor(p, size) {
   if (p.price === null || p.price === undefined) return null;
   return size === 'half' ? p.price / 2 : p.price;
}

// نص الوحدة للعرض
function sizeLabel(p, size) {
   if (!isKilo(p)) return p.unit;
   return size === 'half' ? 'نص كيلو' : 'كيلو';
}

function formatNum(n) {
   return Number.isInteger(n) ? n : Number(n.toFixed(1));
}

function renderCatalog() {
   const catalog = document.getElementById('catalog');
   catalog.innerHTML = '';

CATEGORIES.forEach(cat => {
   const items = PRODUCTS.filter(p => p.category === cat.id);
   if (items.length === 0) return;

                   const section = document.createElement('div');
   section.className = 'category-section';
   section.id = 'cat-' + cat.id;

                   const title = document.createElement('h2');
   title.className = 'category-title';
   title.textContent = cat.name;
   section.appendChild(title);

                   const grid = document.createElement('div');
   grid.className = 'product-grid';

                   items.forEach(p => {
                      grid.appendChild(renderProductCard(p));
                   });

                   section.appendChild(grid);
   catalog.appendChild(section);
});
}

function renderProductCard(p) {
   const key = productKey(p);
   const card = document.createElement('div');
   card.className = 'product-card' + (p.available ? '' : ' unavailable');

const imageHtml = p.image
   ? `<img src="${p.image}" alt="${p.name}" onerror="this.parentElement.innerHTML='<img class=&quot;placeholder-logo&quot; src=&quot;images/logo.png&quot;>'">`
   : `<img class="placeholder-logo" src="images/logo.png" alt="">`;

const badge = p.available ? '' : `<div class="unavailable-badge">غير متوفر حالياً</div>`;

const priceHtml = p.price !== null
   ? `<div class="product-price">${formatNum(p.price)} ريال <span class="unit">/ ${isKilo(p) ? 'كيلو' : p.unit}</span></div>`
   : `<div class="price-call">السعر بالتواصل</div>`;

let actionHtml;
   if (!p.available) {
      actionHtml = `<div class="unavailable-text">غير متوفر حالياً</div>`;
   } else if (isKilo(p)) {
      const ck = cssKey(key);
      const halfPriceTxt = p.price !== null ? ` (${formatNum(p.price / 2)} ريال)` : '';
      actionHtml = `
      <div class="size-options" id="size-${ck}">
      <button class="size-btn active" data-size="full" onclick="selectSize('${key}','full')">كيلو</button>
      <button class="size-btn" data-size="half" onclick="selectSize('${key}','half')">نص كيلو${halfPriceTxt}</button>
      </div>
      <div class="qty-row">
      <div class="qty-control">
      <button onclick="changeQty('${key}', -1)">−</button>
      <span id="qty-${ck}">0</span>
      <button onclick="changeQty('${key}', 1)">+</button>
      </div>
      <button class="add-btn" id="addbtn-${ck}" onclick="addToCart('${key}')">أضف للسلة</button>
      </div>
      `;
   } else {
      const ck = cssKey(key);
      actionHtml = `
      <div class="qty-row">
      <div class="qty-control">
      <button onclick="changeQty('${key}', -1)">−</button>
      <span id="qty-${ck}">0</span>
      <button onclick="changeQty('${key}', 1)">+</button>
      </div>
      <button class="add-btn" id="addbtn-${ck}" onclick="addToCart('${key}')">أضف للسلة</button>
      </div>
      `;
   }

card.innerHTML = `
<div class="product-image">${imageHtml}${badge}</div>
<div class="product-info">
<div class="product-name">${p.name}</div>
${priceHtml}
${actionHtml}
</div>
`;
   // حفظ الحجم المختار على البطاقة
card.dataset.size = 'full';
   card._selectedSize = 'full';
   return card;
}

function cssKey(key) {
   return key.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
}

// الحجم المختار حالياً لكل منتج على البطاقة
const selectedSizes = {};

function selectSize(key, size) {
   selectedSizes[key] = size;
   const ck = cssKey(key);
   const wrap = document.getElementById('size-' + ck);
   if (wrap) {
      wrap.querySelectorAll('.size-btn').forEach(b => {
         b.classList.toggle('active', b.dataset.size === size);
      });
   }
   // عند تبديل الحجم، اعرض الكمية الحالية لهذا الحجم
const product = findProduct(key);
   const cartKey = makeCartKey(key, size);
   const qty = cart[cartKey] ? cart[cartKey].qty : 0;
   const span = document.getElementById('qty-' + ck);
   if (span) span.textContent = qty;
}

function currentSize(key) {
   const product = findProduct(key);
   if (!isKilo(product)) return 'full';
   return selectedSizes[key] || 'full';
}

function changeQty(key, delta) {
   const product = findProduct(key);
   if (!product) return;
   const size = currentSize(key);
   const cartKey = makeCartKey(key, size);
   const current = cart[cartKey] ? cart[cartKey].qty : 0;
   let next = current + delta;
   if (next < 0) next = 0;
   const span = document.getElementById('qty-' + cssKey(key));
   if (span) span.textContent = next;
   if (next === 0) {
      delete cart[cartKey];
   } else {
      cart[cartKey] = { key, size, qty: next };
   }
}

function addToCart(key) {
   const product = findProduct(key);
   if (!product) return;
   const size = currentSize(key);
   const cartKey = makeCartKey(key, size);
   const qtySpan = document.getElementById('qty-' + cssKey(key));
   let qty = parseInt(qtySpan ? qtySpan.textContent : '0', 10);
   if (qty < 1) qty = 1;
   cart[cartKey] = { key, size, qty };
   if (qtySpan) qtySpan.textContent = qty;

const btn = document.getElementById('addbtn-' + cssKey(key));
   if (btn) {
      btn.textContent = 'أُضيف ✓';
      btn.classList.add('added');
      setTimeout(() => {
         btn.textContent = 'أضف للسلة';
         btn.classList.remove('added');
      }, 1100);
   }

updateCartUI();
}

function cartTotalCount() {
   return Object.values(cart).reduce((a, b) => a + b.qty, 0);
}

function cartTotalPrice() {
   let total = 0;
   let hasUnpriced = false;
   Object.values(cart).forEach(entry => {
      const p = findProduct(entry.key);
      if (!p) return;
      const up = unitPriceFor(p, entry.size);
      if (up === null) {
         hasUnpriced = true;
      } else {
         total += up * entry.qty;
      }
   });
   return { total: formatNum(total), hasUnpriced };
}

function updateCartUI() {
   const count = cartTotalCount();
   const countEl = document.getElementById('cart-count');
   countEl.textContent = count;
   countEl.classList.toggle('hidden', count === 0);

const stickyBar = document.getElementById('sticky-cart-bar');
   stickyBar.classList.toggle('show', count > 0);
   document.getElementById('sticky-count').textContent = count;
   const { total } = cartTotalPrice();
   document.getElementById('sticky-total').textContent = total > 0 ? (total + ' ريال') : '';

renderCartDrawer();
}

function renderCartDrawer() {
   const itemsEl = document.getElementById('cart-items');
   const keys = Object.keys(cart);

if (keys.length === 0) {
   itemsEl.innerHTML = `<div class="cart-empty">سلتك فاضية حالياً<br>ابدأ بإضافة الحلويات المفضلة لك 🍯</div>`;
   document.getElementById('whatsapp-btn').disabled = true;
} else {
   document.getElementById('whatsapp-btn').disabled = false;
   itemsEl.innerHTML = keys.map(cartKey => {
      const entry = cart[cartKey];
      const p = findProduct(entry.key);
      const qty = entry.qty;
      const imageHtml = p.image
      ? `<img src="${p.image}" alt="">`
         : `<img class="placeholder-logo" src="images/logo.png" alt="">`;
      const up = unitPriceFor(p, entry.size);
      const lineTotal = up !== null ? (formatNum(up * qty) + ' ريال') : 'السعر بالتواصل';
      const label = sizeLabel(p, entry.size);
      return `
      <div class="cart-item">
      <div class="cart-item-thumb">${imageHtml}</div>
      <div class="cart-item-details">
      <div class="cart-item-name">${p.name} <span class="cart-item-size">(${label})</span></div>
      <div class="cart-item-price">${lineTotal}</div>
      </div>
      <div class="cart-item-qty">
      <button onclick="drawerChangeQty('${cartKey}', -1)">−</button>
      <span>${qty}</span>
      <button onclick="drawerChangeQty('${cartKey}', 1)">+</button>
      </div>
      </div>
      `;
   }).join('');
}

const { total, hasUnpriced } = cartTotalPrice();
   document.getElementById('cart-total-amount').textContent = total + ' ريال' + (hasUnpriced ? ' + أصناف بالتواصل' : '');
}

function drawerChangeQty(cartKey, delta) {
   const entry = cart[cartKey];
   if (!entry) return;
   let next = entry.qty + delta;
   if (next < 0) next = 0;
   if (next === 0) {
      delete cart[cartKey];
   } else {
      cart[cartKey].qty = next;
   }
   // مزامنة الكمية الظاهرة على البطاقة لو نفس الحجم معروض
if (entry) {
   const ck = cssKey(entry.key);
   if (currentSize(entry.key) === entry.size) {
      const span = document.getElementById('qty-' + ck);
      if (span) span.textContent = next;
   }
}
   updateCartUI();
}

function openCart() {
   document.getElementById('cart-overlay').classList.add('open');
   document.getElementById('cart-drawer').classList.add('open');
}

function closeCart() {
   document.getElementById('cart-overlay').classList.remove('open');
   document.getElementById('cart-drawer').classList.remove('open');
}

function sendWhatsappOrder() {
   const keys = Object.keys(cart);
   if (keys.length === 0) return;

let lines = [];
   lines.push(`*طلب جديد من موقع ${STORE_INFO.name}*`);
   lines.push('');

keys.forEach(cartKey => {
   const entry = cart[cartKey];
   const p = findProduct(entry.key);
   const qty = entry.qty;
   const up = unitPriceFor(p, entry.size);
   const lineTotal = up !== null ? `${formatNum(up * qty)} ريال` : 'السعر بالتواصل';
   const label = sizeLabel(p, entry.size);
   lines.push(`• ${p.name} × ${qty} ${label} — ${lineTotal}`);
});

const { total, hasUnpriced } = cartTotalPrice();
   lines.push('');
   lines.push(`*الإجمالي التقديري: ${total} ريال${hasUnpriced ? ' (+ أصناف سعرها بالتواصل)' : ''}*`);
   lines.push('');
   lines.push('يرجى تأكيد الطلب وتفاصيل التوصيل 🙏');

const message = encodeURIComponent(lines.join('\n'));
   const url = `https://wa.me/${STORE_INFO.whatsapp}?text=${message}`;
   window.open(url, '_blank');
}

function renderCategoryNav() {
   const nav = document.getElementById('category-nav');
   nav.innerHTML = CATEGORIES
   .filter(cat => PRODUCTS.some(p => p.category === cat.id))
   .map((cat, i) => `<button class="cat-chip${i === 0 ? ' active' : ''}" data-cat="${cat.id}">${cat.name}</button>`)
   .join('');

nav.querySelectorAll('.cat-chip').forEach(chip => {
   chip.addEventListener('click', () => {
      nav.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const target = document.getElementById('cat-' + chip.dataset.cat);
      if (target) {
         const headerHeight = document.querySelector('.site-header').offsetHeight;
         const navHeight = document.querySelector('.category-nav').offsetHeight;
         const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - navHeight - 10;
         window.scrollTo({ top: y, behavior: 'smooth' });
      }
   });
});
}

document.addEventListener('DOMContentLoaded', () => {
   document.getElementById('brand-name-ar').textContent = STORE_INFO.name;
   document.getElementById('brand-tagline').textContent = STORE_INFO.tagline;
   document.getElementById('hero-name').textContent = STORE_INFO.name;
   document.getElementById('hero-tagline').textContent = STORE_INFO.tagline;

                          renderCategoryNav();
   renderCatalog();
   updateCartUI();

                          document.getElementById('cart-btn').addEventListener('click', openCart);
   document.getElementById('sticky-cart-bar').addEventListener('click', openCart);
   document.getElementById('close-cart').addEventListener('click', closeCart);
   document.getElementById('cart-overlay').addEventListener('click', closeCart);
   document.getElementById('whatsapp-btn').addEventListener('click', sendWhatsappOrder);
});
