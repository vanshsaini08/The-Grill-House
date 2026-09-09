// ==========================================
// CART SYSTEM - FINAL FIX
// ==========================================

let cart = [];


// ==========================================
// LOAD CART SAFELY
// ==========================================

function loadCart() {

    try {

        const savedCart = localStorage.getItem("cart");

        if (savedCart) {

            const parsedCart = JSON.parse(savedCart);

            if (Array.isArray(parsedCart)) {

                cart = parsedCart
                    .filter(item => item && item.id != null)
                    .map(item => ({

                        id: String(item.id),

                        name: String(
                            item.name || "Unknown Item"
                        ),

                        price: Number(item.price) || 0,

                        qty:
                            Number(item.qty) > 0
                                ? Number(item.qty)
                                : 1,

                        img: item.img || "",

                        gst_percent:
                            Number(item.gst_percent) || 0

                    }));

            }

        }

    }
    catch (error) {

        console.error(
            "Cart load error:",
            error
        );

        cart = [];

    }

}


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(item) {

    if (!item) {

        console.error(
            "Invalid cart item"
        );

        return;

    }


    // ======================================
    // NORMALIZE DATA
    // ======================================

    const itemId =
        item.id != null
            ? String(item.id)
            : "";


    const itemName =
        String(item.name || "").trim();


    const itemPrice =
        Number(item.price);


    const itemQty =
        Number(item.qty);


    const itemGST =
        Number(item.gst_percent) || 0;


    // ======================================
    // VALIDATION
    // ======================================

    if (itemId === "") {

        console.error(
            "Cart Error: Item ID missing",
            item
        );

        return;

    }


    if (itemName === "") {

        console.error(
            "Cart Error: Item name missing",
            item
        );

        return;

    }


    // ======================================
    // ZERO / INVALID PRICE
    // ======================================

    if (
        !Number.isFinite(itemPrice) ||
        itemPrice <= 0
    ) {

        console.error(
            "Cart Error: Invalid price",
            item
        );

        return;

    }


    const qty =
        Number.isFinite(itemQty) &&
        itemQty > 0
            ? itemQty
            : 1;


    // ======================================
    // FIND EXISTING ITEM
    // ======================================

    const existingIndex =
        cart.findIndex(function (cartItem) {

            return (
                String(cartItem.id) === itemId
            );

        });


    // ======================================
    // EXISTING ITEM
    // ======================================

    if (existingIndex !== -1) {

        cart[existingIndex].qty =
            Number(
                cart[existingIndex].qty
            ) + qty;


        // Fix old invalid price

        if (
            !Number.isFinite(
                Number(
                    cart[existingIndex].price
                )
            ) ||
            Number(
                cart[existingIndex].price
            ) <= 0
        ) {

            cart[existingIndex].price =
                itemPrice;

        }


        // Missing name

        if (!cart[existingIndex].name) {

            cart[existingIndex].name =
                itemName;

        }


        // Missing image

        if (!cart[existingIndex].img) {

            cart[existingIndex].img =
                item.img || "";

        }


        cart[existingIndex].gst_percent =
            itemGST;

    }


    // ======================================
    // NEW ITEM
    // ======================================

    else {

        cart.push({

            id: itemId,

            name: itemName,

            price: itemPrice,

            qty: qty,

            img: item.img || "",

            gst_percent: itemGST

        });

    }


    // ======================================
    // REMOVE INVALID ITEMS
    // ======================================

    cart =
        cart.filter(function (cartItem) {

            return (
                cartItem &&
                cartItem.id &&
                Number(cartItem.price) > 0 &&
                Number(cartItem.qty) > 0
            );

        });


    // ======================================
    // SAVE + RENDER
    // ======================================

    saveCart();

    renderCart();

}


// ==========================================
// RENDER CART
// ==========================================

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const cartSidebar =
        document.getElementById(
            "cartSidebar"
        );


    const cartHeader =
        document.getElementById(
            "cartHeader"
        );


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    const subtotal =
        document.getElementById(
            "cartSubtotal"
        );


    // ======================================
    // REMOVE INVALID ITEMS
    // ======================================

    cart =
        cart.filter(function (item) {

            return (
                item &&
                item.id &&
                Number(item.price) > 0 &&
                Number(item.qty) > 0
            );

        });


    // ======================================
    // CALCULATE TOTAL
    // ======================================

    let totalItems = 0;

    let totalAmount = 0;


    cart.forEach(function (item) {

        const qty =
            Number(item.qty) || 0;


        const price =
            Number(item.price) || 0;


        totalItems += qty;


        totalAmount +=
            price * qty;

    });


    // ======================================
    // NAVBAR CART COUNT
    // ======================================

    const navCartCount =
        document.getElementById(
            "navCartCount"
        );


    if (navCartCount) {

        navCartCount.innerText =
            totalItems;


        navCartCount.style.display =
            totalItems > 0
                ? "flex"
                : "none";

    }


    // ======================================
    // CART SIDEBAR DOES NOT EXIST
    // ======================================

    if (!cartItems) {

        return;

    }


    // ======================================
    // CLEAR CART HTML
    // ======================================

    cartItems.innerHTML = "";


    // ======================================
    // EMPTY CART
    // ======================================

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some delicious items!
                </p>

            </div>

        `;

    }


    // ======================================
    // CART ITEMS
    // ======================================

    cart.forEach(
        function (item, index) {

            const price =
                Number(item.price) || 0;


            const qty =
                Number(item.qty) || 1;


            const itemTotal =
                price * qty;


            cartItems.innerHTML += `

                <div class="cart-item">

                    <div class="cart-left">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            Freshly Prepared
                        </p>

                    </div>


                    <div class="cart-right">

                        <div class="qty-box">

                            <button
                                type="button"
                                class="cart-minus"
                                data-index="${index}">
                                −
                            </button>


                            <span>
                                ${qty}
                            </span>


                            <button
                                type="button"
                                class="cart-plus"
                                data-index="${index}">
                                +
                            </button>

                        </div>


                        <div class="item-price">

                            ₹${itemTotal.toFixed(2)}

                        </div>

                    </div>

                </div>

            `;

        }
    );


    // ======================================
    // CART COUNT
    // ======================================

    if (cartCount) {

        cartCount.innerText =
            totalItems + " Items";

    }


    // ======================================
    // SUBTOTAL
    // ======================================

    if (subtotal) {

        subtotal.innerText =
            "₹" +
            totalAmount.toFixed(2);

    }


    // ======================================
    // SHOW / HIDE CART
    // ======================================

    if (cart.length > 0) {

        if (cartHeader) {

            cartHeader.classList.add(
                "show"
            );

        }


        if (cartSidebar) {

            cartSidebar.classList.add(
                "show"
            );

        }

    }

    else {

        if (cartHeader) {

            cartHeader.classList.remove(
                "show"
            );

        }


        if (cartSidebar) {

            cartSidebar.classList.remove(
                "show"
            );

        }

    }


    // ======================================
    // PLUS BUTTON
    // ======================================

    document
        .querySelectorAll(".cart-plus")
        .forEach(function (button) {

            button.onclick =
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    if (!cart[index]) {

                        return;

                    }


                    cart[index].qty =
                        Number(
                            cart[index].qty
                        ) + 1;


                    saveCart();

                    renderCart();

                };

        });


    // ======================================
    // MINUS BUTTON
    // ======================================

    document
        .querySelectorAll(".cart-minus")
        .forEach(function (button) {

            button.onclick =
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


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


                    saveCart();

                    renderCart();

                };

        });

}


// ==========================================
// NAVBAR CART CLICK
// ==========================================
// ==========================================
// NAVBAR CART CLICK
// ==========================================

document.addEventListener("click", function (e) {

    const cartButton = e.target.closest(".cart-nav");

    if (!cartButton) {
        return;
    }

    // ======================================
    // CHECK CURRENT CART
    // ======================================

    // localStorage se latest cart read karo
    let currentCart = [];

    try {

        const savedCart =
            localStorage.getItem("cart");

        if (savedCart) {

            const parsedCart =
                JSON.parse(savedCart);

            if (Array.isArray(parsedCart)) {

                currentCart = parsedCart.filter(function (item) {

                    return (
                        item &&
                        item.id != null &&
                        Number(item.price) > 0 &&
                        Number(item.qty) > 0
                    );

                });

            }

        }

    }
    catch (error) {

        console.error(
            "Navbar cart check error:",
            error
        );

        currentCart = [];

    }


    // ======================================
    // EMPTY CART
    // ======================================

    if (currentCart.length === 0) {

        alert("No items are added");

        return;

    }


    // ======================================
    // CART HAS ITEMS
    // ======================================

    window.location.href = "checkout.html";

});