document.addEventListener('DOMContentLoaded', function () {

    // ======================================================
    // LOCAL STORAGE HELPERS
    // ======================================================

    const get = (key, fallback = []) => {

        try {

            const value =
                localStorage.getItem(key);

            if (!value) {
                return fallback;
            }

            return JSON.parse(value) || fallback;

        }
        catch (e) {

            return fallback;

        }

    };


    const set = (key, value) => {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    };


    // ======================================================
    // LOGIN CHECK
    // ======================================================

    if (
        localStorage.getItem("isLoggedIn") !== "true"
    ) {

        window.location.href =
            "index.html";

        return;

    }


    // ======================================================
    // CUSTOMER DETAILS
    // ======================================================

    const name =
        localStorage.getItem("customerName") ||
        "Guest User";


    const phone =
        localStorage.getItem("customerPhone") ||
        "Not available";


    const profileName =
        document.getElementById("profileName");


    const profilePhone =
        document.getElementById("profilePhone");


    const profileAvatar =
        document.getElementById("profileAvatar");


    if (profileName) {

        profileName.textContent =
            name;

    }


    if (profilePhone) {

        profilePhone.textContent =
            "+91 " + phone;

    }


    if (profileAvatar) {

        profileAvatar.textContent =
            name
                .split(" ")
                .map(x => x[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

    }


    // ======================================================
    // DATA
    // ======================================================

    const content =
        document.getElementById(
            "profileContent"
        );


    const orders =
        () => get(
            "grillHouseOrders"
        );


    const fav =
        () => get(
            "grillHouseFavourites"
        );


    const notes =
        () => get(
            "grillHouseNotifications"
        );


    const cart =
        () => get(
            "grillHouseCart"
        );


    // ======================================================
    // COINS
    // ======================================================

    const coinCount =
        document.getElementById(
            "coinCount"
        );


    if (coinCount) {

        coinCount.textContent =
            250 + (
                orders().length * 50
            );

    }


    // ======================================================
    // EMPTY STATE
    // ======================================================

    const empty = (
        icon,
        title,
        text,
        action = ""
    ) => `

        <div class="profile-empty">

            <i class="${icon}"></i>

            <h3>
                ${title}
            </h3>

            <p>
                ${text}
            </p>

            ${action}

        </div>

    `;


    // ======================================================
    // RENDER PROFILE SECTION
    // ======================================================

    function render(section) {


        // ==================================================
        // ORDERS
        // ==================================================

        if (section === "orders") {

            const list =
                orders();


            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        Recent Orders
                    </h1>

                    <p class="profile-sub">
                        Your Grill House orders will always be here.
                    </p>

                    ${
                        list.length
                            ? list.map(o => `

                                <article class="order-card">

                                    <div class="order-top">

                                        <h4>
                                            ${o.id}
                                        </h4>

                                        <span class="order-status">
                                            ${o.status || "Order placed"}
                                        </span>

                                    </div>

                                    <p>
                                        ${o.date} ·
                                        ${o.items.reduce(
                                            (n, x) => n + x.qty,
                                            0
                                        )}
                                        item(s)
                                    </p>

                                    <b>
                                        ₹${o.total}
                                    </b>

                                    <button
                                        class="profile-link-btn"
                                        data-reorder="${o.id}"
                                        style="float:right"
                                    >
                                        Reorder
                                    </button>

                                </article>

                            `).join("")

                            : empty(
                                "fa-solid fa-bag-shopping",
                                "No orders yet",
                                "Your next Grill House favourite is waiting.",
                                `
                                    <a href="menu.html">
                                        <button class="profile-primary">
                                            ORDER NOW
                                        </button>
                                    </a>
                                `
                            )
                    }

                </div>

            `;

        }


        // ==================================================
        // ADDRESSES
        // ==================================================

        if (section === "addresses") {

            const a =
                get("grillHouseAddresses");


            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        Saved Addresses
                    </h1>

                    <p class="profile-sub">
                        Save delivery details to checkout faster.
                    </p>

                    <button
                        class="profile-primary"
                        id="showAddressForm"
                    >
                        + ADD ADDRESS
                    </button>

                    <div id="addressFormWrap"></div>

                    <div id="addressList">

                        ${
                            a.length
                                ? a.map((x, i) => `

                                    <article class="address-card">

                                        <div class="address-actions">

                                            <h4>
                                                ${x.label}
                                            </h4>

                                            <span>

                                                <button
                                                    class="profile-link-btn"
                                                    data-edit-address="${i}"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    class="profile-link-btn"
                                                    data-delete-address="${i}"
                                                >
                                                    Delete
                                                </button>

                                            </span>

                                        </div>

                                        <p>
                                            ${x.text}
                                        </p>

                                    </article>

                                `).join("")

                                : empty(
                                    "fa-solid fa-location-dot",
                                    "No saved addresses",
                                    "Add an address and checkout will feel even easier."
                                )
                        }

                    </div>

                </div>

            `;


            const showAddressForm =
                document.getElementById(
                    "showAddressForm"
                );


            if (showAddressForm) {

                showAddressForm.onclick =
                    () => showAddress();

            }

        }


        // ==================================================
        // FAVOURITES
        // ==================================================

        if (section === "favourites") {

            const f =
                fav();


            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        Favourite Items
                    </h1>

                    <p class="profile-sub">
                        The dishes you never want to forget.
                    </p>

                    ${
                        f.length
                            ? `

                                <div class="favourite-grid">

                                    ${f.map((x, i) => `

                                        <article class="fav-card">

                                            <img
                                                src="${
                                                    x.image ||
                                                    "images/logo 1.png"
                                                }"
                                                alt=""
                                            >

                                            <div>

                                                <h4>
                                                    ${x.name}
                                                </h4>

                                                <p>
                                                    ₹${x.price}
                                                </p>

                                                <button
                                                    class="profile-link-btn"
                                                    data-fav-cart="${i}"
                                                >
                                                    Add to Cart
                                                </button>

                                                <button
                                                    class="profile-link-btn"
                                                    data-fav-remove="${i}"
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </article>

                                    `).join("")}

                                </div>

                            `

                            : empty(
                                "fa-solid fa-heart",
                                "No favourites yet",
                                "Tap the heart on a menu item to save it here."
                            )
                    }

                </div>

            `;

        }


        // ==================================================
        // DEALS
        // ==================================================

        if (section === "deals") {

            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        Saved Deals
                    </h1>

                    <p class="profile-sub">
                        Exclusive Grill House treats, ready when you are.
                    </p>

                    <article class="deal-card">

                        <h4>
                            GRILL20 · 20% OFF
                        </h4>

                        <p>
                            Save 20% on orders over ₹499.
                            Apply at checkout.
                        </p>

                    </article>

                    <article class="deal-card">

                        <h4>
                            WELCOME100 · ₹100 OFF
                        </h4>

                        <p>
                            A warm welcome for your first
                            Grill House order.
                        </p>

                    </article>

                </div>

            `;

        }


        // ==================================================
        // NOTIFICATIONS
        // ==================================================

        if (section === "notifications") {

            const n =
                notes();


            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        Notifications
                    </h1>

                    <p class="profile-sub">
                        Order updates and Grill House news.
                    </p>

                    ${
                        n.length
                            ? n.map(x => `

                                <article class="notice-card">

                                    <b>
                                        ${x.title}
                                    </b>

                                    <p>
                                        ${x.text}
                                    </p>

                                    <small>
                                        ${x.date || ""}
                                    </small>

                                </article>

                            `).join("")

                            : empty(
                                "fa-solid fa-bell",
                                "You are all caught up",
                                "We’ll let you know when there is something worth tasting."
                            )
                    }

                </div>

            `;

        }


        // ==================================================
        // SUPPORT
        // ==================================================

        if (section === "support") {

            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        Help & Support
                    </h1>

                    <p class="profile-sub">
                        We are here to make every order easy.
                    </p>

                    <article class="notice-card">

                        <b>
                            Need help with an order?
                        </b>

                        <p>
                            Call us at +91 98765 43210
                            between 11:00 AM and 10:30 PM.
                        </p>

                    </article>

                    <article class="notice-card">

                        <b>
                            Have feedback?
                        </b>

                        <p>
                            We love hearing how we can make
                            your next visit better.
                        </p>

                    </article>

                </div>

            `;

        }


        // ==================================================
        // ABOUT
        // ==================================================

        if (section === "about") {

            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        About Grill House
                    </h1>

                    <p class="profile-sub">
                        Food made with warmth, flavour,
                        and a touch of fire.
                    </p>

                    <article class="notice-card">

                        <b>
                            Our Promise
                        </b>

                        <p>
                            Thoughtfully prepared food,
                            welcoming service, and dishes
                            made for sharing.
                        </p>

                    </article>

                </div>

            `;

        }


        // ==================================================
        // SETTINGS
        // ==================================================

        if (section === "settings") {

            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        Settings
                    </h1>

                    <p class="profile-sub">
                        Manage your Grill House preferences.
                    </p>

                    <div class="settings-row">

                        <span>
                            Order updates
                        </span>

                        <span class="profile-toggle"></span>

                    </div>

                    <div class="settings-row">

                        <span>
                            Offers and rewards
                        </span>

                        <span class="profile-toggle"></span>

                    </div>

                    <div class="settings-row">

                        <span>
                            Account details are saved securely
                            in this browser
                        </span>

                    </div>

                </div>

            `;

        }


        bindDynamic();

    }


    // ======================================================
    // ADDRESS FORM
    // ======================================================

    function showAddress(i) {

        const a =
            get("grillHouseAddresses");


        const x =
            i == null
                ? {}
                : a[i];


        const addressFormWrap =
            document.getElementById(
                "addressFormWrap"
            );


        if (!addressFormWrap) {
            return;
        }


        addressFormWrap.innerHTML = `

            <form
                class="address-form"
                id="addressForm"
            >

                <input
                    name="label"
                    required
                    placeholder="Label (Home, Work)"
                    value="${x.label || ""}"
                >

                <input
                    name="text"
                    required
                    placeholder="Full delivery address"
                    value="${x.text || ""}"
                >

                <button class="profile-primary">
                    Save Address
                </button>

            </form>

        `;


        const addressForm =
            document.getElementById(
                "addressForm"
            );


        if (!addressForm) {
            return;
        }


        addressForm.onsubmit =
            function (e) {

                e.preventDefault();


                const d =
                    Object.fromEntries(
                        new FormData(e.target)
                    );


                if (i == null) {

                    a.push(d);

                }
                else {

                    a[i] =
                        d;

                }


                set(
                    "grillHouseAddresses",
                    a
                );


                render("addresses");

            };

    }


    // ======================================================
    // DYNAMIC BUTTONS
    // ======================================================

    function bindDynamic() {


        // ==============================================
        // DELETE ADDRESS
        // ==============================================

        document
            .querySelectorAll(
                "[data-delete-address]"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            const a =
                                get(
                                    "grillHouseAddresses"
                                );


                            a.splice(
                                Number(
                                    button.dataset.deleteAddress
                                ),
                                1
                            );


                            set(
                                "grillHouseAddresses",
                                a
                            );


                            render(
                                "addresses"
                            );

                        };

                }
            );


        // ==============================================
        // EDIT ADDRESS
        // ==============================================

        document
            .querySelectorAll(
                "[data-edit-address]"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            showAddress(
                                Number(
                                    button.dataset.editAddress
                                )
                            );

                        };

                }
            );


        // ==============================================
        // REORDER
        // ==============================================

        document
            .querySelectorAll(
                "[data-reorder]"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            const o =
                                orders().find(
                                    x =>
                                        x.id ===
                                        button.dataset.reorder
                                );


                            if (!o) {
                                return;
                            }


                            set(
                                "grillHouseCart",
                                o.items
                            );


                            window
                                .GrillCart
                                ?.install();


                            alert(
                                "Order added back to your cart."
                            );

                        };

                }
            );


        // ==============================================
        // REMOVE FAVOURITE
        // ==============================================

        document
            .querySelectorAll(
                "[data-fav-remove]"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            const f =
                                fav();


                            f.splice(
                                Number(
                                    button.dataset.favRemove
                                ),
                                1
                            );


                            set(
                                "grillHouseFavourites",
                                f
                            );


                            render(
                                "favourites"
                            );

                        };

                }
            );


        // ==============================================
        // FAVOURITE TO CART
        // ==============================================

        document
            .querySelectorAll(
                "[data-fav-cart]"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            const f =
                                fav()[
                                    Number(
                                        button.dataset.favCart
                                    )
                                ];


                            if (!f) {
                                return;
                            }


                            const c =
                                cart();


                            const hit =
                                c.find(
                                    x =>
                                        x.id ===
                                        f.id
                                );


                            if (hit) {

                                hit.qty++;

                            }
                            else {

                                c.push({
                                    ...f,
                                    qty: 1
                                });

                            }


                            set(
                                "grillHouseCart",
                                c
                            );


                            window
                                .GrillCart
                                ?.install();


                            alert(
                                "Added to cart."
                            );

                        };

                }
            );

    }


    // ======================================================
    // PROFILE NAVIGATION
    // ======================================================

    document
        .querySelectorAll(
            "[data-section]"
        )
        .forEach(
            function (button) {

                button.onclick =
                    function () {

                        document
                            .querySelectorAll(
                                "[data-section]"
                            )
                            .forEach(
                                function (x) {

                                    x.classList.toggle(
                                        "active",
                                        x === button
                                    );

                                }
                            );


                        render(
                            button.dataset.section
                        );

                    };

            }
        );


    // ======================================================
    // LOGOUT
    // ======================================================

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.onclick =
            function () {

                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmed) {

                    return;

                }


                console.log(
                    "LOGOUT STARTED 🔴"
                );


                // ==========================================
                // REMOVE LOGIN DATA
                // ==========================================

                localStorage.removeItem(
                    "customerId"
                );

                localStorage.removeItem(
                    "customerName"
                );

                localStorage.removeItem(
                    "customerPhone"
                );

                localStorage.removeItem(
                    "isLoggedIn"
                );


                // ==========================================
                // REMOVE LOGIN RETURN DATA
                // ==========================================

                sessionStorage.removeItem(
                    "loginReturnPage"
                );

                sessionStorage.removeItem(
                    "loginFromCheckout"
                );


                console.log(
                    "LOGIN DATA CLEARED ✅"
                );


                // ==========================================
                // GO HOME
                // ==========================================

                window.location.replace(
                    "index.html"
                );

            };

    }
    else {

        console.error(
            "logoutBtn not found ❌"
        );

    }


    // ======================================================
    // INITIAL RENDER
    // ======================================================

    render("orders");

});