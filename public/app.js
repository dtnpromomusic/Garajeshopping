const $ = (selector) => document.querySelector(selector);
const drawer = $("#cart-drawer");
const filters = [...document.querySelectorAll(".filter")];
const sidebarCategories = [...document.querySelectorAll(".sidebar-category")];
const tiles = [...document.querySelectorAll(".category-tile")];
const productGrid = $("#product-grid");
const selectionSection = $("#seleccion");
const categoryResults = $(".category-results");
const selectionTitle = $("#selection-title");
const emptyCatalog = $("#empty-catalog");
const search = $("#site-search");
const CART_KEY = "garaje-shopping-cart-v1";

// Solo se muestran artículos cuyos datos han sido confirmados.
const products = [{
  id: "pieza-unica-calzado-41",
  name: "Calzado deportivo",
  category: "Pieza única",
  price: 4500,
  condition: "Como nuevo",
  size: "41",
  stock: 1,
  unique: true,
  image: "/images/calzado-pieza-unica.jpg",
  description: "Calzado deportivo en tonos negro, blanco, turquesa y rosado. Pieza única, talla 41, estado como nuevo."
}];

let activeCategory = "Todos";
let cart = loadCart();

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch { return []; }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}
function money(value) {
  return new Intl.NumberFormat("es-DO", {style:"currency",currency:"DOP",maximumFractionDigits:2}).format(value);
}
function setCartOpen(open) {
  document.body.classList.toggle("cart-open", open);
  drawer.setAttribute("aria-hidden", String(!open));
}
$("#open-cart").addEventListener("click", () => setCartOpen(true));
$("#close-cart").addEventListener("click", () => setCartOpen(false));
$("#drawer-backdrop").addEventListener("click", () => setCartOpen(false));
$("#year").textContent = new Date().getFullYear();

function selectCategory(category, scroll = false) {
  activeCategory = category;
  selectionSection.hidden = false;
  selectionSection.classList.add("is-open");
  selectionSection.setAttribute("aria-hidden", "false");
  document.body.classList.add("category-panel-open");
  categoryResults.hidden = false;
  filters.forEach(button => button.classList.toggle("active", button.dataset.filter === category));
  sidebarCategories.forEach(button => button.classList.toggle("active", button.dataset.sidebarCategory === category));
  selectionTitle.textContent = category === "Todos" ? "Todas las categorías" : category;
  renderProducts();
  if (scroll) selectionSection.scrollIntoView({behavior:"smooth",block:"start"});
}
function renderProducts() {
  const visible = products.filter(product => activeCategory === "Todos" || product.category === activeCategory);
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card" data-product="${product.id}">
      <button class="product-visual" type="button" data-view="${product.id}" aria-label="Ver ${product.name}">
        <img src="${product.image}" alt="Fotografía real del calzado deportivo en tonos negro, blanco, turquesa y rosado">
      </button>
      <div class="product-info">
        <span class="stock-tag">PIEZA ÚNICA · ${product.stock} DISPONIBLE</span>
        <h3>${product.name}</h3>
        <div class="product-meta">Estado: ${product.condition}<br>Talla: ${product.size}</div>
        <div class="product-price">${money(product.price)}</div>
        <div class="product-actions"><button class="view-product" data-view="${product.id}">Ver artículo</button><button class="add-product" data-add="${product.id}">Añadir a bolsa</button></div>
      </div>
    </article>`).join("");
  emptyCatalog.hidden = visible.length > 0;
  if (visible.length) $(".section-intro").textContent = "Artículos disponibles en esta categoría. Pulsa una ficha para ver sus detalles.";
  else $(".section-intro").textContent = "Estamos preparando artículos para esta categoría. Próximamente encontrarás aquí nuevas piezas.";
}
filters.forEach(button => button.addEventListener("click", () => selectCategory(button.dataset.filter)));
sidebarCategories.forEach(button => button.addEventListener("click", () => selectCategory(button.dataset.sidebarCategory)));
tiles.forEach(tile => tile.addEventListener("click", () => {
  // La portada permanece intacta; al pulsarla se abre el renglón de artículos correspondiente.
  selectCategory(tile.dataset.category, true);
}));
search.addEventListener("input", () => {
  const term = search.value.trim().toLocaleLowerCase("es");
  if (!term) { selectCategory("Todos"); return; }
  const match = tiles.find(tile => tile.dataset.category.toLocaleLowerCase("es").includes(term));
  if (match) selectCategory(match.dataset.category, true);
  else {
    selectCategory("Todos");
    filters.forEach(button => button.classList.toggle("active", button.dataset.filter === "Todos"));
    sidebarCategories.forEach(button => button.classList.toggle("active", button.dataset.sidebarCategory === "Todos"));
    renderProducts();
  }
});
search.addEventListener("keydown", event => {
  if (event.key === "Escape") { search.value = ""; selectCategory("Todos"); }
});
productGrid.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const view = event.target.closest("[data-view]");
  if (add) addToCart(add.dataset.add);
  if (view) showProduct(view.dataset.view);
});
function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const current = cart.find(item => item.id === id);
  const quantity = current ? current.quantity : 0;
  if (quantity >= product.stock) { alert("Esta pieza única ya está en tu bolsa. Solo hay 1 disponible."); return; }
  if (current) current.quantity += 1;
  else cart.push({id,quantity:1});
  saveCart();
  setCartOpen(true);
}
function changeQuantity(id, delta) {
  const product = products.find(item => item.id === id);
  const item = cart.find(row => row.id === id);
  if (!item || !product) return;
  item.quantity = Math.max(0, Math.min(product.stock, item.quantity + delta));
  cart = cart.filter(row => row.quantity > 0);
  saveCart();
}
function renderCart() {
  const count = cart.reduce((sum,row) => sum + row.quantity, 0);
  $("#cart-count").textContent = count;
  const lines = cart.map(row => {
    const product = products.find(item => item.id === row.id);
    return product ? {product,quantity:row.quantity} : null;
  }).filter(Boolean);
  $("#cart-items").innerHTML = lines.length ? lines.map(({product,quantity}) => `
    <div class="cart-row">
      <div><strong>${product.name}</strong><small>${product.category} · Talla ${product.size} · ${product.condition}</small></div>
      <span class="line-price">${money(product.price * quantity)}</span>
      <div class="qty-controls"><button data-qty="-1" data-id="${product.id}" aria-label="Quitar uno">−</button><b>${quantity}</b><button data-qty="1" data-id="${product.id}" aria-label="Añadir uno" ${quantity >= product.stock ? "disabled" : ""}>+</button><button class="remove-item" data-remove="${product.id}">Eliminar</button></div>
    </div>`).join("") : '<p class="cart-empty">Tu bolsa está esperando un buen hallazgo.</p>';
  $("#cart-total").textContent = money(lines.reduce((sum,line) => sum + line.product.price * line.quantity, 0));
  $("#checkout-button").disabled = lines.length === 0;
}
$("#cart-items").addEventListener("click", event => {
  const qty = event.target.closest("[data-qty]");
  const remove = event.target.closest("[data-remove]");
  if (qty) changeQuantity(qty.dataset.id, Number(qty.dataset.qty));
  if (remove) { cart = cart.filter(item => item.id !== remove.dataset.remove); saveCart(); }
});
function showProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const detail = $("#product-detail-backdrop");
  $("#product-detail-content").innerHTML = `
    <span class="eyebrow">${product.category.toUpperCase()}</span>
    <h3>${product.name}</h3>
    <img class="detail-product-image" src="${product.image}" alt="Fotografía real del calzado deportivo">
    <span class="stock-tag">PIEZA ÚNICA · ${product.stock} DISPONIBLE</span>
    <p>Estado: <b>${product.condition}</b><br>Talla: <b>${product.size}</b><br>Disponibilidad: <b>1 unidad</b></p>
    <p>${product.description}</p>
    <strong class="product-price">${money(product.price)}</strong>
    <button class="add-product" data-add-detail="${product.id}">Añadir a mi bolsa</button>`;
  detail.classList.add("open");
  detail.setAttribute("aria-hidden","false");
}
$("#product-detail-backdrop").addEventListener("click", event => {
  if (event.target.id === "product-detail-backdrop" || event.target.closest(".product-detail-close")) {
    $("#product-detail-backdrop").classList.remove("open");
    $("#product-detail-backdrop").setAttribute("aria-hidden","true");
  }
});
$("#product-detail-content").addEventListener("click", event => {
  const button = event.target.closest("[data-add-detail]");
  if (button) { $("#product-detail-backdrop").classList.remove("open"); addToCart(button.dataset.addDetail); }
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    setCartOpen(false);
    $("#product-detail-backdrop").classList.remove("open");
    $("#product-detail-backdrop").setAttribute("aria-hidden","true");
  }
});
selectionSection.hidden = true;
categoryResults.hidden = false;
renderProducts();
renderCart();
