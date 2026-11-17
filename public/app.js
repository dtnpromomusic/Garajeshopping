const $ = (s) => document.querySelector(s);
const drawer = $("#cart-drawer");
function setCartOpen(open) {
  document.body.classList.toggle("cart-open", open);
  drawer.setAttribute("aria-hidden", String(!open));
}
$("#open-cart").addEventListener("click", () => setCartOpen(true));
$("#close-cart").addEventListener("click", () => setCartOpen(false));
$("#drawer-backdrop").addEventListener("click", () => setCartOpen(false));
$("#year").textContent = new Date().getFullYear();

document.querySelectorAll(".category-tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    const category = tile.dataset.category;
    document.querySelectorAll(".filter").forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === category);
    });
  });
});
document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});
