let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(item){

    const index = cart.findIndex(x => x.id == item.id);

    if(index >= 0){

        cart[index].qty += item.qty;

    }else{

        cart.push(item);

    }

    // Cart save AFTER update
    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
}

function renderCart(){

    const cartItems = document.getElementById("cartItems");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartHeader = document.getElementById("cartHeader");
    const cartCount = document.getElementById("cartCount");
    const subtotal = document.getElementById("cartSubtotal");

    cartItems.innerHTML = "";

    let total = 0;

   cart.forEach((item,index)=>{

        total += item.price * item.qty;

        cartItems.innerHTML += `

        <div class="cart-item">

            <div class="cart-left">

                <h3>${item.name}</h3>

                <p>Freshly Prepared</p>

            </div>

            <div class="cart-right">

                <div class="qty-box">

                  <button class="cart-minus" data-index="${index}">−</button>

<span>${item.qty}</span>

<button class="cart-plus" data-index="${index}">+</button>
                </div>

                <div class="item-price">

                    ₹${(item.price*item.qty).toFixed(2)}

                </div>

            </div>

        </div>

        `;

    });

    let totalItems = 0;

cart.forEach(item => {
    totalItems += item.qty;
});

cartCount.innerText = totalItems + " Items";
    subtotal.innerText = "₹" + total.toFixed(2);

    if(cart.length > 0){

        cartHeader.classList.add("show");
        cartSidebar.classList.add("show");

    }else{

        cartHeader.classList.remove("show");
        cartSidebar.classList.remove("show");

    }

    document.querySelectorAll(".cart-plus").forEach(btn=>{

    btn.onclick=function(){

        const index=this.dataset.index;

        cart[index].qty++;

        localStorage.setItem("cart",JSON.stringify(cart));

        renderCart();

    };

});

document.querySelectorAll(".cart-minus").forEach(btn=>{

    btn.onclick=function(){

        const index=this.dataset.index;

        cart[index].qty--;

        if(cart[index].qty<=0){

            cart.splice(index,1);

        }

        localStorage.setItem("cart",JSON.stringify(cart));

        renderCart();

    };

});
}

window.onload = async () => {

    await loadCategories();

    await fetchMenu();

    renderCart();   // <-- YE ADD KAR
}