// ======================================================
// PAYMENT PAGE
// DEMO CARD + DEMO QR PAYMENT
// DATABASE ORDER INSERT
// PAYMENT METHOD SEND
// CART CLEAR
// PROFILE REDIRECT
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("PAYMENT PAGE LOADED ✅");


    // ==================================================
    // ELEMENTS
    // ==================================================

    const cardPanel =
        document.getElementById("cardPanel");

    const upiPanel =
        document.getElementById("upiPanel");

    const paymentMethods =
        document.querySelectorAll(".payment-method");

    const cardPayBtn =
        document.getElementById("cardPayBtn");

    const upiPayBtn =
        document.getElementById("upiPayBtn");

    const processingOverlay =
        document.getElementById("processingOverlay");

    const successOverlay =
        document.getElementById("successOverlay");

    const successAmount =
        document.getElementById("successAmount");

    const successContinueBtn =
        document.getElementById("successContinueBtn");


    // ==================================================
    // GET PAYMENT AMOUNT
    // ==================================================

    function getPaymentAmount() {

        let amount = 0;

        // Final checkout amount
        const savedAmount =
            sessionStorage.getItem(
                "checkoutFinalAmount"
            );

        if (
            savedAmount !== null &&
            savedAmount !== ""
        ) {
            amount = Number(savedAmount);
        }


        // LocalStorage fallback
        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            const localAmount =
                localStorage.getItem(
                    "checkoutFinalAmount"
                );

            if (
                localAmount !== null &&
                localAmount !== ""
            ) {
                amount = Number(localAmount);
            }
        }


        // Checkout payable fallback
        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            const checkoutAmount =
                sessionStorage.getItem(
                    "checkoutPayableAmount"
                );

            if (
                checkoutAmount !== null &&
                checkoutAmount !== ""
            ) {
                amount = Number(checkoutAmount);
            }
        }


        if (
            !Number.isFinite(amount) ||
            amount < 0
        ) {
            amount = 0;
        }

        return amount;
    }


    // ==================================================
    // SAVE CURRENT AMOUNT
    // ==================================================

    const amount =
        getPaymentAmount();

    console.log(
        "PAYMENT AMOUNT:",
        amount
    );


    // ==================================================
    // UPDATE AMOUNT UI
    // ==================================================

    function updatePaymentAmount() {

        const formatted =
            "₹" + amount.toFixed(2);


        const cardPayAmount =
            document.getElementById(
                "cardPayAmount"
            );

        const upiPayAmount =
            document.getElementById(
                "upiPayAmount"
            );

        const summaryTotal =
            document.getElementById(
                "summaryTotal"
            );


        if (cardPayAmount) {
            cardPayAmount.innerText =
                formatted;
        }


        if (upiPayAmount) {
            upiPayAmount.innerText =
                formatted;
        }


        if (summaryTotal) {
            summaryTotal.innerText =
                formatted;
        }


        if (successAmount) {
            successAmount.innerText =
                formatted;
        }
    }


    // ==================================================
    // LOAD CHECKOUT DATA
    // ==================================================

    function loadCheckoutData() {

        // ==============================================
        // CUSTOMER
        // ==============================================

        const customerName =
            localStorage.getItem(
                "customerName"
            );


        const customerNameElement =
            document.getElementById(
                "customerName"
            );


        if (customerNameElement) {

            customerNameElement.innerText =
                customerName ||
                "Customer";
        }


        // ==============================================
        // TABLE
        // ==============================================

        const tableFromQR =
            sessionStorage.getItem(
                "tableFromQR"
            );


        const tableNumber =
            sessionStorage.getItem(
                "tableNumber"
            );


        const tableRow =
            document.getElementById(
                "tableRow"
            );


        const tableNumberElement =
            document.getElementById(
                "tableNumber"
            );


        if (
            tableFromQR === "true" &&
            tableNumber
        ) {

            if (tableRow) {
                tableRow.style.display =
                    "flex";
            }


            if (tableNumberElement) {

                tableNumberElement.innerText =
                    tableNumber.toUpperCase();
            }
        }


        // ==============================================
        // TOTALS
        // ==============================================

        const savedOrderTotal =
            sessionStorage.getItem(
                "checkoutOrderTotal"
            );


        const savedDiscount =
            sessionStorage.getItem(
                "checkoutDiscount"
            );


        const savedTax =
            sessionStorage.getItem(
                "checkoutTax"
            );


        const summaryOrderTotal =
            document.getElementById(
                "summaryOrderTotal"
            );


        const summaryDiscount =
            document.getElementById(
                "summaryDiscount"
            );


        const summaryTax =
            document.getElementById(
                "summaryTax"
            );


        if (
            summaryOrderTotal &&
            savedOrderTotal
        ) {

            summaryOrderTotal.innerText =
                "₹" +
                Number(savedOrderTotal)
                    .toFixed(2);
        }


        if (
            summaryDiscount &&
            savedDiscount
        ) {

            summaryDiscount.innerText =
                "- ₹" +
                Number(savedDiscount)
                    .toFixed(2);
        }


        if (
            summaryTax &&
            savedTax
        ) {

            summaryTax.innerText =
                "₹" +
                Number(savedTax)
                    .toFixed(2);
        }
    }


    // ==================================================
    // PAYMENT METHOD SWITCH
    // ==================================================

    paymentMethods.forEach(function (method) {

        method.addEventListener(
            "click",
            function () {

                paymentMethods.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );
                    }
                );


                this.classList.add(
                    "active"
                );


                const selectedMethod =
                    this.dataset.method;


                if (
                    selectedMethod ===
                    "card"
                ) {

                    if (cardPanel) {

                        cardPanel.style.display =
                            "block";
                    }


                    if (upiPanel) {

                        upiPanel.style.display =
                            "none";
                    }
                }


                if (
                    selectedMethod ===
                    "upi"
                ) {

                    if (cardPanel) {

                        cardPanel.style.display =
                            "none";
                    }


                    if (upiPanel) {

                        upiPanel.style.display =
                            "block";
                    }
                }
            }
        );
    });


    // ==================================================
    // CARD NUMBER FORMAT
    // ==================================================

    const cardNumber =
        document.getElementById(
            "cardNumber"
        );


    if (cardNumber) {

        cardNumber.addEventListener(
            "input",
            function () {

                let value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 16);


                let formatted =
                    value.match(/.{1,4}/g);


                this.value =
                    formatted
                        ? formatted.join(" ")
                        : "";
            }
        );
    }


    // ==================================================
    // EXPIRY FORMAT
    // ==================================================

    const expiry =
        document.getElementById(
            "expiry"
        );


    if (expiry) {

        expiry.addEventListener(
            "input",
            function () {

                let value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 4);


                if (value.length >= 3) {

                    value =
                        value.substring(0, 2) +
                        "/" +
                        value.substring(2);
                }


                this.value =
                    value;
            }
        );
    }


    // ==================================================
    // DEMO CARD VALIDATION
    // ==================================================

    function validateDemoCard() {

        const cardNumberElement =
            document.getElementById(
                "cardNumber"
            );


        const cardHolderElement =
            document.getElementById(
                "cardHolder"
            );


        const expiryElement =
            document.getElementById(
                "expiry"
            );


        const cvvElement =
            document.getElementById(
                "cvv"
            );


        if (
            !cardNumberElement ||
            !cardHolderElement ||
            !expiryElement ||
            !cvvElement
        ) {

            alert(
                "Payment form fields not found."
            );

            return false;
        }


        const number =
            cardNumberElement.value
                .replace(/\s/g, "");


        const holder =
            cardHolderElement.value
                .trim();


        const expiryValue =
            expiryElement.value
                .trim();


        const cvv =
            cvvElement.value
                .trim();


        if (number.length !== 16) {

            alert(
                "Enter a valid 16 digit demo card number."
            );

            return false;
        }


        if (!holder) {

            alert(
                "Enter card holder name."
            );

            return false;
        }


        if (
            !/^\d{2}\/\d{2}$/.test(
                expiryValue
            )
        ) {

            alert(
                "Enter expiry in MM/YY format."
            );

            return false;
        }


        if (!/^\d{3}$/.test(cvv)) {

            alert(
                "Enter a valid 3 digit CVV."
            );

            return false;
        }


        return true;
    }


    // ==================================================
    // GET PAYMENT METHOD
    // ==================================================

    function getSelectedPaymentMethod() {

        const activeMethod =
            document.querySelector(
                ".payment-method.active"
            );


        if (!activeMethod) {
            return "Card";
        }


        const method =
            activeMethod.dataset.method ||
            "card";


        if (
            method.toLowerCase() ===
            "upi"
        ) {
            return "UPI";
        }


        if (
            method.toLowerCase() ===
            "card"
        ) {
            return "Card";
        }


        return "Card";
    }


    // ==================================================
    // GET ORDER TYPE
    // ==================================================

    function getOrderType() {

        const keys = [
            "orderType",
            "selectedOrderType",
            "serviceType"
        ];


        for (const key of keys) {

            const value =
                localStorage.getItem(key) ||
                sessionStorage.getItem(key);


            if (value) {
                return value;
            }
        }


        // QR/table orders are generally Dine-In
        const tableFromQR =
            sessionStorage.getItem(
                "tableFromQR"
            );


        if (tableFromQR === "true") {
            return "Dine-In";
        }


        return "Takeaway";
    }


    // ==================================================
    // GET CART
    // ==================================================

    function getCartItems() {

        let cart = [];


        try {

            cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];

        } catch (error) {

            console.error(
                "Cart JSON error:",
                error
            );

            cart = [];
        }


        if (!Array.isArray(cart)) {
            cart = [];
        }


        return cart.map(function (item) {

            return {

                name:
                    item.name || "",

                qty:
                    Number(item.qty) || 1,

                price:
                    Number(item.price) || 0,

                gst_percent:
                    Number(
                        item.gst_percent
                    ) || 0

            };
        });
    }


    // ==================================================
    // GET TABLE NUMBER
    // ==================================================

    function getTableNumber() {

        const tableFromQR =
            sessionStorage.getItem(
                "tableFromQR"
            );


        const tableNumber =
            sessionStorage.getItem(
                "tableNumber"
            );


        if (
            tableFromQR === "true" &&
            tableNumber
        ) {

            return tableNumber;
        }


        return "";
    }


    // ==================================================
    // CLEAR CART
    // ==================================================

    function clearCartAfterOrder() {

        // Clear actual cart
        localStorage.removeItem("cart");


        // Reset cart count if present
        const cartCount =
            document.getElementById(
                "cartCount"
            );


        if (cartCount) {

            cartCount.innerText = "0";

            cartCount.textContent = "0";
        }


        console.log(
            "CART CLEARED ✅"
        );
    }


    // ==================================================
    // PLACE ORDER IN DATABASE
    // ==================================================

    async function placeOrderInDatabase() {

        const customerName =
            localStorage.getItem(
                "customerName"
            ) || "";


        const mobileNo =
            localStorage.getItem(
                "customerPhone"
            ) ||
            localStorage.getItem(
                "mobileNo"
            ) ||
            "";


        const cartItems =
            getCartItems();


        if (!customerName) {

            throw new Error(
                "Customer name not found. Please login again."
            );
        }


        if (!mobileNo) {

            throw new Error(
                "Customer mobile number not found. Please login again."
            );
        }


        if (!cartItems.length) {

            throw new Error(
                "Cart is empty."
            );
        }


        // ==============================================
        // GET SELECTED PAYMENT METHOD
        // ==============================================

        const paymentMethod =
            getSelectedPaymentMethod();


        // ==============================================
        // ORDER DATA
        // ==============================================

        const orderData = {

            customer_name:
                customerName,

            mobile_no:
                mobileNo,

            table_name:
                getTableNumber(),

            order_type:
                getOrderType(),

            total_amount:
                Number(
                    amount.toFixed(2)
                ),

            payment_method:
                paymentMethod,

            payment_status:
                "Paid",

            items:
                cartItems
        };


        console.log(
            "ORDER DATA:",
            orderData
        );


        const response =
            await fetch(
                "api/place_order.php",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            orderData
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );
        }


        const result =
            await response.json();


        console.log(
            "DATABASE RESPONSE:",
            result
        );


        if (!result.success) {

            throw new Error(
                result.message ||
                "Order could not be placed."
            );
        }


        // ==========================================
        // SAVE ORDER INFORMATION
        // ==========================================

        sessionStorage.setItem(
            "orderID",
            result.order_id
        );


        localStorage.setItem(
            "lastOrderID",
            result.order_id
        );


        sessionStorage.setItem(
            "orderPaymentStatus",
            "Paid"
        );


        sessionStorage.setItem(
            "orderStatus",
            "Pending"
        );


        // Save selected payment method locally
        sessionStorage.setItem(
            "paymentMethod",
            paymentMethod
        );


        return result;
    }


    // ==================================================
    // START DEMO PAYMENT
    // ==================================================

    async function startDemoPayment() {

        if (amount <= 0) {

            alert(
                "Invalid payment amount."
            );

            return;
        }


        if (processingOverlay) {

            processingOverlay.classList.add(
                "show"
            );
        }


        try {

            // ==========================================
            // DEMO PAYMENT PROCESSING
            // ==========================================

            await new Promise(function (resolve) {

                setTimeout(
                    resolve,
                    1800
                );
            });


            // ==========================================
            // DATABASE ORDER
            // ==========================================

            const result =
                await placeOrderInDatabase();


            // ==========================================
            // PAYMENT SUCCESS
            // ==========================================

            sessionStorage.setItem(
                "demoPaymentStatus",
                "Paid"
            );


            // ==========================================
            // IMPORTANT:
            // ORDER DATABASE ME SAVE HONE KE BAAD
            // CART CLEAR
            // ==========================================

            clearCartAfterOrder();


            // ==========================================
            // HIDE PROCESSING
            // ==========================================

            if (processingOverlay) {

                processingOverlay.classList.remove(
                    "show"
                );
            }


            // ==========================================
            // ORDER ID
            // ==========================================

            const successOrderID =
                document.getElementById(
                    "successOrderID"
                );


            if (successOrderID) {

                successOrderID.innerText =
                    "#" +
                    result.order_id;
            }


            // ==========================================
            // SUCCESS AMOUNT
            // ==========================================

            if (successAmount) {

                successAmount.innerText =
                    "₹" +
                    Number(amount).toFixed(2);
            }


            // ==========================================
            // SHOW SUCCESS POPUP
            // ==========================================

            if (successOverlay) {

                successOverlay.classList.add(
                    "show"
                );
            }


            console.log(
                "ORDER SUCCESS:",
                result
            );

        } catch (error) {

            console.error(
                "ORDER ERROR:",
                error
            );


            if (processingOverlay) {

                processingOverlay.classList.remove(
                    "show"
                );
            }


            alert(
                "Payment completed, but order could not be saved.\n\n" +
                error.message
            );
        }
    }


    // ==================================================
    // CARD PAYMENT
    // ==================================================

    if (cardPayBtn) {

        cardPayBtn.addEventListener(
            "click",
            function () {

                if (!validateDemoCard()) {
                    return;
                }


                startDemoPayment();
            }
        );
    }


    // ==================================================
    // UPI PAYMENT
    // ==================================================

    if (upiPayBtn) {

        upiPayBtn.addEventListener(
            "click",
            function () {

                startDemoPayment();
            }
        );
    }


    // ==================================================
    // SUCCESS CONTINUE
    // PROFILE PAGE
    // ==================================================

    if (successContinueBtn) {

        successContinueBtn.addEventListener(
            "click",
            function () {

                // Safety: clear cart again
                clearCartAfterOrder();


                // Open Profile
                window.location.href =
                    "profile.html";
            }
        );
    }


    // ==================================================
    // BACK TO CHECKOUT
    // ==================================================

    window.goBackToCheckout =
        function () {

            window.location.href =
                "checkout.html";
        };


    // ==================================================
    // INITIALIZE
    // ==================================================

    updatePaymentAmount();

    loadCheckoutData();

});