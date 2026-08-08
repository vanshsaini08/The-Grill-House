// =====================================
// CHECKOUT - CUSTOMER DETAILS
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // Check Login
    if (localStorage.getItem("isLoggedIn") !== "true") {

        window.location.href = "index.html";
        return;

    }

    // Get Customer Details
    const name = localStorage.getItem("customerName");
    const phone = localStorage.getItem("customerPhone");

    const customerInfo = document.getElementById("customerInfo");

    // Show Customer Details
    if (customerInfo) {

        if (name && phone) {

            customerInfo.textContent = name + ", " + phone;

        } else if (name) {

            customerInfo.textContent = name;

        } else {

            customerInfo.textContent = "Guest User";

        }

    }

});





document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // CART
    // =========================================

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    // =========================================
    // ELEMENTS
    // =========================================

    const cartContainer =
        document.getElementById("checkoutCartItems");

    const orderTotal =
        document.getElementById("orderTotal");

    const discountAmount =
        document.getElementById("discountAmount");

    const taxAmount =
        document.getElementById("taxAmount");

    const finalAmount =
        document.getElementById("finalAmount");

    const paymentAmount =
        document.getElementById("paymentAmount");


    // =========================================
    // RENDER CART
    // =========================================

    function renderCheckoutCart() {

        if (!cartContainer) return;

        cartContainer.innerHTML = "";

        if (cart.length === 0) {

            cartContainer.innerHTML = `
                <div style="
                    text-align:center;
                    padding:30px 10px;
                    color:#777;
                ">
                    <i class="fas fa-shopping-cart"
                       style="font-size:30px;margin-bottom:10px;">
                    </i>

                    <p>Your cart is empty.</p>

                    <a href="menu.html">
                        <button class="profile-primary">
                            ORDER NOW
                        </button>
                    </a>
                </div>
            `;

            updateBill();

            return;
        }


        cart.forEach((item, index) => {

            const itemTotal =
                Number(item.price) * Number(item.qty);


            cartContainer.innerHTML += `

                <div class="checkout-cart-item">

                    <div class="checkout-item-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            Freshly Prepared
                        </p>

                    </div>


                    <div class="checkout-item-right">

                        <div class="checkout-qty">

                            <button
                                class="checkout-minus"
                                data-index="${index}">
                                −
                            </button>

                            <span>
                                ${item.qty}
                            </span>

                            <button
                                class="checkout-plus"
                                data-index="${index}">
                                +
                            </button>

                        </div>


                        <strong>
                            ₹${itemTotal.toFixed(2)}/-
                        </strong>

                    </div>

                </div>

            `;

        });


        bindQuantityButtons();

        updateBill();

    }


    // =========================================
    // PLUS / MINUS
    // =========================================

    function bindQuantityButtons() {

        document
            .querySelectorAll(".checkout-plus")
            .forEach(button => {

                button.onclick = function () {

                    const index =
                        Number(this.dataset.index);

                    cart[index].qty++;

                    saveCart();

                    renderCheckoutCart();

                };

            });


        document
            .querySelectorAll(".checkout-minus")
            .forEach(button => {

                button.onclick = function () {

                    const index =
                        Number(this.dataset.index);

                    cart[index].qty--;


                    // Quantity 0 → Remove
                    if (cart[index].qty <= 0) {

                        cart.splice(index, 1);

                    }


                    saveCart();

                    renderCheckoutCart();

                };

            });

    }


    // =========================================
    // SAVE CART
    // =========================================

    function saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }


    // =========================================
    // BILL CALCULATION
    // =========================================

    function updateBill() {

        let total = 0;


        cart.forEach(item => {

            total +=
                Number(item.price) *
                Number(item.qty);

        });


        // Temporary discount
        let discount = 0;


        // 5% GST example
        let tax = total * 0.05;


        let finalTotal =
            total - discount + tax;


        // =====================================
        // DISPLAY
        // =====================================

        if (orderTotal) {

            orderTotal.innerText =
                "₹" + total.toFixed(2);

        }


        if (discountAmount) {

            discountAmount.innerText =
                "- ₹" + discount.toFixed(2);

        }


        if (taxAmount) {

            taxAmount.innerText =
                "₹" + tax.toFixed(2);

        }


        if (finalAmount) {

            finalAmount.innerText =
                "₹" + finalTotal.toFixed(2);

        }


        if (paymentAmount) {

            paymentAmount.innerText =
                "₹" + finalTotal.toFixed(2);

        }

    }


    // =========================================
    // START
    // =========================================

    renderCheckoutCart();

});