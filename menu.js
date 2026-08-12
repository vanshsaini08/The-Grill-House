
const container = document.getElementById("menuProducts");
let popupQty = 1;
let popupPrice = 0;
// ================= MENU =================

async function fetchMenu() {

    try {

        const params = new URLSearchParams(window.location.search);
        const category = params.get("cat") || "Pizza";

        const response = await fetch(
            "api/get_menu.php?cat=" + encodeURIComponent(category)
        );

        const data = await response.json();

        const title = document.querySelector(".category-title");

        if (title) {

            title.innerText = category.toUpperCase();

        }

        container.innerHTML = "";

        if (data.length === 0) {

            container.innerHTML = `
                <h2 style="text-align:center;padding:40px;">
                    No Items Found
                </h2>
            `;

            return;

        }

        data.forEach(item => {

            container.innerHTML += `

            <div class="product-card"

                data-id="${item.id}"
                data-name="${item.item_name}"
                data-price="${item.price}"
                data-img="${item.img}"
                data-description="${item.description || 'Freshly prepared delicious food from The Grill House.'}"

            >

                <img src="${item.img}"
                     class="product-img"
                     alt="${item.item_name}">

                <div class="product-content">

                    <h3>${item.item_name}</h3>

                    <div class="bottom-row">

                        <span class="price">

                            ₹${parseFloat(item.price).toFixed(2)}

                        </span>

                        <button

                            class="add-btn"

                            data-id="${item.id}"
                            data-name="${item.item_name}"
                            data-price="${item.price}"
                            data-gst="${item.gst_percent}"
                            data-img="${item.img}">

                            ADD +

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

        bindProductCards();

    }


    catch(err){

        console.log(err);

    }

}

// ================= PRODUCT POPUP =================

function bindProductCards(){

    document.querySelectorAll(".add-btn").forEach(btn=>{

        btn.addEventListener("click",function(e){

            e.preventDefault();
            e.stopPropagation();

            const card = this.closest(".product-card");

            // Product Details
            document.getElementById("popupImage").src = card.dataset.img;

            document.getElementById("popupTitle").innerText = card.dataset.name;

            document.getElementById("popupDescription").innerText =
            card.dataset.description;

            // Price
            popupPrice = Number(card.dataset.price);

            // Quantity Reset
            popupQty = 1;

            document.getElementById("qtyValue").innerText = popupQty;

            // Total Price
            document.getElementById("popupPrice").innerText =
            "₹" + (popupPrice * popupQty).toFixed(2);

            // Open Popup
            document.getElementById("productOverlay")
            .classList.add("show");

        });

    });

}
// Close Popup

document.querySelector(".close-product").onclick=function(){

    document
    .getElementById("productOverlay")
    .classList.remove("show");

}

document.getElementById("productOverlay").onclick=function(e){

    if(e.target.id==="productOverlay"){

        this.classList.remove("show");

    }

}

// ================= CART =================


// ================= CATEGORIES =================

async function loadCategories(){

    const response = await fetch("api/get_categories.php");

    const categories = await response.json();

    const menuScroll = document.getElementById("menuScroll");

    menuScroll.innerHTML="";

    const params=new URLSearchParams(window.location.search);

    const currentCat=params.get("cat");

    categories.forEach(category=>{

        const image=category.image_name
        ?`images/${category.image_name}`
        :"images/no-image.png";

        menuScroll.innerHTML+=`

        <div class="menu-item ${currentCat===category.category_name?"active":""}">

            <a href="menu.html?cat=${encodeURIComponent(category.category_name)}">

                <img src="${image}">

                <span>${category.category_name}</span>

            </a>

        </div>

        `;

    });

}



// ================= QUANTITY =================

document.getElementById("plusQty").onclick = function(){

    popupQty++;

    document.getElementById("qtyValue").innerText = popupQty;

    document.getElementById("popupPrice").innerText =
    "₹" + (popupPrice * popupQty).toFixed(2);

};

document.getElementById("minusQty").onclick = function(){

    if(popupQty > 1){

        popupQty--;

        document.getElementById("qtyValue").innerText = popupQty;

        document.getElementById("popupPrice").innerText =
        "₹" + (popupPrice * popupQty).toFixed(2);

    }

};
// ================= LOAD =================

window.onload=async()=>{

    await loadCategories();

    await fetchMenu();

}



document.getElementById("popupAddCart").onclick = function () {

    const item = {

        id: document.getElementById("popupTitle").innerText,

        name: document.getElementById("popupTitle").innerText,

        price: popupPrice,

        qty: popupQty,

        img: document.getElementById("popupImage").src

    };

    // ================= ADD DIRECTLY TO CART =================

    addToCart(item);

    // ================= CLOSE PRODUCT POPUP =================

    document
        .getElementById("productOverlay")
        .classList.remove("show");

    // ================= OPEN CART =================

    const cartSidebar = document.getElementById("cartSidebar");

    if (cartSidebar) {

        cartSidebar.classList.add("open");

    }

};