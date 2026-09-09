// ======================================================
// MENU PAGE JS
// ======================================================


// ======================================================
// GLOBAL VARIABLES
// ======================================================

const container = document.getElementById("menuProducts");

let popupQty = 1;
let popupPrice = 0;
let popupProductId = null;
let popupGST = 0;


// ======================================================
// FETCH MENU
// ======================================================

async function fetchMenu() {

    try {

        const params =
            new URLSearchParams(window.location.search);

        const category =
            params.get("cat") || "Pizza";


        const response = await fetch(
            "api/get_menu.php?cat=" +
            encodeURIComponent(category)
        );


        const data =
            await response.json();


        const title =
            document.querySelector(".category-title");


        if (title) {

            title.innerText =
                category.toUpperCase();

        }


        if (!container) return;


        container.innerHTML = "";


        if (!Array.isArray(data) || data.length === 0) {

            container.innerHTML = `
                <h2 style="
                    text-align:center;
                    padding:40px;
                    width:100%;
                ">
                    No Items Found
                </h2>
            `;

            return;

        }


        data.forEach(item => {

            container.innerHTML += `

                <div
                    class="product-card"

                    data-id="${item.id}"

                    data-name="${item.item_name}"

                    data-price="${item.price}"

                    data-img="${item.img}"

                    data-gst="${item.gst_percent || 0}"

                    data-description="${
                        item.description ||
                        "Freshly prepared delicious food from The Grill House."
                    }"
                >

                    <img
                        src="${item.img}"
                        class="product-img"
                        alt="${item.item_name}"
                    >


                    <div class="product-content">

                        <h3>
                            ${item.item_name}
                        </h3>


                        <div class="bottom-row">

                            <span class="price">
                                ₹${Number(item.price).toFixed(2)}
                            </span>


                            <button
                                class="add-btn"

                                type="button"

                                data-id="${item.id}"

                                data-name="${item.item_name}"

                                data-price="${item.price}"

                                data-gst="${item.gst_percent || 0}"

                                data-img="${item.img}"
                            >
                                ADD +
                            </button>

                        </div>

                    </div>

                </div>

            `;

        });


        bindProductCards();

    }

    catch (error) {

        console.error(
            "Menu loading error:",
            error
        );

    }

}


// ======================================================
// PRODUCT POPUP
// ======================================================

function bindProductCards() {

    document
        .querySelectorAll("#menuProducts .add-btn")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();
                    e.stopPropagation();


                    const card =
                        this.closest(".product-card");


                    if (!card) return;


                    // SAVE PRODUCT DATA

                    popupProductId =
                        card.dataset.id;

                    popupPrice =
                        Number(card.dataset.price || 0);

                    popupGST =
                        Number(card.dataset.gst || 0);


                    // PRODUCT IMAGE

                    const popupImage =
                        document.getElementById("popupImage");

                    if (popupImage) {

                        popupImage.src =
                            card.dataset.img;

                    }


                    // PRODUCT NAME

                    const popupTitle =
                        document.getElementById("popupTitle");

                    if (popupTitle) {

                        popupTitle.innerText =
                            card.dataset.name;

                    }


                    // DESCRIPTION

                    const popupDescription =
                        document.getElementById(
                            "popupDescription"
                        );

                    if (popupDescription) {

                        popupDescription.innerText =
                            card.dataset.description;

                    }


                    // RESET QUANTITY

                    popupQty = 1;


                    const qtyValue =
                        document.getElementById("qtyValue");

                    if (qtyValue) {

                        qtyValue.innerText =
                            popupQty;

                    }


                    // PRICE

                    updatePopupPrice();


                    // OPEN POPUP

                    const overlay =
                        document.getElementById(
                            "productOverlay"
                        );

                    if (overlay) {

                        overlay.classList.add("show");

                    }

                }
            );

        });

}


// ======================================================
// UPDATE POPUP PRICE
// ======================================================

function updatePopupPrice() {

    const popupPriceElement =
        document.getElementById("popupPrice");


    if (!popupPriceElement) return;


    const total =
        popupPrice * popupQty;


    popupPriceElement.innerText =
        "₹" + total.toFixed(2);

}


// ======================================================
// CLOSE PRODUCT POPUP
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const closeProduct =
            document.querySelector(".close-product");


        const productOverlay =
            document.getElementById("productOverlay");


        if (closeProduct) {

            closeProduct.addEventListener(
                "click",
                function () {

                    if (productOverlay) {

                        productOverlay.classList.remove(
                            "show"
                        );

                    }

                }
            );

        }


        if (productOverlay) {

            productOverlay.addEventListener(
                "click",
                function (e) {

                    if (
                        e.target === productOverlay
                    ) {

                        productOverlay.classList.remove(
                            "show"
                        );

                    }

                }
            );

        }

    }
);


// ======================================================
// QUANTITY PLUS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const plusQty =
            document.getElementById("plusQty");


        if (plusQty) {

            plusQty.addEventListener(
                "click",
                function () {

                    popupQty++;


                    const qtyValue =
                        document.getElementById(
                            "qtyValue"
                        );


                    if (qtyValue) {

                        qtyValue.innerText =
                            popupQty;

                    }


                    updatePopupPrice();

                }
            );

        }

    }
);


// ======================================================
// QUANTITY MINUS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const minusQty =
            document.getElementById("minusQty");


        if (minusQty) {

            minusQty.addEventListener(
                "click",
                function () {

                    if (popupQty <= 1) return;


                    popupQty--;


                    const qtyValue =
                        document.getElementById(
                            "qtyValue"
                        );


                    if (qtyValue) {

                        qtyValue.innerText =
                            popupQty;

                    }


                    updatePopupPrice();

                }
            );

        }

    }
);


// ======================================================
// ADD TO CART
// ======================================================

// ======================================================
// ADD TO CART
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const popupAddCart =
            document.getElementById("popupAddCart");

        if (!popupAddCart) return;


        popupAddCart.addEventListener(
            "click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();


                const popupTitle =
                    document.getElementById("popupTitle");

                const popupImage =
                    document.getElementById("popupImage");


                if (!popupTitle) return;


                // ==================================
                // CREATE CART ITEM
                // ==================================

                const item = {

                    id: popupProductId,

                    name: popupTitle.innerText,

                    price: popupPrice,

                    qty: popupQty,

                    img: popupImage
                        ? popupImage.src
                        : "",

                    gst_percent: popupGST

                };


                // ==================================
                // ADD TO CART
                // ==================================

                if (typeof addToCart === "function") {

                    addToCart(item);

                } else {

                    console.error(
                        "addToCart() function not found"
                    );

                    return;

                }


                // ==================================
                // CLOSE PRODUCT POPUP
                // ==================================

                const productOverlay =
                    document.getElementById(
                        "productOverlay"
                    );

                if (productOverlay) {

                    productOverlay.classList.remove(
                        "show"
                    );

                }


                // ==================================
                // IMPORTANT
                // ==================================
                // CART YAHAN OPEN NAHI HOGA.
                //
                // cartSidebar.classList.add("show")
                // NAHI
                //
                // cartHeader.classList.add("show")
                // NAHI
                //
                // renderCart() bhi yahan manually nahi.
                //
                // ==================================

            }
        );

    }
);


// ======================================================
// CATEGORIES
// ======================================================

async function loadCategories() {

    try {

        const response =
            await fetch(
                "api/get_categories.php"
            );


        const categories =
            await response.json();


        const menuScroll =
            document.getElementById(
                "menuScroll"
            );


        if (!menuScroll) return;


        menuScroll.innerHTML = "";


        const params =
            new URLSearchParams(
                window.location.search
            );


        const currentCat =
            params.get("cat");


        categories.forEach(category => {

            const image =
                category.image_name
                    ? `images/${category.image_name}`
                    : "images/no-image.png";


            menuScroll.innerHTML += `

                <div
                    class="menu-item ${
                        currentCat ===
                        category.category_name
                            ? "active"
                            : ""
                    }"
                >

                    <a
                        href="menu.html?cat=${
                            encodeURIComponent(
                                category.category_name
                            )
                        }"
                    >

                        <img
                            src="${image}"
                            alt="${category.category_name}"
                        >

                        <span>
                            ${category.category_name}
                        </span>

                    </a>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(
            "Category loading error:",
            error
        );

    }

}


// ======================================================
// MENU SCROLL
// ======================================================

function scrollMenu(direction) {

    const menuScroll =
        document.getElementById(
            "menuScroll"
        );


    if (!menuScroll) return;


    const amount =
        menuScroll.offsetWidth / 1.5;


    if (direction === "left") {

        menuScroll.scrollBy({

            left: -amount,

            behavior: "smooth"

        });

    }
    else {

        menuScroll.scrollBy({

            left: amount,

            behavior: "smooth"

        });

    }

}


// ======================================================
// LOAD PAGE
// ======================================================

window.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadCategories();

        await fetchMenu();


        // CART UPDATE

        if (
            typeof renderCart ===
            "function"
        ) {

            renderCart();

        }

    }
);