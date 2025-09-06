document.addEventListener("DOMContentLoaded", function() {
    const drawer = document.getElementById("cart-drawer");
    const openBtn = document.getElementById("cart-drawer-open");
    const closeBtn = document.getElementById("side-cart-close");
    const overlay = drawer.querySelector(".side-cart__overlay");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartSubtotal = document.getElementById("cart-subtotal")
})

function openDrawer() {
    drawer.classList.add("active");
}

function closeDrawer() {
    drawer.classList.remove("active");
}

function renderCart(cart) {
    if (cart.item_count === 0) {
        cartItemsContainer.innerHTML = "<p>Your Cart Is Empty</p>";
        cartSubtotal.textContent = "Rs 0.00";
        return;
    }

    cartItemsContainer.innerHTML = cart.items.map((item) => `
        <div class="cart-drawer__item">
         <img src="${item.image}" alt="${item.title}" width="60" />
         <div>
           <p>${item.title}</p>
           <p>Qty: ${item.quantity}</p>
           <p>${Shopify.formatMoney(item.line_price)}</p>
         </div>
        </div>
        `
    )
    .join("");

    cartSubtotal.textContent = Shopify.formatMoney(cart.total_price)
}

function updateCart() {
    fetch("/cart.js")
      .then((res) => res.json())
      .then((cart) => {
        renderCart(cart);
        openDrawer();
      })
}

// Intercept add to cart forms

document.querySelectorAll('form[action^="/cart/add"]').forEach((form) => {
    form.addEventListener("submit", function (e) {
        e.preventDefault()

        const formData = new FormData(form);

        fetch("/cart/add.js", {
            method: "POST",
            body: formData,
        })
          .then((res) => res.json())
          .then(() => {
            updateCart();
          })
          .catch((err) => console.error("Add To Cart Error", err))
    })
})

if (closeBtn) closeBtn.addEventListener("Click", closeDrawer);
if (overlay) overlay.addEventListener("click", closeDrawer)
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
})