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
const products = [
  {id:"sillon-vintage",name:"Sillón vintage de acento",category:"Muebles",categoryLabel:"Muebles",price:4850,image:"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",stock:null,description:"Sillón vintage de acento. Hallazgo Garaje."},
  {id:"lampara-retro",name:"Lámpara de mesa retro",category:"Decoración e iluminación",categoryLabel:"Iluminación",price:1850,image:"https://images.unsplash.com/photo-150mt5516-7d4a0a1d2c5b?auto=format&fit=crop&w=800&q=80",stock:null,description:"Lámpara de mesa de estilo retro. Hallazgo Garaje."},
  {id:"camara-clasica",name:"Cámara clásica decorativa",category:"Coleccionables",categoryLabel:"Coleccionables",price:3200,image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",stock:null,description:"Cámara clásica decorativa. Hallazgo Garaje."},
  {id:"chaqueta-denim",name:"Chaqueta denim vintage",category:"Ropa vintage",categoryLabel:"Ropa vintage",price:1450,image:"https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",stock:null,description:"Chaqueta denim vintage. Hallazgo Garaje."},
  {id:"jarron-artesanal",name:"Jarrón artesanal decorativo",category:"Decoración e iluminación",categoryLabel:"Decoración",price:980,image:"https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",stock:null,description:"Jarrón artesanal decorativo. Hallazgo Garaje."},
  {id:"caja-herramientas",name:"Caja de herramientas compacta",category:"Herramientas",categoryLabel:"Herramientas",price:2150,image:"https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?auto=format&fit=crop&w=800&q=80",stock:null,description:"Caja de herramientas compacta. Hallazgo Garaje."},
  {id:"espejo-redondo",name:"Espejo decorativo redondo",category:"Pieza única",categoryLabel:"Artículos únicos",price:2750,image:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",stock:null,description:"Espejo decorativo redondo. Hallazgo Garaje."},
  {id:"silla-escandinava",name:"Silla de diseño escandinavo",category:"Muebles",categoryLabel:"Muebles",price:3650,image:"https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",stock:null,description:"Silla de diseño escandinavo. Hallazgo Garaje."},
  {id:"pieza-unica-calzado-41",name:"Calzado deportivo",category:"Pieza única",categoryLabel:"Pieza única",price:4500,condition:"Como nuevo",size:"41",stock:1,unique:true,image:"/images/calzado-pieza-unica.jpg",description:"Calzado deportivo en tonos negro, blanco, turquesa y rosado. Pieza única, talla 41, estado como nuevo."}
];

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
$("#open-cart").addEventListener("click", () => setCartOpen(true));\n$("#floating-cart").addEventListener("click", () => setCartOpen(true));
$("#close-cart").addEventListener("click", () => setCartOpen(false));
$("#drawer-backdrop").addEventListener("click", () => setCartOpen(false));
$("#year").textContent = new Date().getFullYear();
$("#sort-products").addEventListener("change", renderProducts);

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
  const sortMode = $("#sort-products")?.value || "featured";
  if (sortMode === "low-high") visible.sort((a,b) => a.price-b.price);
  if (sortMode === "high-low") visible.sort((a,b) => b.price-a.price);
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card" data-product="${product.id}">
      <button class="product-visual" type="button" data-view="${product.id}" aria-label="Ver ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </button>
      <div class="product-info">
        <span class="product-category">${product.categoryLabel || product.category}</span>
        <span class="stock-tag">HALLAZGO GARAJE</span>
        <h3>${product.name}</h3>
        <div class="product-price">${money(product.price)}</div>
        <div class="product-actions"><button class="view-product" data-view="${product.id}">Ver más</button><button class="add-product" data-add="${product.id}">Añadir al carrito</button></div>
      </div>
    </article>`).join("");
  emptyCatalog.hidden = visible.length > 0;
  if (visible.length) $(".section-intro").textContent = activeCategory === "Todos" ? "Piezas especiales y oportunidades que vale la pena encontrar." : "Piezas especiales y oportunidades en " + activeCategory + ".";
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
  if (product.stock !== null && quantity >= product.stock) { alert("Esta pieza única ya está en tu bolsa. Solo hay 1 disponible."); return; }
  if (current) current.quantity += 1;
  else cart.push({id,quantity:1});
  saveCart();
  setCartOpen(true);
}
function changeQuantity(id, delta) {
  const product = products.find(item => item.id === id);
  const item = cart.find(row => row.id === id);
  if (!item || !product) return;
  item.quantity = Math.max(0, product.stock === null ? item.quantity + delta : Math.min(product.stock, item.quantity + delta));
  cart = cart.filter(row => row.quantity > 0);
  saveCart();
}
function renderCart() {
  const count = cart.reduce((sum,row) => sum + row.quantity, 0);
  $("#cart-count").textContent = count;\n  $("#floating-cart-count").textContent = count;
  const lines = cart.map(row => {
    const product = products.find(item => item.id === row.id);
    return product ? {product,quantity:row.quantity} : null;
  }).filter(Boolean);
  $("#cart-items").innerHTML = lines.length ? lines.map(({product,quantity}) => `
    <div class="cart-row">
      <img class="cart-product-image" src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="cart-product-copy"><strong>${product.name}</strong><small>${product.categoryLabel || product.category}${product.size ? " · Talla " + product.size : ""}${product.condition ? " · " + product.condition : ""}</small><span class="line-price">${money(product.price * quantity)}</span></div>
      <div class="qty-controls"><button data-qty="-1" data-id="${product.id}" aria-label="Quitar uno">−</button><b>${quantity}</b><button data-qty="1" data-id="${product.id}" aria-label="Añadir uno" ${product.stock !== null && quantity >= product.stock ? "disabled" : ""}>+</button><button class="remove-item" data-remove="${product.id}">Eliminar</button></div>
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
    <span class="stock-tag">HALLAZGO GARAJE</span>
    ${product.condition || product.size ? `<p>${product.condition ? "Estado: <b>" + product.condition + "</b><br>" : ""}${product.size ? "Talla: <b>" + product.size + "</b>" : ""}</p>` : ""}
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
    if (selectionSection.classList.contains("is-open")) closeCategoryPanel();
    $("#product-detail-backdrop").classList.remove("open");
    $("#product-detail-backdrop").setAttribute("aria-hidden","true");
  }
});
selectionSection.hidden = true;
categoryResults.hidden = false;
function closeCategoryPanel() {
  selectionSection.classList.remove("is-open");
  selectionSection.setAttribute("aria-hidden", "true");
  document.body.classList.remove("category-panel-open");
  selectionSection.hidden = true;
}
$("#close-category-panel").addEventListener("click", closeCategoryPanel);
$("#category-panel-backdrop").addEventListener("click", closeCategoryPanel);
renderProducts();
renderCart();
