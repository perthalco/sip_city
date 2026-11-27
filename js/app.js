/* =========================================================
   APP LOGIC — cart, order drawer, shop filtering.
   No libraries. You normally don't need to edit this file.
   ========================================================= */

/* ---------- tiny helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const fmt = (n) => CONFIG.CURRENCY + n.toLocaleString("en-US");
const esc = (s) => String(s).replace(/[&<>"']/g,
  (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const catById = (id) => CATEGORIES.find((c) => c.id === id) || { name: id, icon: "🍸" };
const catName = (id) => catById(id).name;
const catIcon = (id) => catById(id).icon;

/* ---------- product variants (pack + ml selectors) ---------- */
const hasVariants = (p) => Array.isArray(p.variants) && p.variants.length > 0;
function minPrice(p) {
  if (!hasVariants(p)) return p.price;
  return Math.min(...p.variants.flatMap((v) => v.sizes.map((s) => s.price)));
}
/* cart key: "productid::variantIndex::sizeIndex" (plain products: just the id) */
function variantKey(id, vi, si) { return `${id}::${vi}::${si}`; }
/* resolve a cart key → product fields with the right price/volume, or null */
function resolveItem(key) {
  const parts = String(key).split("::");
  const p = PRODUCTS.find((x) => x.id === parts[0]);
  if (!p) return null;
  if (hasVariants(p)) {
    const v = p.variants[Number(parts[1])];
    const s = v && v.sizes[Number(parts[2])];
    if (!s) return null;
    return { ...p, id: p.id, key, price: s.price, volume: `${v.pack} · ${s.ml}` };
  }
  if (parts.length !== 1) return null;
  return { ...p, key };
}

/* ---------- apply CONFIG values to the page ---------- */
function applyConfig() {
  $$("[data-brand]").forEach((el) => (el.textContent = CONFIG.BRAND));
  $$("[data-city]").forEach((el) => (el.textContent = CONFIG.CITY));
  $$("[data-free-min]").forEach((el) => (el.textContent = fmt(CONFIG.FREE_DELIVERY_MIN)));
  $$("[data-phone]").forEach((el) => (el.textContent = CONFIG.PHONE_DISPLAY));
  $$("[data-tel]").forEach((el) => (el.href = "tel:" + CONFIG.PHONE_TEL));
  $$("[data-wa]").forEach((el) => (el.href = CONFIG.WHATSAPP_URL));
}

/* ---------- cart state (localStorage, shared by both pages) ---------- */
const CART_KEY = "sipcity_cart_v1";
let cart = loadCart();
let orderForm = { pay: "Cash", contact: "WhatsApp", name: "", phone: "", addr: "" };

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY)) || {};
    // drop entries whose product no longer exists (catalog was cleared/edited)
    const clean = {};
    Object.entries(raw).forEach(([id, qty]) => {
      if (typeof PRODUCTS !== "undefined" && resolveItem(id)) clean[id] = qty;
    });
    return clean;
  } catch { return {}; }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function cartCount() {
  return Object.values(cart).reduce((s, n) => s + n, 0);
}
function cartItems() {
  return Object.entries(cart)
    .map(([key, qty]) => {
      const item = resolveItem(key);
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);
}
function cartSubtotal() {
  return cartItems().reduce((s, p) => s + p.price * p.qty, 0);
}
/* set by initShop() — re-renders the product grid (language switch) */
let refreshShop = () => {};

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderBadge(true);
  if ($("#drawer")?.classList.contains("open")) renderDrawer();
}
function setQty(id, qty) {
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart();
  renderBadge();
  renderDrawer();
}

/* ---------- apply translations to static text ---------- */
function applyTranslations() {
  const lang = getLang() || "en";
  if (lang === "ru") {
    document.documentElement.lang = "ru";
  } else if (lang === "zh") {
    document.documentElement.lang = "zh-Hans";
  } else {
    document.documentElement.lang = "en";
  }

  // Generic: every element tagged with data-i18n="key"
  $$("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const city = el.querySelector("[data-city]");
    if (city) {
      el.innerHTML = esc(t(key)) + ' <span data-city>' + esc(city.textContent) + '</span>';
    } else {
      el.textContent = t(key);
    }
  });

  // Cart button (text + badge span) — rebuild then restore count
  $$("[data-cart-open]").forEach((btn) => {
    btn.innerHTML = `🛒 ${t("cart")} <span class="cart-badge" data-cart-badge style="display:none">0</span>`;
  });
  renderBadge();

  // Hero title has an accent span → rebuild it
  const heroTitle = $(".hero__title");
  if (heroTitle) {
    heroTitle.innerHTML = `${t("heroTitle1")}<br />${t("heroTitle2")} <span class="accent">${t("heroAccent")}</span>`;
  }
  const heroText = $(".hero__text");
  if (heroText) heroText.textContent = t("heroText");

  // Shop page controls
  const searchInput = $("#searchInput");
  if (searchInput) searchInput.placeholder = t("searchPlaceholder");
  const sortSelect = $("#sortSelect");
  if (sortSelect) {
    sortSelect.options[0].textContent = t("sortDefault");
    if (sortSelect.options[1]) sortSelect.options[1].textContent = t("priceLowHigh");
    if (sortSelect.options[2]) sortSelect.options[2].textContent = t("priceHighLow");
    if (sortSelect.options[3]) sortSelect.options[3].textContent = t("nameAZ");
  }
  const emptyMsg = $("#emptyMsg");
  if (emptyMsg) emptyMsg.textContent = t("noMatches");
  const allChip = $("[data-cat='all']");
  if (allChip) allChip.textContent = t("all");
}

/* ---------- inject shared UI (drawer, overlay, float buttons) ---------- */
function injectSharedUI() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.id = "overlay";
  overlay.addEventListener("click", closeDrawer);
  document.body.appendChild(overlay);

  const drawer = document.createElement("aside");
  drawer.className = "drawer";
  drawer.id = "drawer";
  drawer.innerHTML = `
    <div class="drawer__head">
      <h3>Your order</h3>
      <button class="drawer__close" id="drawerClose" type="button" aria-label="Close">✕</button>
    </div>
    <div class="drawer__body" id="drawerBody"></div>
    <div class="drawer__foot" id="drawerFoot"></div>
  `;
  document.body.appendChild(drawer);
  $("#drawerClose").addEventListener("click", closeDrawer);

  const float = document.createElement("div");
  float.className = "float-btns";
  float.innerHTML = `
    <a class="float-btn contact-us" data-wa href="#" target="_blank" rel="noopener" title="Contact Us">📱 Contact Us</a>
  `;
  document.body.appendChild(float);

  $$("[data-cart-open]").forEach((btn) => btn.addEventListener("click", openDrawer));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
}

function openDrawer() {
  renderDrawer();
  $("#drawer").classList.add("open");
  $("#overlay").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  $("#drawer").classList.remove("open");
  $("#overlay").classList.remove("show");
  document.body.style.overflow = "";
}

/* ---------- cart badge ---------- */
function renderBadge(pulse = false) {
  const n = cartCount();
  $$("[data-cart-badge]").forEach((b) => {
    b.textContent = n;
    b.style.display = n ? "" : "none";
    if (pulse) {
      b.classList.remove("pulse");
      void b.offsetWidth; // restart CSS animation
      b.classList.add("pulse");
    }
  });
}

/* ---------- order drawer ---------- */
function readForm() {
  return {
    name:  $("#ordName")  ? $("#ordName").value  : orderForm.name,
    phone: $("#ordPhone") ? $("#ordPhone").value : orderForm.phone,
    addr:  $("#ordAddr")  ? $("#ordAddr").value  : orderForm.addr,
  };
}

function renderDrawer() {
  const body = $("#drawerBody");
  const foot = $("#drawerFoot");
  const items = cartItems();

  /* empty cart */
  if (!items.length) {
    body.innerHTML = `
      <div class="cart-empty">🛒<br/>${t("cartEmpty")}<br/>
      <a class="link" href="shop.html">${t("browseShop")}</a></div>`;
    foot.innerHTML = "";
    return;
  }

  /* cart lines */
  body.innerHTML = items.map((p) => `
    <div class="cart-line">
      <div class="cart-line__icon">${
        p.img
          ? `<img src="${esc(p.img)}" alt="" loading="lazy" onerror="this.remove();">`
          : catIcon(p.cat)
      }</div>
      <div class="cart-line__info">
        <div class="cart-line__name">${p.name}</div>
        <div class="cart-line__price">${fmt(p.price)} · ${p.volume}</div>
        <div class="qty">
          <button type="button" data-dec="${p.key}">−</button>
          <span>${p.qty}</span>
          <button type="button" data-inc="${p.key}">+</button>
        </div>
      </div>
      <div class="cart-line__total">${fmt(p.price * p.qty)}</div>
      <button class="cart-remove" type="button" data-remove="${p.key}" aria-label="Remove">✕</button>
    </div>
  `).join("");

  /* free-delivery progress */
  const sub  = cartSubtotal();
  const free = sub >= CONFIG.FREE_DELIVERY_MIN;
  const pct  = Math.min(100, Math.round((sub / CONFIG.FREE_DELIVERY_MIN) * 100));
  const left = Math.max(0, CONFIG.FREE_DELIVERY_MIN - sub);

  body.innerHTML += `
    <div class="progress-note">${
      free
        ? t("freeDeliveryMsg")
        : t("addMoreForFree").replace("more", `<strong>${fmt(left)}</strong> more`).replace("ещё", `<strong>${fmt(left)}</strong> ещё`).replace("再添加", `再添加 <strong>${fmt(left)}</strong>`)
    }</div>
    <div class="progress"><div class="progress__bar" style="width:${pct}%"></div></div>
  `;

  /* totals + order form */
  const fee   = free ? 0 : CONFIG.DELIVERY_FEE;
  const total = sub + fee;

  foot.innerHTML = `
    <div class="total-row"><span>${t("subtotal")}</span><span>${fmt(sub)}</span></div>
    <div class="total-row"><span>${t("delivery")}</span><span>${free ? t("free") : fmt(fee)}</span></div>
    <div class="total-row total-row--grand"><span>${t("total")}</span><span>${fmt(total)}</span></div>

    <div class="pill-group">
      <button type="button" class="pill ${orderForm.pay === "Cash" ? "pill--active" : ""}" data-pay="Cash">💵 ${t("cash")}</button>
      <button type="button" class="pill ${orderForm.pay === "Card" ? "pill--active" : ""}" data-pay="Card">💳 ${t("card")}</button>
    </div>

    <div class="field"><label>${t("name")}</label>
      <input id="ordName" placeholder="${t("name")}" value="${esc(orderForm.name)}"></div>
    <div class="field"><label>${t("phone")}</label>
      <input id="ordPhone" placeholder="+66 …" value="${esc(orderForm.phone)}"></div>
    <div class="field"><label>${t("deliveryAddress")}</label>
      <textarea id="ordAddr" rows="2" placeholder="Hotel / condo / address">${esc(orderForm.addr)}</textarea></div>

    <button class="btn btn--primary" id="orderBtn" type="button">${t("placeOrder")} · ${fmt(total)}</button>
    <p class="order-note">The Order is Sent to The WhatsApp.</p>
  `;

  /* events */
  $$("[data-inc]", body).forEach((b) =>
    b.addEventListener("click", () => setQty(b.dataset.inc, cart[b.dataset.inc] + 1)));
  $$("[data-dec]", body).forEach((b) =>
    b.addEventListener("click", () => setQty(b.dataset.dec, cart[b.dataset.dec] - 1)));
  $$("[data-remove]", body).forEach((b) =>
    b.addEventListener("click", () => setQty(b.dataset.remove, 0)));

  $$("[data-pay]", foot).forEach((b) =>
    b.addEventListener("click", () => { orderForm.pay = b.dataset.pay; orderForm = { ...orderForm, ...readForm() }; renderDrawer(); }));

  const orderBtn = $("#orderBtn", foot);
  if (orderBtn) orderBtn.addEventListener("click", placeOrder);
}

/* ---------- place order (no backend → opens messenger) ---------- */
function placeOrder() {
  orderForm = { ...orderForm, ...readForm() };
  const items = cartItems();
  const sub   = cartSubtotal();
  const free  = sub >= CONFIG.FREE_DELIVERY_MIN;
  const total = sub + (free ? 0 : CONFIG.DELIVERY_FEE);

  const text =
    `New order — ${CONFIG.BRAND} (${CONFIG.CITY})\n\n` +
    items.map((p) => `• ${p.name} (${p.volume}) ×${p.qty} — ${fmt(p.price * p.qty)}`).join("\n") +
    `\n\nSubtotal: ${fmt(sub)}\nDelivery: ${free ? "free" : fmt(CONFIG.DELIVERY_FEE)}\nTotal: ${fmt(total)}` +
    `\nPayment: ${orderForm.pay}` +
    `\n\nName: ${orderForm.name || "—"}\nPhone: ${orderForm.phone || "—"}\nAddress: ${orderForm.addr || "—"}`;

  const url = CONFIG.WHATSAPP_URL + (CONFIG.WHATSAPP_URL.includes("?") ? "&" : "?") + "text=" + encodeURIComponent(text);

  window.open(url, "_blank");

  cart = {};
  saveCart();
  renderBadge();
  orderForm = { pay: "Cash", contact: "WhatsApp", name: "", phone: "", addr: "" };

  $("#drawerBody").innerHTML = `
    <div class="cart-empty">✅<br/><strong>${t("orderSent")}</strong><br/>
    ${t("checkChat")}<br/><br/>
    <span class="muted">WhatsApp: <a href="${CONFIG.WHATSAPP_URL}" target="_blank" rel="noopener" style="color: var(--accent); text-decoration: underline;">${CONFIG.WHATSAPP_URL.replace('https://wa.me/', '+')}</a></span></div>`;
  $("#drawerFoot").innerHTML = "";
}

/* ---------- home page: category tiles ---------- */
function initHome() {
  const grid = $("#catGrid");
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map((c) => `
    <a class="cat-card" href="shop.html?cat=${c.id}">
      <span class="cat-card__icon">${c.icon}</span>
      <span class="cat-card__name">${c.name}</span>
    </a>
  `).join("");
}

/* ---------- shop page: filters, search, sort ---------- */
function initShop() {
  const grid = $("#productGrid");
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  const catParam = params.get("cat");
  // fall back to "all" if the category in the URL doesn't exist (e.g. deleted)
  const state = {
    cat: (catParam && CATEGORIES.some((c) => c.id === catParam)) ? catParam : "all",
    origin: "all",
    subcat: "all",
    q: "",
    sort: "default",
  };

  /* category chips */
  const chips = $("#catChips");
  chips.innerHTML = [
    `<button class="chip" data-cat="all">${t("all")}</button>`,
    ...CATEGORIES.map((c) => `<button class="chip" data-cat="${c.id}">${c.icon} ${c.name}</button>`),
  ].join("");

  /* Thai / Non-Thai subcategory chips — only for alcohol categories */
  const originChips = $("#originChips");
  function renderOriginChips() {
    const cat = CATEGORIES.find((c) => c.id === state.cat);
    if (!cat || !cat.alcohol) { originChips.hidden = true; return; }
    originChips.hidden = false;
    originChips.innerHTML = [
      `<button class="chip" data-origin="all" data-i18n="all">${t("all")}</button>`,
      `<button class="chip" data-origin="thai" data-i18n="thaiProducts">${t("thaiProducts")}</button>`,
      `<button class="chip" data-origin="intl" data-i18n="nonThaiProducts">${t("nonThaiProducts")}</button>`,
    ].join("");
    syncOriginChips();
    $$("[data-origin]", originChips).forEach((ch) =>
      ch.addEventListener("click", () => {
        state.origin = ch.dataset.origin;
        syncOriginChips();
        renderProducts();
      }));
  }
  function syncOriginChips() {
    $$("[data-origin]", originChips).forEach((ch) =>
      ch.classList.toggle("chip--active", ch.dataset.origin === state.origin));
  }

  /* ---------- subcategory chips (per category) ---------- */
  const SUBCATS = {
    spirits: {
      vodka:  { name: "Vodka",  icon: "🥃" },
      rum:    { name: "Rum",    icon: "🥃" },
      whiskey:{ name: "Whiskey",icon: "🥃" },
      gin:    { name: "Gin",    icon: "🥃" },
      tequila:{ name: "Tequila",icon: "🥃" },
      liquor: { name: "Liquor", icon: "🥃" },
      brandy: { name: "Brandy / Cognac", icon: "🥃" },
    },
    wine: {
      "red-wine":   { name: "Red Wine",   icon: "🍷" },
      "white-wine": { name: "White Wine", icon: "🍷" },
      champagne:    { name: "Champagne / Sparkling", icon: "🍾" },
    },
  };
  const subcatChips = $("#subcatChips");
  function renderSubcatChips() {
    const cats = SUBCATS[state.cat];
    if (!subcatChips) return;
    if (!cats) { subcatChips.hidden = true; return; }
    subcatChips.hidden = false;
    subcatChips.innerHTML = [
      `<button class="chip" data-subcat="all">${t("all")}</button>`,
      ...Object.entries(cats).map(([key, s]) =>
        `<button class="chip" data-subcat="${key}">${s.icon} ${s.name}</button>`),
    ].join("");
    syncSubcatChips();
    $$("[data-subcat]", subcatChips).forEach((ch) =>
      ch.addEventListener("click", () => {
        state.subcat = ch.dataset.subcat;
        syncSubcatChips();
        renderProducts();
      }));
  }
  function syncSubcatChips() {
    if (!subcatChips) return;
    $$("[data-subcat]", subcatChips).forEach((ch) =>
      ch.classList.toggle("chip--active", ch.dataset.subcat === state.subcat));
  }

  function syncChips() {
    $$("[data-cat]", chips).forEach((ch) =>
      ch.classList.toggle("chip--active", ch.dataset.cat === state.cat));
  }
  $$("[data-cat]", chips).forEach((ch) =>
    ch.addEventListener("click", () => {
      state.cat = ch.dataset.cat;
      state.origin = "all";
      state.subcat = "all";
      syncChips();
      renderOriginChips();
      renderSubcatChips();
      /* file:// preview throws a SecurityError here — URL update is cosmetic, skip it */
      try {
        const qp = new URLSearchParams();
        if (state.cat !== "all") qp.set("cat", state.cat);
        history.replaceState(null, "", "shop.html" + (qp.toString() ? "?" + qp.toString() : ""));
      } catch (_) { /* ignore */ }
      renderProducts();
    }));
  syncChips();
  renderOriginChips();
  renderSubcatChips();

  $("#searchInput").addEventListener("input", (e) => { state.q = e.target.value; renderProducts(); });
  $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderProducts(); });

  function renderProducts() {
    let list = [...PRODUCTS];
    if (state.cat !== "all") list = list.filter((p) => p.cat === state.cat);
    if (state.origin !== "all") list = list.filter((p) => p.origin === state.origin);
    if (state.subcat !== "all") list = list.filter((p) => p.subcat === state.subcat);
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) || catName(p.cat).toLowerCase().includes(q));
    }
    if (state.sort === "price-asc")  list.sort((a, b) => minPrice(a) - minPrice(b));
    if (state.sort === "price-desc") list.sort((a, b) => minPrice(b) - minPrice(a));
    if (state.sort === "name")       list.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = list.map((p) => {
      const initialImg = hasVariants(p) && p.variants[0]?.img ? p.variants[0].img : p.img;
      const icon = `
        <div class="product-card__icon">${
          initialImg
            ? `<img id="product-img-${esc(p.id)}" src="${esc(initialImg)}" alt="${esc(p.name)}" loading="lazy" onerror="this.parentElement.classList.add('product-card__icon--fallback'); this.remove();">`
            : catIcon(p.cat)
        }</div>`;

      /* ---- variant product: pack selector + ml selector ---- */
      if (hasVariants(p)) {
        const packRow = `
          <div class="variant-row">
            <span class="variant-title">${t("pack")}</span>
            <div class="variant-opts">${p.variants.map((v, vi) => `
              <label class="variant-opt">
                <input type="radio" name="pack_${p.id}" value="${vi}" ${vi === 0 ? "checked" : ""}>
                <span>${esc(v.pack)}</span>
              </label>`).join("")}
            </div>
          </div>`;
        const sizeRows = p.variants.map((v, vi) => `
          <div class="variant-row variant-sizes" data-pack="${vi}" ${vi === 0 ? "" : "hidden"}>
            <span class="variant-title">${t("ml")}</span>
            <div class="variant-opts">${v.sizes.map((s, si) => `
              <label class="variant-opt">
                <input type="radio" name="size_${p.id}_${vi}" value="${si}" ${si === 0 ? "checked" : ""}>
                <span>${esc(s.ml.replace(/\s*ml$/i, ""))}</span>
              </label>`).join("")}
            </div>
          </div>`).join("");

        return `
        <article class="product-card" data-pid="${esc(p.id)}">
          ${icon}
          <div class="product-card__cat">${catName(p.cat)}</div>
          <h3 class="product-card__name">${p.name}</h3>
          <div class="product-card__variants">
            ${packRow}
            ${sizeRows}
          </div>
          <div class="product-card__row">
            <div class="product-card__price" data-price>${fmt(p.variants[0].sizes[0].price)}</div>
            <button class="add-btn" type="button" data-add-variant="${esc(p.id)}">${t("add")}</button>
          </div>
        </article>`;
      }

      /* ---- plain product ---- */
      return `
      <article class="product-card" data-pid="${esc(p.id)}">
        ${icon}
        <div class="product-card__cat">${catName(p.cat)}</div>
        <h3 class="product-card__name">${p.name}</h3>
        <div class="product-card__meta">${p.volume || ""}</div>
        <div class="product-card__row">
          <div class="product-card__price">${fmt(p.price)}</div>
          <button class="add-btn" type="button" data-add="${esc(p.id)}">${t("add")}</button>
        </div>
      </article>`;
    }).join("");

    $("#emptyMsg").hidden = list.length > 0;
    if ($("#emptyMsg")) $("#emptyMsg").textContent = t("noMatches");

    /* variant cards: keep price in sync + add the chosen variant to the cart */
    $$(".product-card[data-pid]", grid).forEach((card) => {
      const p = PRODUCTS.find((x) => x.id === card.dataset.pid);
      if (!p || !hasVariants(p)) return;
      const priceEl = $("[data-price]", card);
      const current = () => {
        const packInput = $(`input[name="pack_${p.id}"]:checked`, card);
        const vi = packInput ? Number(packInput.value) : 0;
        const si = Number($(`input[name="size_${p.id}_${vi}"]:checked`, card).value);
        return { vi, si };
      };
      const syncPrice = () => {
        const { vi, si } = current();
        priceEl.textContent = fmt(p.variants[vi].sizes[si].price);
      };

      $$(`input[name="pack_${p.id}"]`, card).forEach((r) =>
        r.addEventListener("change", () => {
          $$(".variant-sizes", card).forEach((row) => (row.hidden = row.dataset.pack !== r.value));
          const vi = Number(r.value);
          const imgEl = $(`#product-img-${esc(p.id)}`);
          if (imgEl && p.variants[vi].img) imgEl.src = p.variants[vi].img;
          syncPrice();
        }));
      $$(".variant-sizes input", card).forEach((r) => r.addEventListener("change", syncPrice));

      const btn = $("[data-add-variant]", card);
      btn.addEventListener("click", () => {
        const { vi, si } = current();
        addToCart(variantKey(p.id, vi, si));
        const old = t("add");
        btn.textContent = t("added");
        setTimeout(() => (btn.textContent = old), 900);
      });
    });

    $$("[data-add]", grid).forEach((btn) =>
      btn.addEventListener("click", () => {
        addToCart(btn.dataset.add);
        const old = t("add");
        btn.textContent = t("added");
        setTimeout(() => (btn.textContent = old), 900);
      }));
  }

  renderProducts();
  refreshShop = renderProducts;
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  injectSharedUI();   // drawer + float buttons first…
  applyConfig();      // …so CONFIG also applies to injected links
  renderBadge();
  initHome();
  initShop();
  applyTranslations();
});
