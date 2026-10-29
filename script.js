
const products = [
  {
    id: 1,
    name: "Сөмке (Velora)",
    desc: "Стильді әрі ыңғайлы",
    price: 18990,
    category: "Сөмкелер",
    emoji: "👜",
    badge: "Хит",
    rating: "4.8 (124)"
  },
  {
    id: 2,
    name: "Кроссовка",
    desc: "Күнделікті қолдануға",
    price: 14990,
    category: "Аяқ киім",
    emoji: "👟",
    badge: "Жаңа",
    rating: "4.7 (98)"
  },
  {
    id: 3,
    name: "Smart сағат",
    desc: "Денсаулық пен стиль",
    price: 24990,
    old: 29990,
    category: "Гаджеттер",
    emoji: "⌚",
    badge: "Скидка",
    rating: "4.6 (76)"
  },
  {
    id: 4,
    name: "Парфюм жиынтығы",
    desc: "Әр сәтке арналған хош иіс",
    price: 12990,
    category: "Косметика",
    emoji: "🧴",
    badge: "Хит",
    rating: "4.9 (210)"
  },
  {
    id: 5,
    name: "Жұмсақ худи",
    desc: "Жайлы әрі сәнді",
    price: 16990,
    category: "Киім",
    emoji: "🧥",
    badge: "Жаңа",
    rating: "4.8 (64)"
  },
  {
    id: 6,
    name: "Көзілдірік",
    desc: "Образыңа ерекше сән береді",
    price: 7990,
    category: "Аксессуарлар",
    emoji: "🕶️",
    badge: "Таңдау",
    rating: "4.7 (52)"
  },
  {
    id: 7,
    name: "Әшекей жиынтығы",
    desc: "Нәзік әрі әдемі",
    price: 9990,
    category: "Аксессуарлар",
    emoji: "💎",
    badge: "Хит",
    rating: "4.9 (87)"
  },
  {
    id: 8,
    name: "Ерін далабы",
    desc: "Күнделікті макияжға",
    price: 5990,
    category: "Косметика",
    emoji: "💄",
    badge: "Жаңа",
    rating: "4.6 (41)"
  }
];

let cart = [];
let activeCategory = "Барлығы";

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");

function money(number) {
  return number.toLocaleString("ru-RU") + " ₸";
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = products.filter(product => {
    const categoryMatch =
      activeCategory === "Барлығы" ||
      product.category === activeCategory;

    const searchMatch =
      product.name.toLowerCase().includes(query) ||
      product.desc.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  document.getElementById("resultCount").textContent =
    `${filtered.length} өнім табылды`;

  if (filtered.length === 0) {
    grid.innerHTML = "<p>Бұл іздеу бойынша өнім табылмады ♡</p>";
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-visual">
        <span class="product-badge ${
          product.badge === "Жаңа" ? "new" : ""
        }">${product.badge}</span>

        <button class="favorite"
          aria-label="Таңдаулыға қосу"
          onclick="showToast('Таңдаулылар бөлімі жақында қосылады ♡')">
          ♡
        </button>

        <span class="product-emoji">${product.emoji}</span>
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>

        <div class="price-row">
          <span class="price">${money(product.price)}</span>
          ${
            product.old
              ? `<span class="old-price">${money(product.old)}</span>`
              : ""
          }
        </div>

        <button class="add-btn" onclick="addToCart(${product.id})">
          🛒 Себетке қосу
        </button>

        <div class="rating">★ <span>${product.rating}</span></div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const item = cart.find(product => product.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  renderCart();
  showToast("Өнім себетке қосылды ♡");
}

function changeQty(id, amount) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

function removeItem(id) {
  cart = cart.filter(product => product.id !== id);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);

  const cartItems = document.getElementById("cartItems");

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Себетіңіз әзірге бос ♡</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);

    return `
      <div class="cart-item">
        <div class="cart-thumb">${product.emoji}</div>

        <div>
          <h4>${product.name}</h4>
          <p>${money(product.price)}</p>

          <div class="qty">
            <button onclick="changeQty(${product.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${product.id}, 1)">+</button>
          </div>
        </div>

        <button class="remove"
          onclick="removeItem(${product.id})">×</button>
      </div>
    `;
  }).join("");
}

function toggleCart() {
  document.getElementById("cartPanel").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

function checkout() {
  if (cart.length === 0) {
    showToast("Алдымен себетке өнім қосыңыз ♡");
    return;
  }

  showToast("Демо нұсқа: нақты төлем жүйесі қосылмаған.");
}

searchInput.addEventListener("input", renderProducts);

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".category.active")
      .classList.remove("active");

    button.classList.add("active");
    activeCategory = button.dataset.category;

    renderProducts();
  });
});

renderProducts();
renderCart();
