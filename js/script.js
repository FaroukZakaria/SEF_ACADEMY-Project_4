function check() {
    if (!(user && isLoggedIn)) {
        alert("Please login first");
        window.location = "login.html";
        return false;
    }
    return true;
}
const select = document.querySelector(".main-search select");
const input = document.querySelector(".main-search input");

function search() {
    const query = input.value.toLowerCase();
    let filteredProducts = [];
    if (select.value === "name") {
        filteredProducts = products.filter(product => 
            (product.title || '').toLowerCase().includes(query)
        );
    } else if (select.value === "category") {
        filteredProducts = products.filter(product => 
            (product.category || '').toLowerCase().includes(query)
        );
    }
    // Always use the latest favoriteProducts and cartProducts from localStorage
    favoriteProducts = JSON.parse(localStorage.getItem("FavoriteProduct")) || [];
    cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    drawProducts(filteredProducts);
}

// Call search on every input change
input.addEventListener("input", search);
select.addEventListener("change", search);
// Attach event listener to search button
document.querySelector(".main-search button").addEventListener("click", search);
let products = [
    {
        id: 1,
        title: "Classic Silver Watch",
        image: "images/watch1.webp",
        price: 199.99,
        category: "watches"
    },
    {
        id: 2,
        title: "Elegant Gold Watch",
        image: "images/watch2.webp",
        price: 249.99,
        category: "watches"
    },
    {
        id: 3,
        title: "Luxury Leather Watch",
        image: "images/watch3.jpg",
        price: 299.99,
        category: "watches"
    },
    {
        id: 4,
        title: "Diamond Pendant Necklace",
        image: "images/necklace1.webp",
        price: 149.99,
        category: "necklaces"
    },
    {
        id: 5,
        title: "Pearl Strand Necklace",
        image: "images/necklace2.webp",
        price: 199.99,
        category: "necklaces"
    },
    {
        id: 6,
        title: "Gold Heart Necklace",
        image: "images/necklace3.jpeg",
        price: 249.99,
        category: "necklaces"
    },
    {
        id: 7,
        title: "Crystal Drop Earrings",
        image: "images/earring1.webp",
        price: 99.99,
        category: "earrings"
    },
    {
        id: 8,
        title: "Silver Hoop Earrings",
        image: "images/earring2.jpg",
        price: 129.99,
        category: "earrings"
    },
    {
        id: 9,
        title: "Gold Stud Earrings",
        image: "images/earring3.webp",
        price: 159.99,
        category: "earrings"
    },
    {
        id: 10,
        title: "Emerald Ring",
        image: "images/ring1.jpg",
        price: 89.99,
        category: "rings"
    },
    {
        id: 11,
        title: "Diamond Engagement Ring",
        image: "images/ring2.webp",
        price: 119.99,
        category: "rings"
    },
    {
        id: 12,
        title: "Ruby Anniversary Ring",
        image: "images/ring3.webp",
        price: 149.99,
        category: "rings"
    }
]
let loginBtn = document.getElementById("loginBtn");
let registerBtn = document.getElementById("registerBtn");
let welcomeUser = document.getElementById("welcome-user");
let cart = document.getElementById("cartBtn");
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
function drawProducts(products) {
    let x = products.map(product => {
        const inCart = cartProducts.some(p => p.id == product.id);
        const loved = favoriteProducts.some(p => p.id == product.id);
        return `
        <div class="col">
            <div data-id="${product.id}" class="products-item d-flex flex-column align-items-center pb-3">
                <div class="products-item-img">
                    <img src="${product.image}" alt="${product.title || 'Product'}" class="img-fluid">
                </div>
                <div class="products-item-details-container d-flex flex-column justify-content-center align-items-center">
                    <div class="products-item-details">
                        <h4 class="products-item-details-title">${product.title || 'Product'}</h4>
                        <p class="products-item-details-price">price: $<span>${product.price}</span></p>
                        <p class="products-item-details-category">category: <span>${product.category}</span></p>
                    </div>
                    <div class="products-item-btns d-flex justify-content-start align-items-center gap-2">
                        <i class="fa fa-heart" style="color: ${loved ? "red" : "black"}"></i>
                        <button class="btn btn-${inCart ? "danger" : "primary"}">${inCart ? "Remove from cart" : "Add to cart"}</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join("");

    document.querySelector(".products").innerHTML = x;

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
                btn.textContent = "Add to cart";
                btn.style.backgroundColor = "#0d6efd";
                btn.style.borderColor = "#0d6efd";
            }
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
            drawCartPreview();
            updateCartCount();
        });
    });

    let heart = document.querySelectorAll(".products-item-btns i")
    heart.forEach(icon => {
        icon.addEventListener("click", () => {
            if (!check()) return;
            const productParent = icon.closest(".products-item");
            const id = productParent.getAttribute("data-id");
            const title = productParent.querySelector(".products-item-details-title").textContent.trim();
            const price = productParent.querySelector(".products-item-details-price span").textContent.trim();
            const image = productParent.querySelector(".products-item-img img").getAttribute("src");
            const category = productParent.querySelector(".products-item-details-category span").textContent.trim();
            const itemProduct = { id, title, image, price, category };

            let favoriteProducts = JSON.parse(localStorage.getItem("FavoriteProduct") || "[]");
            const idx = favoriteProducts.findIndex(p => p.id === id);

            if (idx === -1) {
                favoriteProducts.push(itemProduct);
                icon.style.color = "red";
            } else {
                favoriteProducts.splice(idx, 1);
                icon.style.color = "black";
            }

            localStorage.setItem("FavoriteProduct", JSON.stringify(favoriteProducts));
        });
    });


}
drawProducts(products);

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
                <p class="m-0 text-muted">$${(item.price * item.count).toFixed(2)}</p>
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
            btnParent.querySelector("span").textContent = count;
            cartProducts[idx].count = count;
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
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
                    btnParent.querySelector("span").textContent = count;
                    cartProducts[idx].count = count;
                } else {
                    cartProducts.splice(idx, 1);
                    btnParent.remove();
                    let itemProductBtn = document.querySelector(`.products-item[data-id="${id}"] button`);
                    console.log(itemProductBtn);
                    itemProductBtn.style.backgroundColor = "#0d6efd";
                    itemProductBtn.style.borderColor = "#0d6efd";
                    itemProductBtn.textContent = "Add to cart";
                }
                localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
                drawCartPreview();
                updateCartCount();
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
