// ==========================================
// OFFERS SYSTEM - THE GRILL HOUSE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("OFFERS JS LOADED ✅");


    // ==========================================
    // AVAILABLE OFFERS
    // ==========================================

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


    // ==========================================
    // GET CART
    // ==========================================

    function getCart() {

        try {

            const savedCart =
                localStorage.getItem("cart");


            if (!savedCart) {

                return [];

            }


            const parsedCart =
                JSON.parse(savedCart);


            if (!Array.isArray(parsedCart)) {

                return [];

            }


            return parsedCart
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

                        gst_percent:
                            Number(
                                item.gst_percent
                            ) || 0

                    };

                });

        }

        catch (error) {

            console.error(
                "Offer cart error:",
                error
            );

            return [];

        }

    }


    // ==========================================
    // CALCULATE CART TOTAL
    // ==========================================
    // IMPORTANT:
    // Offer eligibility cart item total par hai.
    // GST aur donation eligibility mein include nahi honge.
    //
    // WELCOME100  = ₹599+
    // WELCOME299  = ₹1299+
    // ==========================================

    function calculateCartTotal() {

        const cart =
            getCart();


        if (cart.length === 0) {

            return 0;

        }


        let cartTotal = 0;


        cart.forEach(function (item) {

            const price =
                Number(item.price) || 0;

            const qty =
                Number(item.qty) || 0;


            cartTotal +=
                price * qty;

        });


        return cartTotal;

    }


    // ==========================================
    // SAVE CURRENT CART TOTAL
    // ==========================================

    function getCurrentCartTotal() {

        const amount =
            calculateCartTotal();


        sessionStorage.setItem(
            "checkoutPayableAmount",
            amount.toFixed(2)
        );


        localStorage.setItem(
            "checkoutPayableAmount",
            amount.toFixed(2)
        );


        console.log(
            "OFFER ELIGIBILITY AMOUNT:",
            amount.toFixed(2)
        );


        return amount;

    }


    // ==========================================
    // UPDATE OFFER STATUS
    // ==========================================

    function updateOffers() {

        const cartTotal =
            getCurrentCartTotal();


        console.log(
            "CHECKING OFFERS FOR:",
            cartTotal
        );


        offers.forEach(function (offer) {

            const button =
                document.querySelector(
                    `.offer-apply-btn[data-code="${offer.code}"]`
                );


            if (!button) {

                return;

            }


            const card =
                button.closest(
                    ".offer-card"
                );


            if (!card) {

                return;

            }


            const status =
                card.querySelector(
                    ".offer-status"
                );


            // ======================================
            // ELIGIBLE
            // ======================================

            if (
                cartTotal >=
                offer.minAmount
            ) {

                card.classList.add(
                    "eligible"
                );


                button.disabled =
                    false;


                button.style.cursor =
                    "pointer";


                button.innerText =
                    "APPLY";


                if (status) {

                    status.innerText =
                        "₹" +
                        offer.discount +
                        " OFF available!";


                    status.style.color =
                        "#168a16";

                }


                console.log(
                    offer.code +
                    " → ELIGIBLE ✅"
                );

            }


            // ======================================
            // NOT ELIGIBLE
            // ======================================

            else {

                card.classList.remove(
                    "eligible"
                );


                button.disabled =
                    true;


                button.style.cursor =
                    "not-allowed";


                const remaining =
                    offer.minAmount -
                    cartTotal;


                if (status) {

                    status.innerText =
                        "Add ₹" +
                        Math.max(
                            0,
                            remaining
                        ).toFixed(0) +
                        " more to Avail this offer";


                    status.style.color =
                        "red";

                }


                console.log(
                    offer.code +
                    " → NOT ELIGIBLE ❌"
                );

            }

        });

    }


    // ==========================================
    // APPLY PROMO CODE
    // ==========================================

    function applyPromoCode(code) {

        const enteredCode =
            String(code || "")
                .trim()
                .toUpperCase();


        const cartTotal =
            getCurrentCartTotal();


        // ======================================
        // FIND OFFER
        // ======================================

        const offer =
            offers.find(function (item) {

                return (
                    item.code ===
                    enteredCode
                );

            });


        // ======================================
        // INVALID CODE
        // ======================================

        if (!offer) {

            alert(
                "Invalid promo code."
            );


            return false;

        }


        // ======================================
        // MINIMUM CART CHECK
        // ======================================

        if (
            cartTotal <
            offer.minAmount
        ) {

            const remaining =
                offer.minAmount -
                cartTotal;


            alert(
                "Add ₹" +
                remaining.toFixed(0) +
                " more to use " +
                offer.code +
                "."
            );


            return false;

        }


        // ======================================
        // REMOVE OLD PROMO
        // ======================================

        sessionStorage.removeItem(
            "promoCode"
        );


        sessionStorage.removeItem(
            "promoDiscount"
        );


        // ======================================
        // SAVE NEW PROMO
        // ======================================

        sessionStorage.setItem(
            "promoCode",
            offer.code
        );


        sessionStorage.setItem(
            "promoDiscount",
            String(
                offer.discount
            )
        );


        console.log(
            "PROMO APPLIED ✅"
        );


        console.log(
            "Promo Code:",
            offer.code
        );


        console.log(
            "Discount:",
            offer.discount
        );


        console.log(
            "Cart Total:",
            cartTotal
        );


        return true;

    }


    // ==========================================
    // OFFER CARD APPLY BUTTONS
    // ==========================================

    document
        .querySelectorAll(
            ".offer-apply-btn"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const code =
                        this.dataset.code;


                    const success =
                        applyPromoCode(
                            code
                        );


                    if (success) {

                        window.location.href =
                            "checkout.html";

                    }

                }
            );

        });


    // ==========================================
    // TOP PROMO INPUT
    // ==========================================

    const promoInput =
        document.getElementById(
            "promoCodeInput"
        );


    const applyPromoBtn =
        document.getElementById(
            "applyPromoBtn"
        );


    if (
        promoInput &&
        applyPromoBtn
    ) {

        applyPromoBtn.addEventListener(
            "click",
            function () {

                const code =
                    promoInput.value;


                const success =
                    applyPromoCode(
                        code
                    );


                if (success) {

                    window.location.href =
                        "checkout.html";

                }

            }
        );


        promoInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();


                    applyPromoBtn.click();

                }

            }
        );

    }


    // ==========================================
    // INITIALIZE
    // ==========================================

    updateOffers();

});