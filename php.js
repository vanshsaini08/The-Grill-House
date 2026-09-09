// ================================
// Load Categories from Database
// ================================

fetch("api/get_categories.php")
.then(response => response.json())
.then(categories => {

    const menuScroll = document.getElementById("menuScroll");

    menuScroll.innerHTML = "";

    categories.forEach(category => {

        const image = category.image_name
            ? `images/${category.image_name}`
            : "images/no-image.png";

        menuScroll.innerHTML += `
            <div class="menu-item">
                <a href="menu.html?cat=${encodeURIComponent(category.category_name)}"
                   style="text-decoration:none;color:inherit;">

                    <img src="${image}" alt="${category.category_name}">
                    <span>${category.category_name}</span>

                </a>
            </div>
        `;

    });

})
.catch(error => {
    console.error("Category Load Error:", error);
});

// ==========================================
// SPECIAL OFFER TOGGLE
// ==========================================

function toggleSpecialMode() {

    const specialToggle =
        document.querySelector(".deal-toggle");

    if (!specialToggle) return;


    // Toggle Special Offer
    specialToggle.classList.toggle("switched");


    // Get current state
    const isDineIn =
        specialToggle.classList.contains("switched");


    // Save order type
    if (isDineIn) {

        sessionStorage.setItem(
            "orderType",
            "dinein"
        );

    } else {

        sessionStorage.setItem(
            "orderType",
            "takeaway"
        );

    }


    // ==========================================
    // ALSO UPDATE NAVBAR TOGGLE
    // ==========================================

    const navbarToggle =
        document.querySelector(
            ".navbar .toggle-container"
        );

    if (navbarToggle) {

        if (isDineIn) {

            navbarToggle.classList.add("switched");

        } else {

            navbarToggle.classList.remove("switched");

        }

    }

}

document.addEventListener("DOMContentLoaded", function () {

    const specialToggle =
        document.querySelector(".deal-toggle");

    if (!specialToggle) return;


    const orderType =
        sessionStorage.getItem("orderType");


    if (orderType === "dinein") {

        specialToggle.classList.add("switched");

    } else {

        specialToggle.classList.remove("switched");

    }

});








