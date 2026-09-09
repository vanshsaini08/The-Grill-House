// ======================================================
// CHECKOUT PAGE - LOGIN + CART SYSTEM
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("CHECKOUT JS LOADED ✅");


    // ==================================================
    // ELEMENTS
    // ==================================================

    const customerInfo =
        document.getElementById("customerInfo");

    const cartLoginBtn =
        document.getElementById("cartLoginBtn");

    const loginOverlay =
        document.getElementById("loginOverlay");

    const paymentAmount =
        document.getElementById("paymentAmount");

    const orderTotal =
        document.getElementById("orderTotal");

    const taxAmount =
        document.getElementById("taxAmount");

    const finalAmount =
        document.getElementById("finalAmount");

    const makePaymentBtn =
        document.getElementById("makePaymentBtn");


    // ==================================================
    // CHECK LOGIN STATUS
    // ==================================================

    function isUserLoggedIn() {

        return (
            localStorage.getItem("isLoggedIn") === "true"
        );

    }


    // ==================================================
    // UPDATE CUSTOMER DETAILS
    // ==================================================

    function updateCustomerDetails() {

        if (!customerInfo || !cartLoginBtn) {
            return;
        }


        const loggedIn =
            isUserLoggedIn();


        // ==============================================
        // USER LOGGED IN
        // ==============================================

        if (loggedIn) {

            const name =
                localStorage.getItem("customerName") ||
                "Customer";

            const phone =
                localStorage.getItem("customerPhone") ||
                "";


            customerInfo.innerHTML = `

                <div class="logged-customer">

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                    <span>
                        +91 ${escapeHTML(phone)}
                    </span>

                </div>

            `;


            cartLoginBtn.innerText =
                "MY PROFILE";


            cartLoginBtn.onclick =
                function () {

                    window.location.href =
                        "profile.html";

                };

        }


        // ==============================================
        // USER NOT LOGGED IN
        // ==============================================

        else {

            customerInfo.innerHTML = `

                <span>
                    To place your order now, login to your account.
                </span>

            `;


            cartLoginBtn.innerText =
                "LOGIN TO PLACE ORDER";


            cartLoginBtn.onclick =
                function () {

                    openCheckoutLogin();

                };

        }

    }


    // ==================================================
    // OPEN LOGIN POPUP
    // ==================================================

    function openCheckoutLogin() {

        if (!loginOverlay) {

            console.error(
                "loginOverlay not found ❌"
            );

            return;

        }


        // ==============================================
        // IMPORTANT
        // LOGIN KE BAAD CHECKOUT PAR RETURN KARNA HAI
        // ==============================================

        sessionStorage.setItem(
            "loginReturnPage",
            "checkout.html"
        );


        loginOverlay.style.display =
            "flex";

    }


    // ==================================================
    // HTML ESCAPE
    // ==================================================

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ==================================================
    // CART DATA
    // ==================================================

    function getCart() {

        try {

            const savedCart =
                localStorage.getItem("cart");


            if (!savedCart) {

                return [];

            }


            const parsed =
                JSON.parse(savedCart);


            if (!Array.isArray(parsed)) {

                return [];

            }


            return parsed.filter(
                function (item) {

                    return (
                        item &&
                        item.id != null &&
                        Number(item.price) > 0 &&
                        Number(item.qty) > 0
                    );

                }
            );

        }
        catch (error) {

            console.error(
                "Checkout cart error:",
                error
            );

            return [];

        }

    }


    // ==================================================
    // RENDER CHECKOUT CART
    // ==================================================

    function renderCheckoutCart() {

        const checkoutCartItems =
            document.getElementById(
                "checkoutCartItems"
            );


        if (!checkoutCartItems) {

            return;

        }


        const checkoutCart =
            getCart();


        checkoutCartItems.innerHTML =
            "";


        // ==============================================
        // EMPTY CART
        // ==============================================

        if (checkoutCart.length === 0) {

            checkoutCartItems.innerHTML = `

                <div class="empty-cart">

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Add some delicious items!
                    </p>

                </div>

            `;


            updateCheckoutTotal(0);

            return;

        }


        // ==============================================
        // ITEMS
        // ==============================================

        let total =
            0;


        checkoutCart.forEach(
            function (item) {

                const price =
                    Number(item.price) || 0;


                const qty =
                    Number(item.qty) || 1;


                const itemTotal =
                    price * qty;


                total +=
                    itemTotal;


                checkoutCartItems.innerHTML += `

                    <div class="checkout-cart-item">

                        <div class="checkout-item-info">

                            <strong>
                                ${escapeHTML(item.name)}
                            </strong>

                            <span>
                                Qty: ${qty}
                            </span>

                        </div>


                        <div class="checkout-item-price">

                            ₹${itemTotal.toFixed(2)}

                        </div>

                    </div>

                `;

            }
        );


        updateCheckoutTotal(total);

    }


    // ==================================================
    // UPDATE TOTAL
    // ==================================================

    function updateCheckoutTotal(subtotal) {

        const tax =
            0;

        const discount =
            0;


        const finalTotal =
            subtotal + tax - discount;


        if (orderTotal) {

            orderTotal.innerText =
                "₹" + subtotal.toFixed(2);

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


    // ==================================================
    // LOGIN STATE LISTENER
    // ==================================================

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key === "isLoggedIn" ||
                event.key === "customerName" ||
                event.key === "customerPhone"
            ) {

                updateCustomerDetails();

            }

        }
    );


    // ==================================================
    // PAGE VISIBILITY
    // ==================================================

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState === "visible"
            ) {

                updateCustomerDetails();

                renderCheckoutCart();

            }

        }
    );


    // ==================================================
    // PAYMENT BUTTON
    // ==================================================

    if (makePaymentBtn) {

        makePaymentBtn.addEventListener(
            "click",
            function () {

                // ======================================
                // LOGIN CHECK
                // ======================================

                if (!isUserLoggedIn()) {

                    openCheckoutLogin();

                    return;

                }


                // ======================================
                // CART CHECK
                // ======================================

                const checkoutCart =
                    getCart();


                if (checkoutCart.length === 0) {

                    alert(
                        "No items are added to your cart."
                    );

                    return;

                }


                // ======================================
                // PAYMENT POPUP
                // ======================================

                const paymentOverlay =
                    document.getElementById(
                        "paymentOverlay"
                    );


                if (paymentOverlay) {

                    paymentOverlay.classList.add(
                        "show"
                    );

                }

            }
        );

    }


    // ==================================================
    // PAYMENT POPUP CLOSE
    // ==================================================

    const paymentClose =
        document.getElementById(
            "paymentClose"
        );


    if (paymentClose) {

        paymentClose.addEventListener(
            "click",
            function () {

                const paymentOverlay =
                    document.getElementById(
                        "paymentOverlay"
                    );


                if (paymentOverlay) {

                    paymentOverlay.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    // ==================================================
    // INITIALIZE
    // ==================================================

    updateCustomerDetails();

    renderCheckoutCart();

});