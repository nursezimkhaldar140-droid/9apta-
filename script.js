
const products = [
  {id:1, name:"Жұмсақ кардиган", category:"Киім", price:12900, emoji:"🧥", bg:"#f4e0e8"},
  {id:2, name:"Минималист сөмке", category:"Сөмкелер", price:18500, emoji:"👜", bg:"#eee4fa"},
  {id:3, name:"Күнделікті кроссовка", category:"Аяқ киім", price:21900, emoji:"👟", bg:"#e4edf4"},
  {id:4, name:"Күтім жиынтығы", category:"Косметика", price:8900, emoji:"🧴", bg:"#f8e8d9"},
  {id:5, name:"Әдемі сырға", category:"Аксессуарлар", price:4900, emoji:"💎", bg:"#f6e1e8"},
  {id:6, name:"Сымсыз құлаққап", category:"Гаджеттер", price:15900, emoji:"🎧", bg:"#e4e0f5"},
  {id:7, name:"Классикалық жейде", category:"Киім", price:10900, emoji:"👚", bg:"#f3e9d9"},
  {id:8, name:"Көзілдірік", category:"Аксессуарлар", price:6500, emoji:"🕶️", bg:"#e0ece8"}
];

let selectedCategory = "Барлығы";
let cart = [];
let authMode = "login";

const $ = id => document.getElementById(id);
const money = value => value.toLocaleString("kk-KZ") + " ₸";

function renderProducts() {
  const query = $("searchInput").value.trim().toLocaleLowerCase("kk");
  const shown = products.filter(product => {
    const categoryMatch = selectedCategory === "Барлығы" ||
      product.category === selectedCategory;
    const searchMatch = product.name.toLocaleLowerCase("kk").includes(query) ||
      product.category.toLocaleLowerCase("kk").includes(query);
    return categoryMatch && searchMatch;
  });

  $("productGrid").innerHTML = shown.map(product => `
    <article class="product-card">
      <div class="product-art" style="background:${product.bg}">
        ${product.emoji}
      </div>
      <div class="product-info">
        <p class="category">${product.category}</p>
        <h3>${product.name}</h3>
        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" data-add="${product.id}" aria-label="Себетке қосу">+</button>
        </div>
      </div>
    </article>
  `).join("");

  $("emptyMessage").hidden = shown.length > 0;
}

function renderCart() {
  $("cartCount").textContent = cart.reduce((sum, item) => sum + item.qty, 0);

  $("cartItems").innerHTML = cart.length ? cart.map(item => `
    <div class="cart-row">
      <h4>${item.emoji} ${item.name}</h4>
      <p>${money(item.price)} × ${item.qty}</p>
      <div class="quantity">
        <button data-qty="${item.id}" data-change="-1">−</button>
        <span>${item.qty}</span>
        <button data-qty="${item.id}" data-change="1">+</button>
      </div>
      <button class="remove" data-remove="${item.id}">Өшіру</button>
    </div>
  `).join("") : "<p>Себет әзірге бос.</p>";

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  $("cartTotal").textContent = money(total);
}

function toast(message) {
  const element = $("toast");
  element.textContent = message;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.textContent = "", 2500);
}

function openCart() {
  $("cartPanel").classList.add("open");
  $("shade").classList.add("open");
}

function closeCart() {
  $("cartPanel").classList.remove("open");
  $("shade").classList.remove("open");
}

function openAuth(mode) {
  authMode = mode;
  const registering = mode === "register";

  $("authTitle").textContent = registering ? "Жаңа аккаунт" : "Аккаунтқа кіру";
  $("authSubtitle").textContent = registering
    ? "Тіркелу үшін мәліметтеріңізді енгізіңіз."
    : "Дүкенге кіру үшін мәліметтеріңізді енгізіңіз.";
  $("authSubmit").textContent = registering ? "Тіркелу" : "Кіру";
  $("switchText").textContent = registering
    ? "Аккаунтыңыз бар ма?"
    : "Аккаунтыңыз жоқ па?";
  $("switchAuth").textContent = registering ? "Кіру" : "Тіркелу";
  $("authName").hidden = !registering;
  $("nameLabel").hidden = !registering;
  $("authName").required = registering;
  $("authBackdrop").classList.add("open");
}

function closeAuth() {
  $("authBackdrop").classList.remove("open");
}

$("productGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const product = products.find(item => item.id === Number(button.dataset.add));
  const existing = cart.find(item => item.id === product.id);

  if (existing) existing.qty++;
  else cart.push({...product, qty:1});

  renderCart();
  toast("Тауар себетке қосылды!");
});

$("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;
  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });
  renderProducts();
});

$("searchInput").addEventListener("input", renderProducts);

$("cartItems").addEventListener("click", event => {
  const removeButton = event.target.closest("[data-remove]");
  const qtyButton = event.target.closest("[data-qty]");

  if (removeButton) {
    cart = cart.filter(item => item.id !== Number(removeButton.dataset.remove));
  }

  if (qtyButton) {
    const item = cart.find(product => product.id === Number(qtyButton.dataset.qty));
    if (item) item.qty += Number(qtyButton.dataset.change);
    cart = cart.filter(product => product.qty > 0);
  }

  renderCart();
});

$("cartOpen").addEventListener("click", openCart);
$("cartClose").addEventListener("click", closeCart);
$("shade").addEventListener("click", closeCart);

$("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    toast("Алдымен себетке тауар қосыңыз.");
  } else {
    toast("Бұл оқу жобасында нақты тапсырыс беру қосылмаған.");
  }
});

$("loginOpen").addEventListener("click", () => openAuth("login"));
$("registerOpen").addEventListener("click", () => openAuth("register"));
$("authClose").addEventListener("click", closeAuth);

$("authBackdrop").addEventListener("click", event => {
  if (event.target === $("authBackdrop")) closeAuth();
});

$("switchAuth").addEventListener("click", () => {
  openAuth(authMode === "login" ? "register" : "login");
});

$("authForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("authName").value.trim();
  const email = $("authEmail").value.trim().toLowerCase();
  const password = $("authPassword").value;
  let users = [];

  try {
    users = JSON.parse(localStorage.getItem("nursezimUsers") || "[]");
  } catch {
    users = [];
  }

  if (authMode === "register") {
    if (!name) return toast("Атыңызды енгізіңіз.");
    if (users.some(user => user.email === email)) {
      return toast("Бұл пошта бұрын тіркелген.");
    }

    users.push({name, email, password});
    localStorage.setItem("nursezimUsers", JSON.stringify(users));
    $("authForm").reset();
    closeAuth();
    toast("Тіркелу сәтті аяқталды!");
  } else {
    const user = users.find(user =>
      user.email === email && user.password === password
    );

    if (!user) return toast("Пошта немесе құпиясөз қате.");

    $("authForm").reset();
    closeAuth();
    toast("Қош келдіңіз, " + user.name + "!");
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeAuth();
  }
});

renderProducts();
renderCart();
