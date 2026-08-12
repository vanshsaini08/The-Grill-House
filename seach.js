// ======================================================
// SEARCH PAGE
// ======================================================

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchResultTitle = document.getElementById("searchResultTitle");
const clearBtn = document.getElementById("clearBtn");

let allMenuItems = [];


// ======================================================
// LOAD ALL MENU ITEMS
// ======================================================

async function loadAllMenuItems() {

    try {

        // Get all categories
        const categoryResponse =
            await fetch("api/get_categories.php");

        const categories =
            await categoryResponse.json();

        allMenuItems = [];

        // Get items from every category
        for (const category of categories) {

            const response = await fetch(
                "api/get_menu.php?cat=" +
                encodeURIComponent(category.category_name)
            );

            const items = await response.json();

            if (Array.isArray(items)) {

                allMenuItems.push(...items);

            }

        }

        console.log("Total menu items:", allMenuItems.length);

    }

    catch (error) {

        console.error("Menu loading error:", error);

    }

}


// ======================================================
// SEARCH
// ======================================================

function performSearch() {

    const searchText =
        searchInput.value.trim().toLowerCase();

    // Clear button show/hide
    if (clearBtn) {

        clearBtn.style.display =
            searchText.length > 0
                ? "block"
                : "none";

    }


    // Empty search
    if (searchText === "") {

        searchResults.innerHTML = "";

        searchResultTitle.innerText = "";

        return;

    }


    // Find matching products
    const results = allMenuItems.filter(item => {

        const name =
            (item.item_name || "").toLowerCase();

        const category =
            (item.category || "").toLowerCase();

        const description =
            (item.description || "").toLowerCase();

        return (
            name.includes(searchText) ||
            category.includes(searchText) ||
            description.includes(searchText)
        );

    });


    // Heading
    searchResultTitle.innerText =
        results.length +
        (results.length === 1
            ? " Item Found"
            : " Items Found");


    // No result
    if (results.length === 0) {

        searchResults.innerHTML = `

            <div class="no-search-result">

                <h2>No items found</h2>

                <p>
                    Try searching for Pizza, Burger, Fries,
                    Cake or another item.
                </p>

            </div>

        `;

        return;

    }


    // Display products
    searchResults.innerHTML = "";


    results.forEach(item => {

        searchResults.innerHTML += `

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

                            ₹${parseFloat(item.price).toFixed(2)}

                        </span>


                        <button
                            class="add-btn"

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


    bindSearchProducts();

}


// ======================================================
// PRODUCT POPUP
// ======================================================

function bindSearchProducts() {

    document
        .querySelectorAll("#searchResults .add-btn")
        .forEach(btn => {

            btn.addEventListener("click", function(e) {

                e.preventDefault();
                e.stopPropagation();

                const card =
                    this.closest(".product-card");


                // Product image
                document.getElementById(
                    "popupImage"
                ).src = card.dataset.img;


                // Product name
                document.getElementById(
                    "popupTitle"
                ).innerText = card.dataset.name;


                // Description
                document.getElementById(
                    "popupDescription"
                ).innerText =
                    card.dataset.description;


                // Price
                window.searchPopupPrice =
                    Number(card.dataset.price);

                window.searchPopupQty = 1;


                document.getElementById(
                    "qtyValue"
                ).innerText = 1;


                document.getElementById(
                    "popupPrice"
                ).innerText =
                    "₹" +
                    window.searchPopupPrice.toFixed(2);


                // Open popup
                document
                    .getElementById("productOverlay")
                    .classList.add("show");

            });

        });

}


// ======================================================
// POPULAR SEARCH
// ======================================================

function searchPopular(value) {

    searchInput.value = value;

    performSearch();

}


// ======================================================
// CLEAR SEARCH
// ======================================================

function clearSearch() {

    searchInput.value = "";

    searchResults.innerHTML = "";

    searchResultTitle.innerText = "";

    clearBtn.style.display = "none";

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
// START
// ======================================================

window.addEventListener(
    "DOMContentLoaded",
    async function() {

        clearBtn.style.display = "none";

        await loadAllMenuItems();

    }
);