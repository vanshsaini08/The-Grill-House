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