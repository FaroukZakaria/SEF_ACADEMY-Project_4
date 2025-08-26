function check() {
    if (!(user && isLoggedIn)) {
        alert("Please login first");
        window.location = "login.html";
        return false;
    }
    return true;
}

let loginBtn = document.getElementById("loginBtn");
let registerBtn = document.getElementById("registerBtn");
let welcomeUser = document.getElementById("welcome-user");
let cart = document.getElementById("cartBtn");
let cartAdd = document.querySelectorAll(".plusCart");
let cartMinus = document.querySelectorAll(".minusCart");

let favoriteProducts = JSON.parse(localStorage.getItem("FavoriteProduct")) || [];
let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
const cartPreview = document.getElementById("cart-preview");

let user = JSON.parse(localStorage.getItem("user")) || {};
let isLoggedIn = localStorage.getItem("loggedInUser") || false;
welcomeUser.style.display = "none";
cart.style.display = "none";
let logoutBtn = document.getElementById("logoutBtn");
logoutBtn.style.display = "none";

updateCartCount();

logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
});

if (user && isLoggedIn) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "block";
    welcomeUser.style.display = "block";
    cart.style.display = "block";
    welcomeUser.innerHTML = `Welcome, ${user.firstName}`;
}

drawCartPreview();

let cartBtn = document.querySelectorAll(".products-item-btns button");
cartBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        if (!check()) return;
        const productParent = btn.closest(".products-item");
        const id = productParent.getAttribute("data-id");
        const title = productParent.querySelector(".products-item-details-title").textContent.trim();
        const price = productParent.querySelector(".products-item-details-price span").textContent.trim();
        const image = productParent.querySelector(".products-item-img img").getAttribute("src");
        const category = productParent.querySelector(".products-item-details-category span").textContent.trim();
        const itemProduct = { id, title, image, price, category, count: 1 };
        
        let cartProducts = JSON.parse(localStorage.getItem("cartProducts") || "[]");
        const idx = cartProducts.findIndex(p => p.id === id);

        if (idx === -1) {
            cartProducts.push(itemProduct);
            btn.textContent = "Remove from cart";
            btn.style.backgroundColor = "#dc3545";
            btn.style.borderColor = "#dc3545";
        } else {
            cartProducts.splice(idx, 1);
            btn.textContent = "Add to Cart";
            btn.style.backgroundColor = "#0d6efd";
            btn.style.borderColor = "#0d6efd";
        }
        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
        drawCartPreview();
        updateCartCount();
    });
});
cart.addEventListener("click", () => {
    const cartPreview = document.getElementById("cart-preview");
    cartPreview.style.display = cartPreview.style.display === "block" ? "none" : "block";
});
function drawCartPreview() {
    const cartProducts = JSON.parse(localStorage.getItem("cartProducts") || "[]");
    
    let x = cartProducts.map(item => 
        `
        <div data-id="${item.id}" class="cart-item d-flex justify-content-between align-items-center p-2 bg-white">
            <div>
                <p class="m-0 fw-bold">${item.title || "Product"}</p>
                <p class="m-0 text-muted">$${item.price * item.count}</p>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-secondary minusCart">-</button>
                <span>${item.count}</span>
                <button class="btn btn-sm btn-outline-secondary plusCart">+</button>
            </div>
        </div>
        `
    ).join("");
    cartPreview.innerHTML = x;
    cartPreview.innerHTML += `<a href="products.html" class="btn btn-outline-secondary text-black p-2 rounded d-block">
                        View all products
                    </a>`
    if (cartProducts.length === 0) {
        cartPreview.innerHTML = "<p class='m-0'>Your cart is empty</p>";
    }
    cartAdd = document.querySelectorAll(".plusCart");
    cartMinus = document.querySelectorAll(".minusCart");

    cartAdd.forEach((btn) => {
    btn.addEventListener("click", () => {
        btnParent = btn.closest(".cart-item");
        let count = parseInt(btnParent.querySelector("span").textContent) + 1;
        const id = btnParent.getAttribute("data-id");
        const idx = cartProducts.findIndex(p => p.id == id);
        if (idx !== -1) {
            let itemProduct = document.querySelector(`.products-item[data-id="${id}"]`);
            btnParent.querySelector("span").textContent = count;
            cartProducts[idx].count = count;
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
            itemProduct.querySelector("span").textContent = count;
            drawCartPreview();
            updateCartCount();
        }
        });
    });
    cartMinus.forEach((btn) => {
        btn.addEventListener("click", () => {
            btnParent = btn.closest(".cart-item");
            let count = parseInt(btnParent.querySelector("span").textContent) - 1;
            const id = btnParent.getAttribute("data-id");
            const idx = cartProducts.findIndex(p => p.id == id);
            if (idx !== -1) {
                if (count > 0) {
                    let itemProduct = document.querySelector(`.products-item[data-id="${id}"]`);
                    btnParent.querySelector("span").textContent = count;
                    cartProducts[idx].count = count;
                    itemProduct.querySelector("span").textContent = count;
                } else {
                    cartProducts.splice(idx, 1);
                    btnParent.remove();
                    let itemProduct = document.querySelector(`.products-item[data-id="${id}"]`);
                    itemProduct.remove();
                }
                localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
                drawCartPreview();
                updateCartCount();
                renderCartItems();
            }
        });
    });
}
cartPreview.style.display = "none";
function updateCartCount() {
    const cartProducts = JSON.parse(localStorage.getItem("cartProducts") || "[]");
    const totalCount = cartProducts.reduce((acc, item) => acc + item.count, 0);
    document.querySelector("#cartBtn .badge").textContent = totalCount;
}

// Render Cart Items
function renderCartItems() {
    const cartProducts = JSON.parse(localStorage.getItem("cartProducts") || "[]");
    const cartContainer = document.querySelector(".row.row-cols-2.g-2");
    let x = cartProducts.map(item => `
        <div class="col">
            <div data-id="${item.id}" class="products-item d-flex align-items-stretch border rounded p-3 h-100">
                <div style="width:120px; height:100%; overflow:hidden;" class="me-3">
                    <img src="${item.image}" alt="${item.title}" style="height:100%; width:100%; object-fit:cover;">
                </div>
                <div class="d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                        <h4>${item.title}</h4>
                        <p class="mb-1">Price: $${(item.price * item.count).toFixed(2)}</p>
                        <p class="mb-2">Category: ${item.category}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <button class="btn btn-outline-secondary btn-sm minusCart">-</button>
                        <span>${item.count}</span>
                        <button class="btn btn-outline-secondary btn-sm plusCart">+</button>
                    </div>
                    <button class="btn btn-danger btn-sm removeCart">Remove from cart</button>
                </div>
            </div>
        </div>
    `).join("");
    cartContainer.innerHTML = x;

    cartAdd = document.querySelectorAll(".plusCart");
    cartMinus = document.querySelectorAll(".minusCart");

    cartAdd.forEach((btn) => {
        btn.addEventListener("click", () => {
            btnParent = btn.closest(".products-item");
            let count = parseInt(btnParent.querySelector("span").textContent) + 1;
            const id = btnParent.getAttribute("data-id");
            const idx = cartProducts.findIndex(p => p.id == id);
            if (idx !== -1) {
                let itemProduct = document.querySelector(`.products-item[data-id="${id}"]`);
                btnParent.querySelector("span").textContent = count;
                cartProducts[idx].count = count;
                localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
                itemProduct.querySelector("span").textContent = count;
                drawCartPreview();
                updateCartCount();
                renderCartItems();
            }
            });
        });
    cartMinus.forEach((btn) => {
        btn.addEventListener("click", () => {
            btnParent = btn.closest(".products-item");
            let count = parseInt(btnParent.querySelector("span").textContent) - 1;
            const id = btnParent.getAttribute("data-id");
            const idx = cartProducts.findIndex(p => p.id == id);
            if (idx !== -1) {
                if (count > 0) {
                    let itemProduct = document.querySelector(`.products-item[data-id="${id}"]`);
                    btnParent.querySelector("span").textContent = count;
                    cartProducts[idx].count = count;
                    itemProduct.querySelector("span").textContent = count;
                    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
                    drawCartPreview();
                    updateCartCount();
                    renderCartItems();
                } else {
                    cartProducts.splice(idx, 1);
                    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
                    drawCartPreview();
                    updateCartCount();
                    renderCartItems();
                    // No need to remove btnParent or itemProduct here, renderCartItems will re-render the DOM
                }
            }
        });
    });

    // Update total price
    const totalPrice = cartProducts.reduce((acc, item) => acc + (parseFloat(item.price) * item.count), 0).toFixed(2);
    document.getElementById("total-price").textContent = totalPrice;

    

    removeCart = document.querySelectorAll(".removeCart");
    removeCart.forEach(btn => {
        btn.addEventListener("click", () => {
            btnParent = btn.closest(".products-item");
            const id = btnParent.getAttribute("data-id");
            let cartProducts = JSON.parse(localStorage.getItem("cartProducts") || "[]");
            const idx = cartProducts.findIndex(p => p.id == id);
            if (idx !== -1) {
                cartProducts.splice(idx, 1);
                btnParent.remove();
                localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
                drawCartPreview();
                updateCartCount();
                renderCartItems();
            }
        });
    });
}

// Render Favorite Items
function renderFavoriteItems() {
    const favoriteProducts = JSON.parse(localStorage.getItem("FavoriteProduct") || "[]");
    const favContainer = document.querySelector(".favorite-items");
    let x = favoriteProducts.map(item => `
        <div data-id="${item.id}" class="favorite-item d-flex flex-column align-items-center border rounded p-3" style="min-width:200px;">
            <img src="${item.image}" alt="${item.title}" style="width:100%; height:auto; max-height: 200px; object-fit:cover;">
            <h5 class="mt-2 mb-1">${item.title}</h5>
            <p class="mb-1">Category: ${item.category}</p>
            <i class="fa fa-heart text-danger fs-4 pointer"></i>
        </div>
    `).join("");
    favContainer.innerHTML = x;

    // Add click event listeners to heart icons
    let heartIcons = document.querySelectorAll(".favorite-item i");
    heartIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const favItem = icon.closest(".favorite-item");
            const id = favItem.getAttribute("data-id");
            let favoriteProducts = JSON.parse(localStorage.getItem("FavoriteProduct") || "[]");
            const idx = favoriteProducts.findIndex(p => p.id == id);
            if (idx !== -1) {
                favoriteProducts.splice(idx, 1);
                favItem.remove();
                localStorage.setItem("FavoriteProduct", JSON.stringify(favoriteProducts));
                renderFavoriteItems();
            }
        });
    });
}

// Call these functions on page load
renderCartItems();
renderFavoriteItems();