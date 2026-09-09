// ======================================================
// SEARCH PAGE
// ======================================================

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchResultTitle = document.getElementById("searchResultTitle");
const clearBtn = document.getElementById("clearBtn");

let allMenuItems = [];


// ======================================================
// SEARCH POPUP VARIABLES
// ======================================================

let searchPopupId = null;
let searchPopupPrice = 0;
let searchPopupQty = 1;
let searchPopupGST = 0;
let searchPopupImg = "";


// ======================================================
// LOAD ALL MENU ITEMS
// ======================================================

async function loadAllMenuItems() {

    try {

        const categoryResponse =
            await fetch("api/get_categories.php");

        if (!categoryResponse.ok) {
            throw new Error("Categories API failed");
        }

        const categories =
            await categoryResponse.json();

        allMenuItems = [];

        for (const category of categories) {

            const response =
                await fetch(
                    "api/get_menu.php?cat=" +
                    encodeURIComponent(
                        category.category_name
                    )
                );

            if (!response.ok) {
                continue;
            }

            const items = await response.json();

            if (Array.isArray(items)) {

                allMenuItems.push(...items);

            }

        }

        console.log(
            "Total menu items:",
            allMenuItems.length
        );

    }

    catch (error) {

        console.error(
            "Menu loading error:",
            error
        );

    }

}


// ======================================================
// SEARCH
// ======================================================

function performSearch() {

    if (!searchInput || !searchResults) {
        return;
    }

    const searchText =
        searchInput.value.trim().toLowerCase();


    // ==================================================
    // CLEAR BUTTON
    // ==================================================

    if (clearBtn) {

        clearBtn.style.display =
            searchText.length > 0
                ? "flex"
                : "none";

    }


    // ==================================================
    // EMPTY SEARCH
    // ==================================================

    if (searchText === "") {

        searchResults.innerHTML = "";

        if (searchResultTitle) {
            searchResultTitle.innerText = "";
        }

        return;

    }


    // ==================================================
    // FIND MATCHING PRODUCTS
    // ==================================================

    const results =
        allMenuItems.filter(item => {

            const name =
                String(
                    item.item_name || ""
                ).toLowerCase();

            const category =
                String(
                    item.category || ""
                ).toLowerCase();

            const description =
                String(
                    item.description || ""
                ).toLowerCase();

            return (
                name.includes(searchText) ||
                category.includes(searchText) ||
                description.includes(searchText)
            );

        });


    // ==================================================
    // RESULT TITLE
    // ==================================================

    if (searchResultTitle) {

        searchResultTitle.innerText =
            results.length +
            (
                results.length === 1
                    ? " Item Found"
                    : " Items Found"
            );

    }


    // ==================================================
    // NO RESULT
    // ==================================================

    if (results.length === 0) {

        searchResults.innerHTML = `

            <div class="no-search-result">

                <h2>No items found</h2>

                <p>
                    Try searching for Pizza, Burger,
                    Fries, Cake or another item.
                </p>

            </div>

        `;

        return;

    }


    // ==================================================
    // DISPLAY PRODUCTS
    // ==================================================

    searchResults.innerHTML = "";


    results.forEach(item => {

        const id =
            item.id ?? "";

        const name =
            item.item_name ?? "";

        const price =
            Number(item.price || 0);

        const img =
            item.img ?? "";

        const gst =
            Number(item.gst_percent || 0);

        const description =
            item.description ||
            "Freshly prepared delicious food from The Grill House.";


        searchResults.innerHTML += `

            <div
                class="product-card"

                data-id="${escapeHTML(id)}"

                data-name="${escapeHTML(name)}"

                data-price="${price}"

                data-img="${escapeHTML(img)}"

                data-gst="${gst}"

                data-description="${escapeHTML(description)}"
            >

                <img
                    src="${escapeHTML(img)}"
                    class="product-img"
                    alt="${escapeHTML(name)}"
                >


                <div class="product-content">

                    <h3>
                        ${escapeHTML(name)}
                    </h3>


                    <div class="bottom-row">

                        <span class="price">

                            ₹${price.toFixed(2)}

                        </span>


                        <button
                            class="add-btn"

                            type="button"

                            data-id="${escapeHTML(id)}"

                            data-name="${escapeHTML(name)}"

                            data-price="${price}"

                            data-gst="${gst}"

                            data-img="${escapeHTML(img)}"
                        >

                            ADD +

                        </button>

                    </div>

                </div>

            </div>

        `;

    });


    bindSearchProducts();

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// SEARCH PRODUCT BUTTON
// ======================================================

function bindSearchProducts() {

    const buttons =
        document.querySelectorAll(
            "#searchResults .add-btn"
        );


    buttons.forEach(btn => {

        btn.addEventListener(
            "click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();


                const card =
                    this.closest(".product-card");


                if (!card) {
                    return;
                }


                // ======================================
                // GET PRODUCT DATA
                // ======================================

                searchPopupId =
                    card.dataset.id;

                searchPopupPrice =
                    Number(
                        card.dataset.price || 0
                    );

                searchPopupQty = 1;

                searchPopupGST =
                    Number(
                        card.dataset.gst || 0
                    );

                searchPopupImg =
                    card.dataset.img || "";


                // ======================================
                // POPUP IMAGE
                // ======================================

                const popupImage =
                    document.getElementById(
                        "popupImage"
                    );

                if (popupImage) {

                    popupImage.src =
                        searchPopupImg;

                }


                // ======================================
                // POPUP NAME
                // ======================================

                const popupTitle =
                    document.getElementById(
                        "popupTitle"
                    );

                if (popupTitle) {

                    popupTitle.innerText =
                        card.dataset.name || "";

                }


                // ======================================
                // POPUP DESCRIPTION
                // ======================================

                const popupDescription =
                    document.getElementById(
                        "popupDescription"
                    );

                if (popupDescription) {

                    popupDescription.innerText =
                        card.dataset.description ||
                        "Freshly prepared delicious food from The Grill House.";

                }


                // ======================================
                // POPUP QUANTITY
                // ======================================

                const qtyValue =
                    document.getElementById(
                        "qtyValue"
                    );

                if (qtyValue) {

                    qtyValue.innerText =
                        searchPopupQty;

                }


                // ======================================
                // POPUP PRICE
                // ======================================

                updateSearchPopupPrice();


                // ======================================
                // OPEN POPUP
                // ======================================

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

function updateSearchPopupPrice() {

    const popupPrice =
        document.getElementById(
            "popupPrice"
        );


    if (!popupPrice) {
        return;
    }


    const total =
        searchPopupPrice *
        searchPopupQty;


    popupPrice.innerText =
        "₹" +
        total.toFixed(2);

}


// ======================================================
// CLOSE POPUP
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const closeProduct =
            document.querySelector(
                ".close-product"
            );

        const productOverlay =
            document.getElementById(
                "productOverlay"
            );


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
// PLUS QUANTITY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const plusQty =
            document.getElementById(
                "plusQty"
            );


        if (!plusQty) {
            return;
        }


        plusQty.addEventListener(
            "click",
            function () {

                searchPopupQty++;


                const qtyValue =
                    document.getElementById(
                        "qtyValue"
                    );


                if (qtyValue) {

                    qtyValue.innerText =
                        searchPopupQty;

                }


                updateSearchPopupPrice();

            }
        );

    }
);


// ======================================================
// MINUS QUANTITY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const minusQty =
            document.getElementById(
                "minusQty"
            );


        if (!minusQty) {
            return;
        }


        minusQty.addEventListener(
            "click",
            function () {

                if (
                    searchPopupQty <= 1
                ) {

                    return;

                }


                searchPopupQty--;


                const qtyValue =
                    document.getElementById(
                        "qtyValue"
                    );


                if (qtyValue) {

                    qtyValue.innerText =
                        searchPopupQty;

                }


                updateSearchPopupPrice();

            }
        );

    }
);


// ======================================================
// ADD TO CART
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const popupAddCart =
            document.getElementById(
                "popupAddCart"
            );


        if (!popupAddCart) {
            return;
        }


        popupAddCart.addEventListener(
            "click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();


                // ======================================
                // VALIDATE PRODUCT
                // ======================================

                if (
                    searchPopupId === null ||
                    searchPopupId === ""
                ) {

                    console.error(
                        "Search product ID missing"
                    );

                    return;

                }


                if (
                    searchPopupPrice <= 0
                ) {

                    console.error(
                        "Search product price is invalid:",
                        searchPopupPrice
                    );

                    return;

                }


                // ======================================
                // CREATE CART ITEM
                // ======================================

                const item = {

                    id: searchPopupId,

                    name:
                        document.getElementById(
                            "popupTitle"
                        )?.innerText || "",

                    price:
                        Number(
                            searchPopupPrice
                        ),

                    qty:
                        Number(
                            searchPopupQty
                        ),

                    img:
                        searchPopupImg,

                    gst_percent:
                        Number(
                            searchPopupGST
                        )

                };


                console.log(
                    "SEARCH ADD TO CART:",
                    item
                );


                // ======================================
                // ADD TO CART
                // ======================================

                if (
                    typeof addToCart ===
                    "function"
                ) {

                    addToCart(item);

                } else {

                    console.error(
                        "addToCart() function not found"
                    );

                    return;

                }


                // ======================================
                // CLOSE POPUP
                // ======================================

                const overlay =
                    document.getElementById(
                        "productOverlay"
                    );


                if (overlay) {

                    overlay.classList.remove(
                        "show"
                    );

                }


                // ======================================
                // RESET POPUP
                // ======================================

                searchPopupId = null;
                searchPopupPrice = 0;
                searchPopupQty = 1;
                searchPopupGST = 0;
                searchPopupImg = "";

            }
        );

    }
);


// ======================================================
// POPULAR SEARCH
// ======================================================

function searchPopular(value) {

    if (!searchInput) {
        return;
    }

    searchInput.value =
        value;

    performSearch();

}


// ======================================================
// CLEAR SEARCH
// ======================================================

function clearSearch() {

    if (!searchInput) {
        return;
    }


    searchInput.value = "";


    if (searchResults) {

        searchResults.innerHTML = "";

    }


    if (searchResultTitle) {

        searchResultTitle.innerText = "";

    }


    if (clearBtn) {

        clearBtn.style.display =
            "none";

    }


    searchInput.focus();

}


// ======================================================
// SEARCH INPUT
// ======================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        performSearch
    );

}


// ======================================================
// START SEARCH PAGE
// ======================================================

window.addEventListener(
    "DOMContentLoaded",
    async function () {

        if (clearBtn) {

            clearBtn.style.display =
                "none";

        }

        await loadAllMenuItems();

    }
);