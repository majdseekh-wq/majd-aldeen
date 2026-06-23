/* ===================================================================
   مجد الدين - منطق الموقع
   لا حاجة لتعديل هذا الملف. كل التعديلات تصير في products.js
   =================================================================== */

let cart = {}; // { productKey: qty }

function productKey(p) {
  return p.category + '__' + p.name;
}

function findProduct(key) {
  return PRODUCTS.find(p => productKey(p) === key);
}

function formatPrice(p) {
  if (p.price === null || p.price === undefined) return '';
  const num = Number.isInteger(p.price) ? p.price : p.price.toFixed(1);
  return num + ' ريال';
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
    ? `<div class="product-price">${formatPrice(p)} <span class="unit">/ ${p.unit}</span></div>`
    : `<div class="price-call">السعر بالتواصل</div>`;

  let actionHtml;
  if (!p.available) {
    actionHtml = `<div class="unavailable-text">غير متوفر حالياً</div>`;
  } else {
    const qty = cart[key] || 0;
    actionHtml = `
      <div class="qty-row">
        <div class="qty-control">
          <button onclick="changeQty('${key}', -1)">−</button>
          <span id="qty-${cssKey(key)}">${qty}</span>
          <button onclick="changeQty('${key}', 1)">+</button>
        </div>
        <button class="add-btn" id="addbtn-${cssKey(key)}" onclick="addToCart('${key}')">أضف للسلة</button>
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
  return card;
}

function cssKey(key) {
  return key.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
}

function changeQty(key, delta) {
  const product = findProduct(key);
  if (!product) return;
  const current = cart[key] || 0;
  let next = current + delta;
  if (next < 0) next = 0;
  if (next === 0) {
    delete cart[key];
  }
  const span = document.getElementById('qty-' + cssKey(key));
  if (span) span.textContent = next > 0 ? next : 0;
  if (next > 0) {
    cart[key] = next;
  }
}

function addToCart(key) {
  const product = findProduct(key);
  if (!product) return;
  const qtySpan = document.getElementById('qty-' + cssKey(key));
  let qty = parseInt(qtySpan ? qtySpan.textContent : '0', 10);
  if (qty < 1) qty = 1;
  cart[key] = qty;
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
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function cartTotalPrice() {
  let total = 0;
  let hasUnpriced = false;
  Object.entries(cart).forEach(([key, qty]) => {
    const p = findProduct(key);
    if (!p) return;
    if (p.price === null) {
      hasUnpriced = true;
    } else {
      total += p.price * qty;
    }
  });
  return { total, hasUnpriced };
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
    itemsEl.innerHTML = keys.map(key => {
      const p = findProduct(key);
      const qty = cart[key];
      const imageHtml = p.image
        ? `<img src="${p.image}" alt="">`
        : `<img class="placeholder-logo" src="images/logo.png" alt="">`;
      const lineTotal = p.price !== null ? (p.price * qty) + ' ريال' : 'السعر بالتواصل';
      return `
        <div class="cart-item">
          <div class="cart-item-thumb">${imageHtml}</div>
          <div class="cart-item-details">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">${lineTotal}</div>
          </div>
          <div class="cart-item-qty">
            <button onclick="drawerChangeQty('${key}', -1)">−</button>
            <span>${qty}</span>
            <button onclick="drawerChangeQty('${key}', 1)">+</button>
          </div>
        </div>
      `;
    }).join('');
  }

  const { total, hasUnpriced } = cartTotalPrice();
  document.getElementById('cart-total-amount').textContent = total + ' ريال' + (hasUnpriced ? ' + أصناف بالتواصل' : '');
}

function drawerChangeQty(key, delta) {
  changeQty(key, delta);
  // sync the visible quantity on the product card too
  const qtySpan = document.getElementById('qty-' + cssKey(key));
  if (qtySpan) qtySpan.textContent = cart[key] || 0;
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

  keys.forEach(key => {
    const p = findProduct(key);
    const qty = cart[key];
    const lineTotal = p.price !== null ? `${p.price * qty} ريال` : 'السعر بالتواصل';
    lines.push(`• ${p.name} × ${qty} ${p.unit} — ${lineTotal}`);
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
