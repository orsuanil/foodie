// Add item to cart

function addToCart(name, price) {

    console.log("Clicked:", name, price);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
        name: name,
        price: price
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    console.log(localStorage.getItem("cart"));

    alert(name + " added to cart!");
}

// Display cart items
function displayCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartItems = document.getElementById("cart-items");

    let total = 0;

    if (!cartItems) return;

    cartItems.innerHTML = "";

    cart.forEach(function(item, index) {

        cartItems.innerHTML += `
            <div class="cart-item">
                <p><b>${item.name}</b> - ₹${item.price}</p>

                <button onclick="removeItem(${index})">
                    Remove
                </button>

                <hr>
            </div>
        `;

        total += item.price;
    });

    document.getElementById("total").innerHTML =
        "Total : ₹" + total;
}
function removeItem(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index,1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}
// Go to checkout page
function goToCheckout() {

    window.location.href = "checkout.html";
}

// Run only on cart page
displayCart();
let checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", async function(e) {

        e.preventDefault();

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let orderDetails = "🍔 New Food Order\n\n";

        cart.forEach(item => {
            orderDetails += `${item.name} - ₹${item.price}\n`;
        });

        let total = cart.reduce((sum, item) => sum + item.price, 0);

        orderDetails += "\nTotal: ₹" + total;

        try {

            const response = await fetch("https://foodie-backend-production-81b4.up.railway.app/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    items: orderDetails,
                    total: total
                })
            });

            console.log(await response.text());

            alert("Order Placed Successfully!");

            localStorage.removeItem("cart");

            window.location.href = "success.html";

        } catch (err) {

            console.error(err);

            alert("Could not place order!");

        }

    });

}
 





// Load Restaurants from Spring Boot
// Load Restaurants from Spring Boot
async function loadRestaurants() {

    console.log("Loading restaurants...");

    let container = document.getElementById("menu-container");

    if (!container) return;

    try {

        let response = await fetch("https://foodie-backend-production-81b4.up.railway.app/restaurants");

        let restaurants = await response.json();

        console.log(restaurants);

        container.innerHTML = "";

        restaurants.forEach(function(item) {

            container.innerHTML += `
                <div class="food-card">

                    <img src="./images/${item.image}" alt="${item.name}" class="food-image">

                    <h2>${item.name}</h2>

                    <p>${item.address}</p>
                    <p>${item.phone}</p>

                    <h3>⭐ ${item.rating} &nbsp;&nbsp; 📍 ${item.address}</h3>

                    <p class="price">₹${item.price}</p>

                    <button class="add-btn"
                            data-name="${item.name}"
                            data-price="${item.price}">
                        Add to Cart
                    </button>

                </div>
            `;
        });

        // Add click event to every button
        document.querySelectorAll(".add-btn").forEach(button => {
            button.addEventListener("click", function () {
                addToCart(
                    this.dataset.name,
                    Number(this.dataset.price)
                );
            });
        });

    } catch (error) {

        console.error("Fetch Error:", error);
        alert("Fetch Error: " + error);

    }
}

loadRestaurants();