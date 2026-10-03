// ======================================================
// CHECKOUT PAGE
// LOGIN + CART + GST + PROMO DISCOUNT + DONATION + QR
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

    const discountAmount =
        document.getElementById("discountAmount");

    const taxAmount =
        document.getElementById("taxAmount");

    const finalAmount =
        document.getElementById("finalAmount");

    const makePaymentBtn =
        document.getElementById("makePaymentBtn");


    // ==================================================
    // LOGIN CHECK
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
    // OPEN LOGIN
    // ==================================================

    function openCheckoutLogin() {

        if (!loginOverlay) {

            console.error(
                "loginOverlay not found ❌"
            );

            return;

        }


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
    // GET CART
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


            return parsed
                .filter(function (item) {

                    return (
                        item &&
                        item.id != null &&
                        Number(item.price) > 0 &&
                        Number(item.qty) > 0
                    );

                })
                .map(function (item) {

                    return {

                        id:
                            String(item.id),

                        name:
                            String(
                                item.name ||
                                "Unknown Item"
                            ),

                        price:
                            Number(item.price) || 0,

                        qty:
                            Number(item.qty) || 0,

                        img:
                            item.img || "",

                        gst_percent:
                            Number(
                                item.gst_percent
                            ) || 0

                    };

                });

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
    // SAVE CART
    // ==================================================

    function saveCheckoutCart(cartData) {

        try {

            localStorage.setItem(
                "cart",
                JSON.stringify(cartData)
            );

        }

        catch (error) {

            console.error(
                "Checkout cart save error:",
                error
            );

        }

    }


    // ==================================================
    // GET VALID PROMO DISCOUNT
    // ==================================================

    function getDiscount(subtotal) {

        subtotal =
            Number(subtotal) || 0;


        const offers = [

            {
                code: "WELCOME100",
                minAmount: 599,
                discount: 100
            },

            {
                code: "WELCOME299",
                minAmount: 1299,
                discount: 299
            }

        ];


        let promoCode =
            sessionStorage.getItem(
                "promoCode"
            );


        let savedDiscount =
            sessionStorage.getItem(
                "promoDiscount"
            );


        if (
            !promoCode ||
            savedDiscount === null
        ) {

            return 0;

        }


        promoCode =
            String(promoCode)
                .trim()
                .toUpperCase();


        const offer =
            offers.find(function (item) {

                return (
                    item.code ===
                    promoCode
                );

            });


        if (!offer) {

            sessionStorage.removeItem(
                "promoCode"
            );

            sessionStorage.removeItem(
                "promoDiscount"
            );

            return 0;

        }


        if (
            subtotal <
            offer.minAmount
        ) {

            console.log(
                "PROMO REMOVED - CART BELOW MINIMUM:",
                promoCode
            );


            sessionStorage.removeItem(
                "promoCode"
            );

            sessionStorage.removeItem(
                "promoDiscount"
            );


            return 0;

        }


        let discount =
            Number(offer.discount);


        if (
            !Number.isFinite(discount) ||
            discount < 0
        ) {

            discount = 0;

        }


        discount =
            Math.min(
                discount,
                subtotal
            );


        return discount;

    }


    // ==================================================
    // CALCULATE GST - GST ON TOP
    // ==================================================

    function calculateGST(cartData) {

        let totalGST = 0;


        cartData.forEach(function (item) {

            const price =
                Number(item.price) || 0;

            const qty =
                Number(item.qty) || 0;

            const gstPercent =
                Number(item.gst_percent) || 0;


            const itemTotal =
                price * qty;


            if (
                itemTotal <= 0 ||
                gstPercent <= 0
            ) {

                return;

            }


            const gst =
                itemTotal *
                gstPercent /
                100;


            totalGST +=
                gst;

        });


        return totalGST;

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

            sessionStorage.removeItem(
                "promoCode"
            );

            sessionStorage.removeItem(
                "promoDiscount"
            );


            checkoutCartItems.innerHTML = `

                <div class="empty-cart">

                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Looks like you haven't added anything to your cart yet.
                    </p>

                    <button
                        type="button"
                        class="empty-cart-btn"
                        onclick="window.location.href='menu.html'"
                    >
                        EXPLORE MENU
                    </button>

                </div>

            `;


            updateCheckoutTotal(
                0,
                checkoutCart
            );


            return;

        }


        // ==============================================
        // CALCULATE SUBTOTAL
        // ==============================================

        let subtotal = 0;


        checkoutCart.forEach(
            function (item) {

                const price =
                    Number(item.price) || 0;

                const qty =
                    Number(item.qty) || 0;


                subtotal +=
                    price * qty;

            }
        );


        // ==============================================
        // RENDER ITEMS
        // ==============================================

        checkoutCart.forEach(
            function (item, index) {

                const price =
                    Number(item.price) || 0;

                const qty =
                    Number(item.qty) || 1;


                const itemTotal =
                    price * qty;


                checkoutCartItems.innerHTML += `

                    <div
                        class="checkout-cart-item"
                        data-index="${index}"
                    >

                        <!-- REMOVE CROSS -->

                        <button
                            type="button"
                            class="checkout-remove"
                            data-index="${index}"
                            title="Remove item"
                            aria-label="Remove ${escapeHTML(item.name)}"
                        >
                            ×
                        </button>


                        <div class="checkout-item-left">

                            <div class="checkout-item-info">

                                <h3>
                                    ${escapeHTML(item.name)}
                                </h3>

                                <p>
                                    Freshly Prepared
                                </p>

                            </div>

                        </div>


                        <div class="checkout-item-right">

                            <div class="checkout-qty">

                                <button
                                    type="button"
                                    class="checkout-minus"
                                    data-index="${index}"
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>


                                <span>
                                    ${qty}
                                </span>


                                <button
                                    type="button"
                                    class="checkout-plus"
                                    data-index="${index}"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>

                            </div>


                            <strong
                                class="checkout-item-total"
                            >
                                ₹${itemTotal.toFixed(2)}/-
                            </strong>

                        </div>

                    </div>

                `;

            }
        );


        // ==============================================
        // UPDATE TOTALS
        // ==============================================

        updateCheckoutTotal(
            subtotal,
            checkoutCart
        );


        // ==============================================
        // PLUS BUTTON
        // ==============================================

        checkoutCartItems
            .querySelectorAll(".checkout-plus")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );


                        const cart =
                            getCart();


                        if (!cart[index]) {
                            return;
                        }


                        cart[index].qty =
                            Number(
                                cart[index].qty
                            ) + 1;


                        saveCheckoutCart(
                            cart
                        );


                        renderCheckoutCart();

                    }
                );

            });


        // ==============================================
        // MINUS BUTTON
        // ==============================================

        checkoutCartItems
            .querySelectorAll(".checkout-minus")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );


                        const cart =
                            getCart();


                        if (!cart[index]) {
                            return;
                        }


                        cart[index].qty =
                            Number(
                                cart[index].qty
                            ) - 1;


                        if (
                            cart[index].qty <= 0
                        ) {

                            cart.splice(
                                index,
                                1
                            );

                        }


                        saveCheckoutCart(
                            cart
                        );


                        renderCheckoutCart();

                    }
                );

            });


        // ==============================================
        // REMOVE ITEM
        // ==============================================

        checkoutCartItems
            .querySelectorAll(".checkout-remove")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();
                        e.stopPropagation();


                        const index =
                            Number(
                                this.dataset.index
                            );


                        const cart =
                            getCart();


                        if (
                            !Number.isInteger(index) ||
                            !cart[index]
                        ) {

                            return;

                        }


                        // Completely remove item
                        cart.splice(
                            index,
                            1
                        );


                        // Save updated cart
                        saveCheckoutCart(
                            cart
                        );


                        // Re-render cart + totals
                        renderCheckoutCart();

                    }
                );

            });

    }


    // ==================================================
    // UPDATE CHECKOUT TOTAL
    // ==================================================

    function updateCheckoutTotal(
        subtotal,
        cartData
    ) {

        subtotal =
            Number(subtotal) || 0;


        cartData =
            Array.isArray(cartData)
                ? cartData
                : [];


        // ==============================================
        // GST - ON TOP
        // ==============================================

        const totalGST =
            calculateGST(cartData);


        // ==============================================
        // ORDER TOTAL
        // ==============================================

        const orderBaseTotal =
            subtotal;


        // ==============================================
        // PROMO DISCOUNT
        // ==============================================

        const discount =
            getDiscount(subtotal);


        // ==============================================
        // DONATION
        // ==============================================

        const donationCheckbox =
            document.getElementById(
                "donation"
            );


        const donation =
            donationCheckbox &&
            donationCheckbox.checked
                ? 2
                : 0;


        // ==============================================
        // OFFER ELIGIBILITY AMOUNT
        // ==============================================

        const offerPayableAmount =
            Math.max(
                0,
                subtotal
            );


        sessionStorage.setItem(
            "checkoutPayableAmount",
            offerPayableAmount.toFixed(2)
        );


        localStorage.setItem(
            "checkoutPayableAmount",
            offerPayableAmount.toFixed(2)
        );


        // ==============================================
        // FINAL TOTAL
        // ==============================================

        const finalTotal =
            Math.max(
                0,
                orderBaseTotal +
                totalGST -
                discount +
                donation
            );


        // ==============================================
        // ORDER TOTAL
        // ==============================================

        if (orderTotal) {

            orderTotal.innerText =
                "₹" +
                orderBaseTotal.toFixed(2);

        }


        // ==============================================
        // DISCOUNT
        // ==============================================

        if (discountAmount) {

            discountAmount.innerText =
                "- ₹" +
                discount.toFixed(2);

        }


        // ==============================================
        // GST
        // ==============================================

        if (taxAmount) {

            taxAmount.innerText =
                "₹" +
                totalGST.toFixed(2);

        }


        // ==============================================
        // FINAL TO PAY
        // ==============================================

        if (finalAmount) {

            finalAmount.innerText =
                "₹" +
                finalTotal.toFixed(2);

        }


        // ==============================================
        // PAYMENT AMOUNT
        // ==============================================

        if (paymentAmount) {

            paymentAmount.innerText =
                "₹" +
                finalTotal.toFixed(2);

        }


        console.log(
            "FINAL CHECKOUT CALCULATION:",
            {

                orderTotal:
                    orderBaseTotal.toFixed(2),

                gstOnTop:
                    totalGST.toFixed(2),

                discount:
                    discount.toFixed(2),

                donation:
                    donation.toFixed(2),

                payableAmount:
                    finalTotal.toFixed(2)

            }
        );

    }


    // ==================================================
    // QR TABLE NUMBER
    // ==================================================

    function updateCheckoutTable() {

        const tableOption =
            document.getElementById(
                "qrTableOption"
            );


        const tableNumberElement =
            document.getElementById(
                "checkoutTableNumber"
            );


        if (
            !tableOption ||
            !tableNumberElement
        ) {
            return;
        }


        const tableFromQR =
            sessionStorage.getItem(
                "tableFromQR"
            );


        const savedTable =
            sessionStorage.getItem(
                "tableNumber"
            );


        if (
            tableFromQR === "true" &&
            savedTable
        ) {

            tableNumberElement.innerText =
                savedTable.toUpperCase();


            tableOption.style.display =
                "block";

        }

        else {

            tableOption.style.display =
                "none";

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
                document.visibilityState ===
                "visible"
            ) {

                updateCustomerDetails();

                renderCheckoutCart();

                updateCheckoutTable();

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


                if (
                    checkoutCart.length === 0
                ) {

                    alert(
                        "No items are added to your cart."
                    );


                    return;

                }


                // ======================================
                // UPDATE LATEST TOTAL
                // ======================================

                let subtotal = 0;


                checkoutCart.forEach(
                    function (item) {

                        subtotal +=
                            Number(item.price) *
                            Number(item.qty);

                    }
                );


                updateCheckoutTotal(
                    subtotal,
                    checkoutCart
                );


                // ======================================
                // GET FINAL PAYMENT AMOUNT
                // ======================================

                const finalPayable =
                    document.getElementById(
                        "finalAmount"
                    );


                let payableAmount = 0;


                if (finalPayable) {

                    payableAmount =
                        Number(
                            finalPayable.innerText
                                .replace(/[₹,]/g, "")
                                .trim()
                        ) || 0;

                }


                // ======================================
                // SAVE EXACT FINAL TO PAY
                // ======================================

                sessionStorage.setItem(
                    "checkoutFinalAmount",
                    payableAmount.toFixed(2)
                );


                localStorage.setItem(
                    "checkoutFinalAmount",
                    payableAmount.toFixed(2)
                );


                // ======================================
                // SAVE SUMMARY DATA
                // ======================================

                if (orderTotal) {

                    sessionStorage.setItem(
                        "checkoutOrderTotal",
                        orderTotal.innerText
                            .replace(/[₹,]/g, "")
                            .trim()
                    );

                }


                if (discountAmount) {

                    sessionStorage.setItem(
                        "checkoutDiscount",
                        discountAmount.innerText
                            .replace(/[₹,-]/g, "")
                            .trim()
                    );

                }


                if (taxAmount) {

                    sessionStorage.setItem(
                        "checkoutTax",
                        taxAmount.innerText
                            .replace(/[₹,]/g, "")
                            .trim()
                    );

                }


                // ======================================
                // OPEN PAYMENT PAGE
                // ======================================

                window.location.href =
                    "payment.html";

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
    // DONATION CHANGE
    // ==================================================

    const donationCheckbox =
        document.getElementById(
            "donation"
        );


    if (donationCheckbox) {

        donationCheckbox.addEventListener(
            "change",
            function () {

                const checkoutCart =
                    getCart();


                let subtotal = 0;


                checkoutCart.forEach(
                    function (item) {

                        subtotal +=
                            Number(item.price) *
                            Number(item.qty);

                    }
                );


                updateCheckoutTotal(
                    subtotal,
                    checkoutCart
                );

            }
        );

    }


    // ==================================================
    // INITIALIZE
    // ==================================================

    updateCustomerDetails();

    renderCheckoutCart();

    updateCheckoutTable();

});