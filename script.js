/* ============================================================
   ApnaStore – script.js  (v3 – Connected to Backend API)
============================================================ */
"use strict";

/* ══════════════════════════════════════
   BACKEND API URL
   (your Node.js server running locally)
══════════════════════════════════════ */
const API = "http://localhost:5000/api/v1";

/* ══════════════════════════════════════
   PRODUCTS — loaded from backend
══════════════════════════════════════ */
let PRODUCTS = []; // starts empty, filled from backend

/* ══════════════════════════════════════
   REAL PRODUCT IMAGES
   (high-quality free stock photos)
══════════════════════════════════════ */
const PRODUCT_IMAGES = {
  // Electronics
  "Wireless Noise-Cancelling Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80",
  "Smart Watch Pro":                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
  "Bluetooth Speaker":                    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&q=80",

  // Fashion
  "Men's Slim-Fit Kurta":                 "https://images.unsplash.com/photo-1617627143233-c85bd8e2f54f?w=400&h=400&fit=crop&q=80",
  "Women's Floral Saree":                 "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&q=80",
  "Men's Running Shoes":                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80",

  // Home & Living
  "Stainless Steel Cookware Set":         "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80",
  "Artificial Monstera Plant":            "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop&q=80",
  "Cotton Bed Sheet Set (King)":          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop&q=80",
  "Cotton Bed Sheet Set":                 "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop&q=80",

  // Beauty
  "Vitamin C Face Serum":                 "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80",
  "Vitamin C Serum":                      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&q=80",
  "Matte Lipstick Set (12 Shades)":       "https://images.unsplash.com/photo-1586495777744-4e6232bf2e29?w=400&h=400&fit=crop&q=80",
  "Face Wash & Moisturiser Combo":        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&q=80",
};

// Category fallback images (if product not found by name)
const CATEGORY_IMAGES = {
  "electronics":   "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&q=80",
  "fashion":       "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&q=80",
  "home & living": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80",
  "home":          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&q=80",
  "beauty":        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80",
  "sports":        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop&q=80",
  "grocery":       "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
};

function getProductImage(name, category) {
  // Try exact name match first
  if (PRODUCT_IMAGES[name]) return PRODUCT_IMAGES[name];
  // Try partial name match
  const key = Object.keys(PRODUCT_IMAGES).find(k => name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase()));
  if (key) return PRODUCT_IMAGES[key];
  // Fall back to category image
  const cat = (category || "").toLowerCase();
  return CATEGORY_IMAGES[cat] || CATEGORY_IMAGES["electronics"];
}

const REVIEWS_DATA = [
  { name:"Priya Sharma",  city:"Mumbai",    stars:5, text:"ApnaStore has the best collection and super-fast delivery. Got my order in 2 days. Highly recommend!", highlight:false, date:"2 days ago" },
  { name:"Rahul Verma",   city:"Delhi",     stars:5, text:"Amazing prices and genuine products. The return policy is hassle-free. ApnaStore is my go-to for everything!", highlight:true, date:"1 week ago" },
  { name:"Anita Patel",   city:"Bengaluru", stars:4, text:"Great variety of products. Customer support is very responsive. Will definitely shop here again!", highlight:false, date:"3 days ago" },
  { name:"Karan Mehta",   city:"Pune",      stars:5, text:"Ordered electronics worth ₹8,000 and received genuine branded products with proper packaging. Superb!", highlight:false, date:"5 days ago" },
  { name:"Sneha Joshi",   city:"Jaipur",    stars:5, text:"The flash sale deals are unbelievable! Saved over ₹3,000 on my last order. Love this store!", highlight:false, date:"1 day ago"  },
  { name:"Amit Singh",    city:"Chennai",   stars:4, text:"Good experience overall. Packaging was excellent, delivery was on time. Minor delay in tracking updates.", highlight:false, date:"4 days ago" },
];

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
let cart           = JSON.parse(localStorage.getItem("apna_cart") || "[]");
let wishlist       = JSON.parse(localStorage.getItem("apna_wishlist") || "[]");
let recentSearches = JSON.parse(localStorage.getItem("apna_searches") || "[]");
let currentUser    = JSON.parse(localStorage.getItem("apna_user") || "null");
let authToken      = localStorage.getItem("apna_token") || null;
let activeFilter   = "all";
let visibleCount   = 8;
let selectedStars  = 0;
let couponDiscount = 0;
let placedOrderId  = "";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ══════════════════════════════════════
   API HELPER — talks to backend
══════════════════════════════════════ */
async function apiFetch(endpoint, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  try {
    const res  = await fetch(`${API}${endpoint}`, { ...options, headers: { ...headers, ...options.headers } });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error("API error:", err);
    return { ok: false, data: { message: "Network error. Is the server running?" } };
  }
}

/* ══════════════════════════════════════
   DARK MODE
══════════════════════════════════════ */
const darkToggle = $("#darkToggle");
let isDark = localStorage.getItem("apna_dark") === "true";

function applyTheme(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  darkToggle.querySelector(".sun-icon").style.display  = dark ? "none"  : "inline";
  darkToggle.querySelector(".moon-icon").style.display = dark ? "inline" : "none";
}
applyTheme(isDark);
darkToggle.addEventListener("click", () => {
  isDark = !isDark;
  localStorage.setItem("apna_dark", isDark);
  applyTheme(isDark);
  showToast(isDark ? "🌙 Dark mode on" : "☀️ Light mode on");
});

/* ══════════════════════════════════════
   NAVBAR / SCROLL
══════════════════════════════════════ */
const navbar    = $("#navbar");
const hamburger = $("#hamburger");
const navLinks  = $("#navLinks");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
  $("#backToTop").classList.toggle("show", window.scrollY > 400);
});
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
$$(".nav-link").forEach(l => l.addEventListener("click", () => {
  hamburger.classList.remove("open");
  navLinks.classList.remove("open");
}));

const sections = $$("section[id]");
sections.forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        $$(".nav-link").forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-40% 0px -40% 0px" }).observe(s);
});

$("#backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ══════════════════════════════════════
   ADVANCED SEARCH
══════════════════════════════════════ */
const searchToggle   = $("#searchToggle");
const searchBar      = $("#searchBar");
const searchInput    = $("#searchInput");
const searchDropdown = $("#searchDropdown");
const searchClear    = $("#searchClear");

searchToggle.addEventListener("click", () => {
  searchBar.classList.toggle("open");
  if (searchBar.classList.contains("open")) { renderSearchDropdown(""); searchInput.focus(); }
  else searchDropdown.classList.remove("visible");
});

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim();
  searchClear.style.display = q ? "block" : "none";
  renderSearchDropdown(q);
  searchDropdown.classList.add("visible");
});

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") commitSearch(searchInput.value.trim());
  if (e.key === "Escape") { searchBar.classList.remove("open"); searchDropdown.classList.remove("visible"); }
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchClear.style.display = "none";
  renderSearchDropdown("");
});

document.addEventListener("click", e => {
  if (!searchBar.contains(e.target) && e.target !== searchToggle)
    searchDropdown.classList.remove("visible");
});

function renderSearchDropdown(q) {
  const suggestionsEl = $("#searchSuggestions");
  const recentBox     = $("#recentSearchesBox");
  const recentList    = $("#recentSearchesList");

  if (q.length >= 1) {
    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.category?.name || p.category || "").toLowerCase().includes(q.toLowerCase())
    ).slice(0, 5);

    suggestionsEl.innerHTML = matches.length
      ? `<div class="search-section-label">Products</div>` +
        matches.map(p => `
          <div class="search-result-item" onclick="selectSearchResult('${p.name}', '${p._id}')">
            <div class="search-result-emoji">${p.emoji}</div>
            <div class="search-result-info">
              <div class="search-result-name">${highlight(p.name, q)}</div>
              <div class="search-result-cat">${p.category?.name || p.category || ""}</div>
            </div>
            <div class="search-result-price">₹${p.price.toLocaleString()}</div>
          </div>`).join("")
      : `<div style="padding:16px;color:var(--text-light);font-size:14px">No results for "<strong>${q}</strong>"</div>`;

    recentBox.style.display = "none";
  } else {
    suggestionsEl.innerHTML = "";
    recentBox.style.display = recentSearches.length ? "block" : "none";
    recentList.innerHTML = recentSearches.slice(0, 4).map(r =>
      `<div class="recent-item" onclick="commitSearch('${r}')">🕐 ${r}</div>`
    ).join("");
  }
}

function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q})`, "gi");
  return text.replace(re, '<strong style="color:var(--primary)">$1</strong>');
}

function selectSearchResult(name, id) {
  commitSearch(name);
  searchDropdown.classList.remove("visible");
  searchBar.classList.remove("open");
  setTimeout(() => {
    const card = $(`[data-id="${id}"]`);
    if (card) { card.scrollIntoView({ behavior: "smooth", block: "center" }); card.style.outline = "3px solid var(--primary)"; setTimeout(() => card.style.outline = "", 2000); }
  }, 400);
}

function commitSearch(q) {
  if (!q) return;
  saveRecentSearch(q);
  searchBar.classList.remove("open");
  searchDropdown.classList.remove("visible");
  searchInput.value = "";
  searchClear.style.display = "none";
  loadAndRenderProducts("all", q.toLowerCase());
  $("#products").scrollIntoView({ behavior: "smooth" });
}

function saveRecentSearch(q) {
  recentSearches = [q, ...recentSearches.filter(r => r !== q)].slice(0, 6);
  localStorage.setItem("apna_searches", JSON.stringify(recentSearches));
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("trend-tag")) commitSearch(e.target.dataset.q);
});

/* ══════════════════════════════════════
   LOAD PRODUCTS FROM BACKEND
══════════════════════════════════════ */
async function loadAndRenderProducts(filter = "all", searchQuery = "") {
  activeFilter = filter;

  // Show skeleton
  $("#skeletonGrid").style.display = "grid";
  $("#productsGrid").style.display = "none";
  $("#loadMore").style.display = "none";

  // Build query string for API
  let url = `/products?limit=12`;
  if (filter !== "all") url += `&category=${getCategoryIdByName(filter)}`;
  if (searchQuery)      url += `&search=${encodeURIComponent(searchQuery)}`;

  const { ok, data } = await apiFetch(url);

  // Hide skeleton, show grid
  $("#skeletonGrid").style.display = "none";
  $("#productsGrid").style.display = "grid";

  if (!ok || !data.products?.length) {
    PRODUCTS = [];
    $("#productsGrid").innerHTML = `<p style="text-align:center;color:var(--text-light);grid-column:1/-1;padding:60px 0">No products found.</p>`;
    return;
  }

  // Normalize backend data to match what the UI expects
  PRODUCTS = data.products.map(normalizeProduct);

  const grid = $("#productsGrid");
  grid.innerHTML = PRODUCTS.slice(0, 8).map(createProductCard).join("");
  attachProductEvents();

  // Show Load More if there are more pages
  const loadMoreBtn = $("#loadMore");
  loadMoreBtn._allProducts = PRODUCTS;
  loadMoreBtn._page = 1;
  loadMoreBtn._filter = filter;
  loadMoreBtn._search = searchQuery;
  loadMoreBtn._totalPages = data.pages || 1;
  loadMoreBtn.style.display = data.pages > 1 || PRODUCTS.length > 8 ? "inline-flex" : "none";
}

// Converts backend product format → frontend format
function normalizeProduct(p) {
  const catName = p.category?.name || p.category || "general";
  // Use backend image if available, otherwise use our real photo map
  const backendImg = p.images?.find(i => i.isPrimary)?.url || p.images?.[0]?.url || null;
  return {
    _id:      p._id,
    id:       p._id,
    name:     p.name,
    category: catName,
    price:    p.price,
    original: p.originalPrice || p.price,
    rating:   p.averageRating || 0,
    reviews:  p.numReviews    || 0,
    emoji:    p.emoji || "📦",
    badge:    p.badge || "",
    viewers:  Math.floor(Math.random() * 30) + 1,
    stock:    p.stock,
    image:    backendImg || getProductImage(p.name, catName),
  };
}

// Maps category name to MongoDB _id (loaded from backend)
let categoriesMap = {};
function getCategoryIdByName(name) {
  return categoriesMap[name.toLowerCase()] || "";
}

async function loadCategories() {
  const { ok, data } = await apiFetch("/categories");
  if (ok && data.categories) {
    data.categories.forEach(c => {
      categoriesMap[c.name.toLowerCase()] = c._id;
    });
  }
}

/* ══════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════ */
function getDiscount(orig, price) {
  if (!orig || orig <= price) return 0;
  return Math.round((1 - price / orig) * 100);
}

function createProductCard(p) {
  const disc  = getDiscount(p.original, p.price);
  const liked = wishlist.includes(p._id || p.id);
  return `
    <div class="product-card" data-id="${p._id || p.id}" data-category="${p.category}">
      <div class="product-img">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <button class="product-wishlist ${liked ? "liked" : ""}" data-id="${p._id || p.id}">${liked ? "❤️" : "🤍"}</button>
        <img
          src="${p.image}"
          alt="${p.name}"
          loading="lazy"
          style="width:100%;height:100%;object-fit:cover;display:block;"
          onerror="this.src='https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop&q=80'"
        />
        <div class="product-live"><span class="live-dot-sm"></span>${p.viewers} viewing</div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))} <span>(${p.reviews.toLocaleString()})</span></div>
        <div class="product-price">
          <span class="price-current">₹${p.price.toLocaleString()}</span>
          ${disc > 0 ? `<span class="price-original">₹${p.original.toLocaleString()}</span><span class="price-off">${disc}% off</span>` : ""}
        </div>
        <button class="add-to-cart" data-id="${p._id || p.id}">Add to Cart</button>
      </div>
    </div>`;
}

function attachProductEvents() {
  $$(".add-to-cart").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.id)));
  $$(".product-wishlist").forEach(btn => btn.addEventListener("click", () => toggleWishlist(btn.dataset.id, btn)));
}

// Filter tabs
$$(".filter-btn").forEach(btn => btn.addEventListener("click", () => {
  $$(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  loadAndRenderProducts(btn.dataset.filter);
}));

// Category cards
$$(".cat-card").forEach(card => card.addEventListener("click", () => {
  const cat = card.dataset.category;
  $$(".filter-btn").forEach(b => b.classList.toggle("active", b.dataset.filter === cat));
  loadAndRenderProducts(cat);
  $("#products").scrollIntoView({ behavior: "smooth" });
}));

// Load More
$("#loadMore").addEventListener("click", async function () {
  this._page = (this._page || 1) + 1;
  let url = `/products?page=${this._page}&limit=4`;
  if (this._filter && this._filter !== "all") url += `&category=${getCategoryIdByName(this._filter)}`;
  if (this._search) url += `&search=${encodeURIComponent(this._search)}`;
  const { ok, data } = await apiFetch(url);
  if (ok && data.products?.length) {
    const newProducts = data.products.map(normalizeProduct);
    PRODUCTS = [...PRODUCTS, ...newProducts];
    newProducts.forEach(p => {
      $("#productsGrid").insertAdjacentHTML("beforeend", createProductCard(p));
    });
    attachProductEvents();
    if (this._page >= (data.pages || 1)) this.style.display = "none";
  } else {
    this.style.display = "none";
  }
});

/* ══════════════════════════════════════
   CART (stored locally)
══════════════════════════════════════ */
function saveCart() { localStorage.setItem("apna_cart", JSON.stringify(cart)); updateCartCount(); }

function updateCartCount() {
  const n = cart.reduce((s, i) => s + i.qty, 0);
  $("#cartCount").textContent = n;
}

function addToCart(id) {
  const p = PRODUCTS.find(p => (p._id || p.id) == id);
  if (!p) return;
  const ex = cart.find(i => i.id == id);
  ex ? ex.qty++ : cart.push({ id, qty: 1, name: p.name, price: p.price, emoji: p.emoji });
  saveCart(); renderCart();
  showToast(`🛒 "${p.name}" added to cart!`);
}

function removeFromCart(id) { cart = cart.filter(i => i.id != id); saveCart(); renderCart(); }

function changeQty(id, delta) {
  const item = cart.find(i => i.id == id);
  if (item) { item.qty = Math.max(1, item.qty + delta); saveCart(); renderCart(); }
}

function renderCart() {
  const container = $("#cartItems");
  const footer    = $("#cartFooter");
  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty"><span>🛒</span><p>Your cart is empty</p><a href="#products" class="btn btn-primary" id="startShoppingBtn">Start Shopping</a></div>`;
    footer.style.display = "none"; return;
  }
  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    subtotal += item.price * item.qty;
    return `<div class="cart-item" data-id="${item.id}">
      <div class="cart-item-emoji">${item.emoji || "📦"}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>
      <button class="remove-item" data-id="${item.id}">✕</button>
    </div>`;
  }).join("");
  footer.style.display = "block";
  const total = subtotal - couponDiscount;
  $("#cartSubtotal").textContent = `₹${subtotal.toLocaleString()}`;
  $("#cartTotal").textContent    = `₹${Math.max(0, total).toLocaleString()}`;
  $$(".qty-btn").forEach(btn => btn.addEventListener("click", () => changeQty(btn.dataset.id, +btn.dataset.delta)));
  $$(".remove-item").forEach(btn => btn.addEventListener("click", () => removeFromCart(btn.dataset.id)));
}

const cartToggle  = $("#cartToggle");
const cartSidebar = $("#cartSidebar");
const cartOverlay = $("#cartOverlay");

function openCart()    { cartSidebar.classList.add("open"); cartOverlay.classList.add("open"); document.body.style.overflow = "hidden"; renderCart(); }
function closeCartFn() { cartSidebar.classList.remove("open"); cartOverlay.classList.remove("open"); document.body.style.overflow = ""; }

cartToggle.addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCartFn);
cartOverlay.addEventListener("click", closeCartFn);
document.addEventListener("click", e => { if (e.target.id === "startShoppingBtn") closeCartFn(); });

/* ══════════════════════════════════════
   WISHLIST
══════════════════════════════════════ */
function toggleWishlist(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) { wishlist.push(id); btn.innerHTML = "❤️"; btn.classList.add("liked"); showToast("❤️ Added to wishlist!"); }
  else            { wishlist.splice(idx, 1); btn.innerHTML = "🤍"; btn.classList.remove("liked"); showToast("Removed from wishlist"); }
  localStorage.setItem("apna_wishlist", JSON.stringify(wishlist));
  const wc = $("#wishlistCount");
  wc.textContent = wishlist.length;
  wc.style.display = wishlist.length ? "flex" : "none";
}

function initWishlistCount() {
  const wc = $("#wishlistCount");
  wc.textContent = wishlist.length;
  wc.style.display = wishlist.length ? "flex" : "none";
}

/* ══════════════════════════════════════
   AUTHENTICATION — connected to backend
══════════════════════════════════════ */
function switchAuthTab(tab) {
  $("#loginForm").style.display  = tab === "login"  ? "block" : "none";
  $("#signupForm").style.display = tab === "signup" ? "block" : "none";
  $("#loginTab").classList.toggle("active",  tab === "login");
  $("#signupTab").classList.toggle("active", tab === "signup");
}

async function handleLogin() {
  const email = $("#loginEmail").value.trim();
  const pass  = $("#loginPassword").value.trim();
  if (!email || !pass) { showToast("⚠️ Please fill in all fields"); return; }

  const btn = $(".auth-modal .btn-primary");
  btn.textContent = "Signing in…";

  const { ok, data } = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password: pass })
  });

  btn.textContent = "Sign In";

  if (!ok) { showToast(`❌ ${data.message}`); return; }

  authToken   = data.accessToken;
  currentUser = data.user;
  localStorage.setItem("apna_token", authToken);
  localStorage.setItem("apna_user",  JSON.stringify(currentUser));
  updateAuthUI();
  closeModal("authModal");
  showToast(`👋 Welcome back, ${currentUser.firstName}!`);
}

async function handleSignup() {
  const first = $("#signupFirst").value.trim();
  const last  = $("#signupLast").value.trim();
  const email = $("#signupEmail").value.trim();
  const pass  = $("#signupPassword").value.trim();
  const terms = $("#termsCheck").checked;
  if (!first || !last || !email || !pass) { showToast("⚠️ Please fill in all fields"); return; }
  if (!terms) { showToast("⚠️ Please accept terms"); return; }

  const btn = $("#signupForm .btn-primary");
  btn.textContent = "Creating account…";

  const { ok, data } = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ firstName: first, lastName: last, email, password: pass })
  });

  btn.textContent = "Create Account";

  if (!ok) { showToast(`❌ ${data.message}`); return; }

  authToken   = data.accessToken;
  currentUser = data.user;
  localStorage.setItem("apna_token", authToken);
  localStorage.setItem("apna_user",  JSON.stringify(currentUser));
  updateAuthUI();
  closeModal("authModal");
  showToast(`🎉 Welcome to ApnaStore, ${first}!`);
}

function socialLogin(provider) {
  // Social login needs OAuth setup — for now shows a friendly message
  showToast(`ℹ️ Social login coming soon! Please use email & password.`);
}

function updateAuthUI() {
  const btn = $("#authNavBtn");
  if (currentUser) {
    btn.textContent = currentUser.firstName || currentUser.name?.split(" ")[0] || "Account";
    btn.onclick = logoutUser;
  } else {
    btn.textContent = "Sign In";
    btn.onclick = () => openModal("authModal");
  }
}

async function logoutUser() {
  await apiFetch("/auth/logout", { method: "POST" });
  authToken   = null;
  currentUser = null;
  localStorage.removeItem("apna_token");
  localStorage.removeItem("apna_user");
  updateAuthUI();
  showToast("👋 Signed out successfully");
}

function togglePass(id) {
  const el = $(`#${id}`);
  el.type = el.type === "password" ? "text" : "password";
}

const signupPass = $("#signupPassword");
if (signupPass) signupPass.addEventListener("input", () => {
  const v = signupPass.value;
  const bar = $("#passwordStrength");
  bar.className = "password-strength";
  if (v.length > 10 && /[A-Z]/.test(v) && /[0-9]/.test(v)) bar.classList.add("strength-strong");
  else if (v.length >= 6) bar.classList.add("strength-medium");
  else if (v.length > 0)  bar.classList.add("strength-weak");
});

/* ══════════════════════════════════════
   ORDER TRACKING — connected to backend
══════════════════════════════════════ */
function getFutureDate(days) {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short" });
}

async function trackOrder() {
  const id     = $("#trackOrderId").value.trim().toUpperCase();
  const result = $("#trackResult");
  if (!id) { showToast("⚠️ Enter an Order ID"); return; }

  const trackBtn = $("#trackModal .btn-primary");
  trackBtn.textContent = "Tracking…";

  const { ok, data } = await apiFetch(`/orders/track/${id}`);
  trackBtn.textContent = "Track";

  if (!ok) {
    showToast(`❌ ${data.message || "Order not found"}`);
    result.style.display = "none";
    return;
  }

  const order = data.order;
  $("#trackIdDisplay").textContent = order.orderNumber;
  $("#trackProduct").textContent   = order.items?.[0]?.name || "Your Order";
  $("#trackDelivery").textContent  = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short" })
    : "Calculating…";

  // Build timeline from order status
  const allSteps = [
    { key:"placed",           label:"Order Placed",      icon:"✅", desc:"We received your order" },
    { key:"confirmed",        label:"Payment Confirmed",  icon:"💳", desc:"Payment verified" },
    { key:"packed",           label:"Packed & Shipped",   icon:"📦", desc:"Item packed & handed to courier" },
    { key:"out_for_delivery", label:"Out for Delivery",   icon:"🚚", desc:"Your package is on its way" },
    { key:"delivered",        label:"Delivered",          icon:"🏠", desc:"Package delivered" },
  ];

  const statusOrder = ["placed","confirmed","processing","packed","shipped","out_for_delivery","delivered"];
  const currentIdx  = statusOrder.indexOf(order.orderStatus);

  $("#trackTimeline").innerHTML = allSteps.map((s, i) => {
    const stepIdx = statusOrder.indexOf(s.key);
    const stepStatus = stepIdx < currentIdx ? "done" : stepIdx === currentIdx ? "active" : "pending";
    return `<div class="tl-step ${stepStatus}">
      <div class="tl-dot">${stepStatus === "done" ? "✓" : s.icon}</div>
      <div class="tl-info"><strong>${s.label}</strong><span>${s.desc}</span></div>
    </div>`;
  }).join("");

  result.style.display = "block";
}

function demoTrack(id) {
  $("#trackOrderId").value = id;
  trackOrder();
}

function openTrackFromSuccess() {
  closeModal("checkoutModal");
  setTimeout(() => {
    openModal("trackModal");
    if (placedOrderId) $("#trackOrderId").value = placedOrderId;
  }, 300);
}

/* ══════════════════════════════════════
   CHECKOUT — connected to backend
══════════════════════════════════════ */
function checkoutNext(step) {
  [1, 2, 3].forEach(n => {
    $(`#checkoutPage${n}`).style.display = "none";
    const el = $(`#cStep${n}`);
    el.classList.remove("active");
    if (n < step) el.classList.add("done");
  });
  $(`#checkoutPage${step}`).style.display = "block";
  $(`#cStep${step}`).classList.add("active");
  if (step === 3) renderCheckoutSummary();
}

function renderCheckoutSummary() {
  let subtotal = 0;
  const items = cart.map(item => {
    subtotal += item.price * item.qty;
    return `<div class="co-summary-item"><span class="co-emoji">${item.emoji || "📦"}</span><span class="co-name">${item.name} ×${item.qty}</span><span class="co-price">₹${(item.price * item.qty).toLocaleString()}</span></div>`;
  }).join("");
  $("#checkoutSummary").innerHTML = items;
  const total = Math.max(0, subtotal - couponDiscount);
  $("#finalTotal").textContent = `₹${total.toLocaleString()}`;
}

function applyCoupon() {
  const code = $("#couponInput").value.trim().toUpperCase();
  const msg  = $("#couponMsg");
  const COUPONS = { "APNA10": 0.10, "WELCOME20": 0.20, "SAVE50": 50, "APNA100": 100 };
  if (!COUPONS[code]) { msg.innerHTML = `<span style="color:var(--primary)">❌ Invalid coupon code</span>`; couponDiscount = 0; return; }
  const val      = COUPONS[code];
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  couponDiscount = val < 1 ? Math.round(subtotal * val) : val;
  msg.innerHTML  = `<span style="color:var(--success)">✅ Coupon applied! You save ₹${couponDiscount}</span>`;
  renderCart();
}

async function placeOrder() {
  if (!cart.length) { showToast("⚠️ Your cart is empty"); return; }

  // Get form values
  const name    = $("#coName")?.value.trim();
  const phone   = $("#coPhone")?.value.trim();
  const addr    = $("#coAddr")?.value.trim();
  const city    = $("#coCity")?.value.trim();
  const pin     = $("#coPin")?.value.trim();
  const payment = document.querySelector('input[name="payment"]:checked')?.value || "cod";

  if (!name || !phone || !addr || !city || !pin) {
    showToast("⚠️ Please fill in delivery address");
    checkoutNext(1); return;
  }

  const btn = $("#checkoutPage3 .btn-primary");
  btn.textContent = "Placing order…";

  // If user is logged in, send to backend
  if (authToken && currentUser) {
    const orderData = {
      shippingAddress: { fullName: name, phone, line1: addr, city, state: "India", pincode: pin },
      paymentMethod:   payment,
      couponCode:      $("#couponInput")?.value.trim().toUpperCase() || undefined,
      items: cart.map(i => ({ productId: i.id, quantity: i.qty }))
    };

    const { ok, data } = await apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderData)
    });

    btn.textContent = "🎉 Place Order";

    if (!ok) { showToast(`❌ ${data.message}`); return; }
    placedOrderId = data.order.orderNumber;
  } else {
    // Guest checkout — generate local order ID
    placedOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    btn.textContent = "🎉 Place Order";
  }

  $("#newOrderId").textContent = placedOrderId;
  [1, 2, 3].forEach(n => { $(`#checkoutPage${n}`).style.display = "none"; $(`#cStep${n}`).classList.add("done"); });
  $("#checkoutPage4").style.display = "block";

  cart = []; couponDiscount = 0;
  saveCart(); renderCart();
  confettiBurst();
}

function confettiBurst() {
  const colors = ["#E8470A","#F5A623","#2ECC71","#0062FF","#fff"];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;top:${Math.random()*40}%;left:${Math.random()*100}%;width:8px;height:8px;border-radius:50%;background:${colors[i%colors.length]};z-index:9999;pointer-events:none;animation:confettiFall ${1+Math.random()*2}s ease forwards;opacity:1`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}
const styleEl = document.createElement("style");
styleEl.textContent = `@keyframes confettiFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(300px) rotate(720deg);opacity:0}}`;
document.head.appendChild(styleEl);

/* ══════════════════════════════════════
   REVIEWS — connected to backend
══════════════════════════════════════ */
async function loadReviewsFromBackend() {
  // Try to get first product's reviews from backend
  if (PRODUCTS.length) {
    const { ok, data } = await apiFetch(`/products/${PRODUCTS[0]._id}/reviews`);
    if (ok && data.reviews?.length) {
      renderReviews(data.reviews.map(r => ({
        name:      `${r.user?.firstName || "Customer"} ${r.user?.lastName || ""}`,
        city:      "India",
        stars:     r.rating,
        text:      r.comment,
        highlight: r.rating === 5,
        date:      new Date(r.createdAt).toLocaleDateString("en-IN"),
      })));
      return;
    }
  }
  renderReviews(REVIEWS_DATA); // fallback to static
}

function renderReviews(data = REVIEWS_DATA) {
  const grid = $("#reviewsGrid");
  grid.innerHTML = data.map(r => `
    <div class="review-card ${r.highlight ? "highlight" : ""}">
      <div class="review-top">
        <div class="review-stars">${"★".repeat(r.stars)}${"☆".repeat(5-r.stars)}</div>
        <span class="review-verified">✓ Verified</span>
      </div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <div class="review-avatar">${r.name[0]}</div>
        <div class="review-author-info">
          <strong>${r.name}</strong>
          <span>${r.city}</span>
        </div>
        <span class="review-date">${r.date}</span>
      </div>
    </div>`).join("");
}

$$(".star-pick").forEach(s => {
  s.addEventListener("click", () => {
    selectedStars = +s.dataset.val;
    $$(".star-pick").forEach((sp, i) => sp.classList.toggle("active", i < selectedStars));
  });
  s.addEventListener("mouseover", () => {
    $$(".star-pick").forEach((sp, i) => sp.classList.toggle("active", i < +s.dataset.val));
  });
  s.addEventListener("mouseout", () => {
    $$(".star-pick").forEach((sp, i) => sp.classList.toggle("active", i < selectedStars));
  });
});

async function submitReview() {
  const name  = $("#reviewName").value.trim();
  const city  = $("#reviewCity").value.trim();
  const text  = $("#reviewText").value.trim();
  if (!name || !city || !text || !selectedStars) { showToast("⚠️ Please fill in all fields and select a rating"); return; }

  // If logged in and products loaded, save to backend
  if (authToken && PRODUCTS.length) {
    const { ok, data } = await apiFetch(`/products/${PRODUCTS[0]._id}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating: selectedStars, comment: text })
    });
    if (!ok) { showToast(`❌ ${data.message}`); return; }
  }

  REVIEWS_DATA.unshift({ name, city, stars: selectedStars, text, highlight: false, date: "Just now" });
  renderReviews();
  closeModal("reviewModal");
  showToast("🌟 Thank you for your review!");
  $("#reviewName").value = $("#reviewCity").value = $("#reviewText").value = "";
  selectedStars = 0;
  $$(".star-pick").forEach(s => s.classList.remove("active"));
}

function animateLiveViewers() {
  const el = $("#liveViewers");
  if (!el) return;
  el.textContent = `${20 + Math.floor(Math.random() * 15)} people`;
}
setInterval(animateLiveViewers, 8000);

/* ══════════════════════════════════════
   MODAL HELPERS
══════════════════════════════════════ */
function openModal(id) {
  const m = $(`#${id}`);
  if (!m) return;
  m.classList.add("open");
  document.body.style.overflow = "hidden";
  if (id === "checkoutModal") resetCheckout();
}
function closeModal(id) {
  const m = $(`#${id}`);
  if (!m) return;
  m.classList.remove("open");
  document.body.style.overflow = "";
}
window.openModal  = openModal;
window.closeModal = closeModal;

$$(".modal-overlay").forEach(ov => ov.addEventListener("click", e => {
  if (e.target === ov) closeModal(ov.id);
}));

function resetCheckout() {
  [1, 2, 3, 4].forEach(n => $(`#checkoutPage${n}`).style.display = n === 1 ? "block" : "none");
  $$(".checkout-step").forEach((s, i) => { s.classList.remove("active","done"); if (i === 0) s.classList.add("active"); });
  $("#couponMsg").innerHTML = "";
  couponDiscount = 0;
}

/* ══════════════════════════════════════
   COUNTDOWN TIMER
══════════════════════════════════════ */
(function initCountdown() {
  const key = "apna_flash_end";
  let end = parseInt(localStorage.getItem(key) || "0");
  if (!end || end < Date.now()) { end = Date.now() + 12 * 3600 * 1000; localStorage.setItem(key, end); }
  function tick() {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, "0");
    ["hours","minutes","seconds"].forEach((id, i) => { const el = $(`#${id}`); if (el) el.textContent = pad([h,m,s][i]); });
    if (!diff) { end = Date.now() + 12 * 3600 * 1000; localStorage.setItem(key, end); }
  }
  tick(); setInterval(tick, 1000);
})();

/* ══════════════════════════════════════
   NEWSLETTER
══════════════════════════════════════ */
$("#subscribeBtn").addEventListener("click", () => {
  const input = $("#emailInput"), success = $("#nlSuccess"), email = input.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast("⚠️ Enter a valid email"); input.focus(); return; }
  input.style.display = "none"; $("#subscribeBtn").style.display = "none";
  success.classList.add("show"); showToast("🎉 Subscribed!");
});

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
let toastTimer = null;
function showToast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}
window.showToast = showToast;

/* ══════════════════════════════════════
   IBM WATSON CHATBOT
══════════════════════════════════════ */
const WATSON_CONFIG = {
  apiKey:      "YOUR_IBM_WATSON_API_KEY",
  serviceUrl:  "YOUR_SERVICE_URL",
  assistantId: "YOUR_ASSISTANT_ID",
  version:     "2021-11-27"
};

const FALLBACK = {
  deals:       "🔥 Today's hottest deals: up to 70% off Electronics, 60% Fashion, 50% Home! <a href='#deals' onclick='closeChatWindow()'>View Deals →</a>",
  track:       "📦 To track your order, use the <a href='#' onclick='openModal(\"trackModal\");return false'>Track Order</a> tool or email support@apnastore.in.",
  return:      "🔄 We offer a <strong>30-day hassle-free return policy</strong>. Raise a return from your order history — free pickup in 48 hours.",
  shipping:    "🚚 Free shipping on orders ₹499+. Standard delivery 3–5 days. Express (1–2 days) at ₹99.",
  electronics: "💻 Top electronics: Headphones · Smart Watch · Bluetooth Speaker. <a href='#products' onclick='closeChatWindow()'>Browse →</a>",
  fashion:     "👗 8,700+ fashion items! Filter by category on the Products page. <a href='#products' onclick='closeChatWindow()'>Shop Fashion →</a>",
  payment:     "💳 We accept Credit/Debit cards, UPI (GPay, PhonePe, Paytm), Net Banking & Cash on Delivery. 100% secure.",
  offer:       "🎁 Use code <strong>APNA10</strong> for 10% off, <strong>WELCOME20</strong> for 20% off your first order!",
  contact:     "📞 Reach us at <strong>1800-123-4567</strong> or support@apnastore.in, Mon–Sat 9AM–7PM.",
  hello:       "👋 Hi! I'm <strong>ApnaBot</strong>. Ask me about deals, orders, returns & more!",
  default:     "🤖 I'm here to help! Ask about deals, shipping, returns, payments or products."
};

function getFallbackReply(t) {
  const l = t.toLowerCase();
  if (/deal|sale|offer|discount|flash/.test(l))         return FALLBACK.deals;
  if (/track|order|status/.test(l))                     return FALLBACK.track;
  if (/return|refund|exchange/.test(l))                 return FALLBACK.return;
  if (/ship|courier|delivery|days/.test(l))             return FALLBACK.shipping;
  if (/electron|laptop|phone|head|speaker|watch/.test(l)) return FALLBACK.electronics;
  if (/fashion|cloth|kurta|saree|shoe/.test(l))         return FALLBACK.fashion;
  if (/pay|upi|card|cod/.test(l))                       return FALLBACK.payment;
  if (/coupon|promo|code/.test(l))                      return FALLBACK.offer;
  if (/contact|call|email|support/.test(l))             return FALLBACK.contact;
  if (/^(hi|hello|hey|namaste)/.test(l))                return FALLBACK.hello;
  return FALLBACK.default;
}

let watsonSessionId = sessionStorage.getItem("watson_session_id") || null;
let chatOpen = false, isTyping = false;
const chatFab = $("#chatFab"), chatWindow = $("#chatWindow");

function openChatWindow() {
  chatOpen = true; chatWindow.classList.add("open");
  chatFab.querySelector(".open-icon").style.display  = "none";
  chatFab.querySelector(".close-icon").style.display = "flex";
  $("#chatBadge").style.display = "none";
  if (!$("#chatMessages").children.length) addWelcomeMsg();
  $("#chatInput").focus();
}
function closeChatWindow() {
  chatOpen = false; chatWindow.classList.remove("open");
  chatFab.querySelector(".open-icon").style.display  = "flex";
  chatFab.querySelector(".close-icon").style.display = "none";
}
window.closeChatWindow = closeChatWindow;

chatFab.addEventListener("click", () => chatOpen ? closeChatWindow() : openChatWindow());
$("#minimizeChat").addEventListener("click", closeChatWindow);

function addWelcomeMsg() {
  addBotMsg("👋 Hi! I'm <strong>ApnaBot</strong>.<br/>I can help with deals, order tracking, returns & more. How can I help?");
}
function nowTime() { return new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }); }
function addUserMsg(text) {
  const row = document.createElement("div"); row.className = "msg-row user";
  row.innerHTML = `<div><div class="msg-bubble">${text.replace(/</g,"&lt;")}</div><div class="msg-time">${nowTime()}</div></div>`;
  $("#chatMessages").appendChild(row); scrollChat();
}
function addBotMsg(html) {
  const row = document.createElement("div"); row.className = "msg-row bot";
  row.innerHTML = `<div class="msg-bot-avatar">A</div><div><div class="msg-bubble">${html}</div><div class="msg-time">${nowTime()}</div></div>`;
  $("#chatMessages").appendChild(row); scrollChat();
}
function showTyping() {
  const row = document.createElement("div"); row.id = "typingRow"; row.className = "msg-row bot";
  row.innerHTML = `<div class="msg-bot-avatar">A</div><div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
  $("#chatMessages").appendChild(row); scrollChat();
}
function hideTyping() { const el = $("#typingRow"); if (el) el.remove(); }
function scrollChat() { const m = $("#chatMessages"); m.scrollTop = m.scrollHeight; }

async function handleChatSend() {
  const input = $("#chatInput"), text = input.value.trim();
  if (!text || isTyping) return;
  input.value = ""; $("#chatSendBtn").disabled = true; isTyping = true;
  const qr = $("#quickReplies"); if (qr) qr.style.display = "none";
  addUserMsg(text); showTyping();
  await new Promise(r => setTimeout(r, 600 + Math.random() * 900));
  hideTyping();
  addBotMsg(getFallbackReply(text));
  isTyping = false; $("#chatSendBtn").disabled = false; $("#chatInput").focus();
}

$("#chatSendBtn").addEventListener("click", handleChatSend);
$("#chatInput").addEventListener("keydown", e => { if (e.key === "Enter") handleChatSend(); });
document.addEventListener("click", e => { if (e.target.classList.contains("quick-reply-btn")) { $("#chatInput").value = e.target.dataset.msg; handleChatSend(); } });
$("#clearChat").addEventListener("click", () => {
  $("#chatMessages").innerHTML = "";
  const qr = $("#quickReplies"); if (qr) qr.style.display = "flex";
  addWelcomeMsg();
});

/* ══════════════════════════════════════
   GLOBAL EXPORTS
══════════════════════════════════════ */
window.switchAuthTab        = switchAuthTab;
window.handleLogin          = handleLogin;
window.handleSignup         = handleSignup;
window.socialLogin          = socialLogin;
window.togglePass           = togglePass;
window.trackOrder           = trackOrder;
window.demoTrack            = demoTrack;
window.openTrackFromSuccess = openTrackFromSuccess;
window.checkoutNext         = checkoutNext;
window.applyCoupon          = applyCoupon;
window.placeOrder           = placeOrder;
window.submitReview         = submitReview;

/* ══════════════════════════════════════
   INIT — runs when page loads
══════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();
  updateAuthUI();
  initWishlistCount();

  // 1. Load categories from backend
  await loadCategories();

  // 2. Load products from backend (with skeleton animation)
  await loadAndRenderProducts();

  // 3. Load reviews
  await loadReviewsFromBackend();
});