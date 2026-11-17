const $ = (selector) => document.querySelector(selector);
const drawer = $("#cart-drawer");
function setCartOpen(open) {
  document.body.classList.toggle("cart-open", open);
  drawer.setAttribute("aria-hidden", String(!open));
}
$("#open-cart").addEventListener("click", () => setCartOpen(true));
$("#close-cart").addEventListener("click", () => setCartOpen(false));
$("#drawer-backdrop").addEventListener("click", () => setCartOpen(false));
$("#year").textContent = new Date().getFullYear();

const filters = [...document.querySelectorAll(".filter")];
const tiles = [...document.querySelectorAll(".category-tile")];
function selectCategory(category) {
  filters.forEach((button) => button.classList.toggle("active", button.dataset.filter === category));
  tiles.forEach((tile) => {
    tile.hidden = category !== "Todos" && tile.dataset.category !== category;
  });
}
filters.forEach((button) => button.addEventListener("click", () => selectCategory(button.dataset.filter)));
tiles.forEach((tile) => tile.addEventListener("click", () => {
  filters.forEach((button) => button.classList.toggle("active", button.dataset.filter === tile.dataset.category));
}));

const search = $("#site-search");
search.addEventListener("input", () => {
  const term = search.value.trim().toLocaleLowerCase("es");
  const matching = tiles.filter((tile) => tile.dataset.category.toLocaleLowerCase("es").includes(term));
  tiles.forEach((tile) => { tile.hidden = Boolean(term) && !matching.includes(tile); });
  filters.forEach((button) => button.classList.toggle("active", !term && button.dataset.filter === "Todos"));
  if (term) $("#categorias").scrollIntoView({ behavior: "smooth", block: "start" });
});
search.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { search.value = ""; selectCategory("Todos"); }
  if (event.key === "Enter") $("#categorias").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setCartOpen(false);
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    search.focus();
  }
});