document.addEventListener("DOMContentLoaded", function () {

    // ======================================================
    // LOCAL STORAGE HELPERS
    // ======================================================

    const get = (key, fallback = []) => {

        try {

            const value = localStorage.getItem(key);

            if (!value) {
                return fallback;
            }

            return JSON.parse(value) || fallback;

        } catch (e) {

            console.error(
                "LocalStorage read error:",
                e
            );

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
        localStorage.getItem("isLoggedIn") !==
        "true"
    ) {

        window.location.href = "index.html";

        return;

    }


    // ======================================================
    // CUSTOMER DETAILS
    // ======================================================

    const customerId =
        localStorage.getItem("customerId") || "";


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
    // CONTENT
    // ======================================================

    const content =
        document.getElementById(
            "profileContent"
        );


    // ======================================================
    // LOCAL DATA
    // ======================================================

    const fav = () =>
        get("grillHouseFavourites");


    const notes = () =>
        get("grillHouseNotifications");


    const cart = () =>
        get("grillHouseCart");

// ======================================================
// RATED ORDERS
// ======================================================

const ratedOrdersStorageKey =
    `grillHouseRatedOrders_${customerId}`;


function getRatedOrderIds() {

    return get(
        ratedOrdersStorageKey,
        []
    ).map(String);

}


function isOrderRated(orderID) {

    return getRatedOrderIds().includes(
        String(orderID)
    );

}
    // ======================================================
    // DATABASE ORDERS
    // ======================================================

    let databaseOrders = [];

    let ordersLoading = false;


    // ======================================================
    // CURRENT SELECTED ORDER
    // ======================================================

    let selectedOrder = null;


    // ======================================================
    // READY ORDER NOTIFICATION SYSTEM
    // ======================================================

    const readyStatusStorageKey =
        `grillHouseReadyOrderStatuses_${customerId}`;


    const readyNotificationStorageKey =
        `grillHouseReadyNotifications_${customerId}`;


    // ======================================================
    // GET READY STATUS STATE
    // ======================================================

    function getReadyStatusState() {

        return get(
            readyStatusStorageKey,
            {}
        );

    }


    // ======================================================
    // SAVE READY STATUS STATE
    // ======================================================

    function setReadyStatusState(state) {

        localStorage.setItem(
            readyStatusStorageKey,
            JSON.stringify(state)
        );

    }


    // ======================================================
    // UPDATE NOTIFICATION DOT
    // ======================================================

    function updateNotificationDot() {

        const dot =
            document.querySelector(
                ".notification-dot"
            );


        if (!dot) {
            return;
        }


        const notifications =
            get(
                readyNotificationStorageKey,
                []
            );


        dot.style.display =
            notifications.length > 0
                ? "block"
                : "none";

    }


    // ======================================================
    // PLAY READY SOUND
    // ======================================================

    function playReadySound() {

        try {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;


            if (!AudioContext) {
                return;
            }


            const audioContext =
                new AudioContext();


            const oscillator =
                audioContext.createOscillator();


            const gain =
                audioContext.createGain();


            oscillator.type =
                "sine";


            oscillator.frequency.setValueAtTime(
                880,
                audioContext.currentTime
            );


            oscillator.frequency.setValueAtTime(
                1174,
                audioContext.currentTime + 0.12
            );


            gain.gain.setValueAtTime(
                0.0001,
                audioContext.currentTime
            );


            gain.gain.exponentialRampToValueAtTime(
                0.18,
                audioContext.currentTime + 0.02
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                audioContext.currentTime + 0.45
            );


            oscillator.connect(gain);

            gain.connect(
                audioContext.destination
            );


            oscillator.start();


            oscillator.stop(
                audioContext.currentTime + 0.45
            );


            oscillator.addEventListener(
                "ended",
                function () {

                    audioContext.close();

                },
                {
                    once: true
                }
            );


        } catch (error) {

            console.warn(
                "READY SOUND ERROR:",
                error
            );

        }

    }


    // ======================================================
    // SHOW READY TOAST
    // ======================================================

    function showReadyNotification(orderID) {

        playReadySound();


        // --------------------------------------------------
        // BROWSER NOTIFICATION
        // --------------------------------------------------

        if ("Notification" in window) {

            if (
                Notification.permission ===
                "granted"
            ) {

                try {

                    new Notification(
                        "Your order is ready!",
                        {
                            body:
                                `Order #${orderID} is ready for pickup.`,
                            tag:
                                `grill-house-order-${orderID}`
                        }
                    );

                } catch (error) {

                    console.warn(
                        "BROWSER NOTIFICATION ERROR:",
                        error
                    );

                }

            }

            else if (
                Notification.permission ===
                "default"
            ) {

                Notification
                    .requestPermission()
                    .then(permission => {

                        if (
                            permission ===
                            "granted"
                        ) {

                            new Notification(
                                "Your order is ready!",
                                {
                                    body:
                                        `Order #${orderID} is ready for pickup.`,
                                    tag:
                                        `grill-house-order-${orderID}`
                                }
                            );

                        }

                    })
                    .catch(() => {});

            }

        }


        // --------------------------------------------------
        // WEBSITE TOAST
        // --------------------------------------------------

        let toast =
            document.getElementById(
                "grillReadyToast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.id =
                "grillReadyToast";


            toast.innerHTML = `
                <div class="grill-ready-toast-icon">
                    <i class="fa-solid fa-bell"></i>
                </div>

                <div class="grill-ready-toast-content">

                    <strong>
                        Your order is ready!
                    </strong>

                    <span id="grillReadyToastText"></span>

                </div>

                <button
                    type="button"
                    id="grillReadyToastClose"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;


            const style =
                document.createElement(
                    "style"
                );


            style.textContent = `

                #grillReadyToast {

                    position: fixed;

                    right: 22px;
                    bottom: 22px;

                    z-index: 99999;

                    display: flex;
                    align-items: center;

                    gap: 11px;

                    width:
                        min(
                            360px,
                            calc(100vw - 30px)
                        );

                    padding: 13px 14px;

                    border-radius: 12px;

                    background: #3b2118;

                    color: #fff;

                    box-shadow:
                        0 10px 30px
                        rgba(0,0,0,.22);

                    font-family:
                        Arial, sans-serif;

                    transform:
                        translateY(20px);

                    opacity: 0;

                    transition:
                        .25s ease;

                }


                #grillReadyToast.show {

                    transform:
                        translateY(0);

                    opacity: 1;

                }


                #grillReadyToast
                .grill-ready-toast-icon {

                    width: 38px;
                    height: 38px;

                    border-radius: 50%;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    background: #e7a32f;

                    color: #3b2118;

                    flex-shrink: 0;

                }


                #grillReadyToast strong {

                    display: block;

                    font-size: 14px;

                    margin-bottom: 3px;

                }


                #grillReadyToast span {

                    display: block;

                    font-size: 12px;

                    color: #f3ddd2;

                }


                #grillReadyToast button {

                    margin-left: auto;

                    border: 0;

                    background: transparent;

                    color: #fff;

                    cursor: pointer;

                    font-size: 14px;

                }

            `;


            document.head.appendChild(
                style
            );


            document.body.appendChild(
                toast
            );


            const closeButton =
                document.getElementById(
                    "grillReadyToastClose"
                );


            if (closeButton) {

                closeButton.onclick =
                    function () {

                        toast.classList.remove(
                            "show"
                        );

                    };

            }

        }


        const toastText =
            document.getElementById(
                "grillReadyToastText"
            );


        if (toastText) {

            toastText.textContent =
                `Order #${orderID} is ready for pickup.`;

        }


        requestAnimationFrame(
            function () {

                toast.classList.add(
                    "show"
                );

            }
        );


        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            5000
        );

    }


    // ======================================================
    // ADD READY NOTIFICATION
    // ======================================================

    function addReadyNotification(order) {

        if (!order) {
            return;
        }


        const orderID =
            String(
                order.order_id || ""
            );


        if (!orderID) {
            return;
        }


        const currentNotifications =
            get(
                readyNotificationStorageKey,
                []
            );


        const alreadyExists =
            currentNotifications.some(
                item =>
                    String(
                        item.order_id
                    ) === orderID
            );


        if (alreadyExists) {

            updateNotificationDot();

            return;

        }


        // --------------------------------------------------
        // CREATE NOTIFICATION
        // --------------------------------------------------

        const notification = {

            order_id:
                orderID,

            title:
                "Your order is ready",

            text:
                `Order #${orderID} is ready for pickup.`,

            date:
                new Date().toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )

        };


        currentNotifications.unshift(
            notification
        );


        set(
            readyNotificationStorageKey,
            currentNotifications
        );


        // --------------------------------------------------
        // NORMAL WEBSITE NOTIFICATIONS
        // --------------------------------------------------

        const currentNotes =
            notes();


        const noteExists =
            currentNotes.some(
                item =>
                    String(
                        item.order_id || ""
                    ) === orderID
            );


        if (!noteExists) {

            currentNotes.unshift({

                order_id:
                    orderID,

                title:
                    "Your order is ready",

                text:
                    `Order #${orderID} is ready for pickup.`,

                date:
                    new Date().toLocaleString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )

            });


            set(
                "grillHouseNotifications",
                currentNotes
            );

        }


        // --------------------------------------------------
        // SHOW NOTIFICATION DOT
        // --------------------------------------------------

        updateNotificationDot();


        // --------------------------------------------------
        // SOUND + TOAST + BROWSER NOTIFICATION
        // --------------------------------------------------

        showReadyNotification(
            orderID
        );


        // --------------------------------------------------
        // CLEAR NOTIFICATION AFTER 5 MINUTES
        // --------------------------------------------------

        setTimeout(
            function () {

                const current =
                    get(
                        readyNotificationStorageKey,
                        []
                    );


                set(
                    readyNotificationStorageKey,

                    current.filter(
                        item =>
                            String(
                                item.order_id
                            ) !== orderID
                    )

                );


                const currentNotes =
                    notes();


                set(
                    "grillHouseNotifications",

                    currentNotes.filter(
                        item =>
                            String(
                                item.order_id || ""
                            ) !== orderID
                    )

                );


                updateNotificationDot();


                if (
                    document.querySelector(
                        '[data-section="notifications"].active'
                    )
                ) {

                    render(
                        "notifications"
                    );

                }

            },
            300000
        );

    }


    // ======================================================
    // CHECK READY STATUS CHANGE
    // ======================================================
// ======================================================
// AUTO PICKUP SYSTEM
// READY → 15 SECONDS → PICKED UP
// ======================================================

const autoPickupTimers = {};

async function autoPickupOrder(order) {

    if (!order) {
        return;
    }

    const orderID =
        String(order.order_id || "");

    if (!orderID) {
        return;
    }

    try {

        const response =
            await fetch(
                "api/pickup_order.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            order_id:
                                orderID,

                            customer_id:
                                customerId
                        })
                }
            );

        const result =
            await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to update pickup status"
            );

        }

        // ----------------------------------------------
        // UPDATE CURRENT ORDER IN MEMORY
        // ----------------------------------------------

        order.order_status =
            "Picked Up";

        const index =
            databaseOrders.findIndex(
                item =>
                    String(
                        item.order_id
                    ) === orderID
            );

        if (index !== -1) {

            databaseOrders[index]
                .order_status =
                "Picked Up";

        }

        // ----------------------------------------------
        // CLEAR TIMER
        // ----------------------------------------------

        if (
            autoPickupTimers[orderID]
        ) {

            clearTimeout(
                autoPickupTimers[orderID]
            );

            delete autoPickupTimers[
                orderID
            ];

        }

        // ----------------------------------------------
        // RE-RENDER RECENT ORDERS
        // ----------------------------------------------

        render("orders");

        // ----------------------------------------------
        // IF ORDER SUMMARY IS OPEN
        // UPDATE THAT TOO
        // ----------------------------------------------

        if (
            selectedOrder &&
            String(
                selectedOrder.order_id
            ) === orderID
        ) {

            selectedOrder =
                databaseOrders[index] ||
                order;

            renderOrderDetails(
                selectedOrder
            );

        }

    } catch (error) {

        console.error(
            "AUTO PICKUP ERROR:",
            error
        );

        // Retry after 5 seconds
        // only if order is still Ready

        const currentOrder =
            databaseOrders.find(
                item =>
                    String(
                        item.order_id
                    ) === orderID
            );

        if (
            currentOrder &&
            normalizeStatus(
                currentOrder.order_status
            ) === "Ready"
        ) {

            autoPickupTimers[orderID] =
                setTimeout(
                    function () {

                        autoPickupOrder(
                            currentOrder
                        );

                    },
                    5000
                );

        }

    }

}


// ======================================================
// START AUTO PICKUP TIMER
// ======================================================

function startAutoPickupTimer(order) {

    if (!order) {
        return;
    }

    const orderID =
        String(order.order_id || "");

    if (!orderID) {
        return;
    }

    const status =
        normalizeStatus(
            order.order_status
        );

    // Already picked up
    if (status === "Picked Up") {

        if (
            autoPickupTimers[orderID]
        ) {

            clearTimeout(
                autoPickupTimers[orderID]
            );

            delete autoPickupTimers[
                orderID
            ];

        }

        return;
    }

    // Only Ready orders
    if (status !== "Ready") {
        return;
    }

    // Timer already running
    if (
        autoPickupTimers[orderID]
    ) {
        return;
    }

    // ----------------------------------------------
    // USE DATABASE READY TIME IF AVAILABLE
    // ----------------------------------------------

    let remainingTime =
        15000;

    if (order.display_ready_time) {

        const readyTime =
            new Date(
                String(
                    order.display_ready_time
                ).replace(
                    " ",
                    "T"
                )
            ).getTime();

        if (
            !isNaN(readyTime)
        ) {

            const elapsed =
                Date.now() -
                readyTime;

            remainingTime =
                Math.max(
                    0,
                    15000 - elapsed
                );

        }

    }

    autoPickupTimers[orderID] =
        setTimeout(
            function () {

                delete autoPickupTimers[
                    orderID
                ];

                autoPickupOrder(
                    order
                );

            },
            remainingTime
        );

}


// ======================================================
// CHECK READY STATUS CHANGE
// ======================================================

function checkReadyOrderNotifications(
    orders
) {

    if (!Array.isArray(orders)) {
        return;
    }

    const previousState =
        getReadyStatusState();

    const currentState = {};

    orders.forEach(
        function (order) {

            const orderID =
                String(
                    order.order_id || ""
                );

            if (!orderID) {
                return;
            }

            const currentStatus =
                normalizeStatus(
                    order.order_status
                );

            currentState[orderID] =
                currentStatus;

            const previousStatus =
                previousState[orderID];

            // ------------------------------------------
            // READY NOTIFICATION
            // ------------------------------------------

            if (
                previousStatus &&
                previousStatus !== "Ready" &&
                currentStatus === "Ready"
            ) {

                addReadyNotification(
                    order
                );

            }

            // ------------------------------------------
            // AUTO PICKUP
            // ------------------------------------------

            if (
                currentStatus === "Ready"
            ) {

                startAutoPickupTimer(
                    order
                );

            }

            // ------------------------------------------
            // CLEAR TIMER IF NOT READY
            // ------------------------------------------

            if (
                currentStatus !== "Ready" &&
                autoPickupTimers[orderID]
            ) {

                clearTimeout(
                    autoPickupTimers[orderID]
                );

                delete autoPickupTimers[
                    orderID
                ];

            }

        }
    );

    setReadyStatusState(
        currentState
    );

    updateNotificationDot();

}
    // ======================================================
    // ESCAPE HTML
    // ======================================================

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

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
    // STATUS NORMALIZER
    // ======================================================

    function normalizeStatus(status) {

        const value =
            String(status || "")
                .trim()
                .toLowerCase();


        if (
            value === "pending" ||
            value === "order placed" ||
            value === "placed"
        ) {

            return "Pending";

        }


        if (
            value === "preparing" ||
            value === "processing"
        ) {

            return "Preparing";

        }


        if (
            value === "ready" ||
            value === "ready for pickup" ||
            value === "prepared"
        ) {

            return "Ready";

        }


        if (
            value === "picked up" ||
            value === "pickedup" ||
            value === "completed" ||
            value === "complete"
        ) {

            return "Picked Up";

        }


        return "Pending";

    }


    // ======================================================
    // STATUS CLASS
    // ======================================================

    function statusClass(status) {

        return normalizeStatus(status)
            .toLowerCase()
            .replace(/\s+/g, "-");

    }


    // ======================================================
    // STATUS STEP
    // ======================================================

    function getStatusStep(status) {

        const current =
            normalizeStatus(status);


        if (current === "Pending") {
            return 1;
        }


        if (current === "Preparing") {
            return 2;
        }


        if (current === "Ready") {
            return 3;
        }


        if (current === "Picked Up") {
            return 4;
        }


        return 1;

    }


    // ======================================================
    // STATUS TIMELINE
    // ======================================================

    function renderOrderProgress(status) {

        const step =
            getStatusStep(status);


        const steps = [
            "Pending",
            "Preparing",
            "Ready",
            "Picked Up"
        ];


        return `

            <div class="order-progress">

                ${steps.map(
                    (item, index) => {

                        const stepNumber =
                            index + 1;


                        const completed =
                            stepNumber <= step;


                        const active =
                            stepNumber === step;


                        return `

                            <div class="
                                progress-step
                                ${completed ? "completed" : ""}
                                ${active ? "current" : ""}
                            ">

                                <div class="progress-dot">

                                    ${
                                        completed
                                            ? '<i class="fa-solid fa-check"></i>'
                                            : ""
                                    }

                                </div>

                                <span>
                                    ${item}
                                </span>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        `;

    }


    // ======================================================
    // DATE FORMAT
    // ======================================================

    function formatOrderDate(dateValue) {

        if (!dateValue) {
            return "";
        }


        const date =
            new Date(
                String(dateValue).replace(
                    " ",
                    "T"
                )
            );


        if (isNaN(date.getTime())) {
            return dateValue;
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ) +
        ", " +
        date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    // ======================================================
    // GET ORDER ITEM COUNT
    // ======================================================

    function getItemCount(order) {

        return (order.items || [])
            .reduce(
                (total, item) =>
                    total +
                    Number(
                        item.quantity ||
                        item.qty ||
                        0
                    ),
                0
            );

    }


    // ======================================================
    // GET ORDER SUBTOTAL
    // ======================================================

    function getOrderSubtotal(order) {

        let subtotal = 0;


        if (
            order.items &&
            order.items.length
        ) {

            order.items.forEach(
                item => {

                    const price =
                        Number(
                            item.price ||
                            item.item_price ||
                            0
                        );


                    const quantity =
                        Number(
                            item.quantity ||
                            item.qty ||
                            0
                        );


                    subtotal +=
                        price * quantity;

                }
            );

        }


        if (subtotal <= 0) {

            subtotal =
                Number(
                    order.order_total ||
                    order.subtotal ||
                    order.total_amount ||
                    0
                );

        }


        return subtotal;

    }


    // ======================================================
    // GET GST
    // ======================================================

    function getOrderGST(order) {

        if (
            order.gst_amount !== undefined &&
            order.gst_amount !== null &&
            order.gst_amount !== ""
        ) {

            return Number(
                order.gst_amount
            ) || 0;

        }


        let gst = 0;


        if (
            order.items &&
            order.items.length
        ) {

            order.items.forEach(
                item => {

                    const price =
                        Number(
                            item.price ||
                            item.item_price ||
                            0
                        );


                    const quantity =
                        Number(
                            item.quantity ||
                            item.qty ||
                            0
                        );


                    const gstPercent =
                        Number(
                            item.gst_percent ||
                            item.gst ||
                            0
                        );


                    gst +=
                        (price * quantity) *
                        gstPercent /
                        100;

                }
            );

        }


        return gst;

    }


    // ======================================================
    // GET DISCOUNT
    // ======================================================

    function getOrderDiscount(order) {

        return Number(
            order.discount_amount ||
            order.discount ||
            0
        ) || 0;

    }


    // ======================================================
    // GET TOTAL PAYABLE
    // ======================================================

    function getTotalPayable(order) {

        if (
            order.total_payable !== undefined &&
            order.total_payable !== null &&
            order.total_payable !== ""
        ) {

            return Number(
                order.total_payable
            ) || 0;

        }


        const subtotal =
            getOrderSubtotal(order);


        const gst =
            getOrderGST(order);


        const discount =
            getOrderDiscount(order);


        return (
            subtotal +
            gst -
            discount
        );

    }


    // ======================================================
    // ITEM SUMMARY
    // ======================================================

    function getItemSummary(order) {

        if (
            !order.items ||
            !order.items.length
        ) {

            return "Order items";

        }


        const first =
            order.items[0];


        const firstName =
            escapeHTML(
                first.item_name ||
                first.name ||
                "Item"
            );


        if (
            order.items.length === 1
        ) {

            return firstName;

        }


        return (
            firstName +
            " +" +
            (order.items.length - 1) +
            " more"
        );

    }


    // ======================================================
    // LOAD ORDERS FROM DATABASE
    // ======================================================

    // ======================================================
// LOAD ORDERS FROM DATABASE
// ======================================================

async function loadDatabaseOrders(
    showLoading = false
) {

    if (!customerId) {

        console.warn(
            "customerId not found in localStorage"
        );

        databaseOrders = [];

        render("orders");

        return;

    }


    // --------------------------------------------------
    // ONLY INITIAL LOAD SHOWS LOADING UI
    // --------------------------------------------------

    if (showLoading) {

        ordersLoading = true;

        render("orders");

    }


    try {

        const response =
            await fetch(
                "api/get_customer_orders.php?customer_id=" +
                encodeURIComponent(
                    customerId
                ),
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to load orders"
            );

        }


        const freshOrders =
            Array.isArray(
                result.orders
            )
                ? result.orders
                : [];


        // --------------------------------------------------
        // READY CHECK MUST RUN EVERY TIME
        // --------------------------------------------------

        checkReadyOrderNotifications(
            freshOrders
        );


        // --------------------------------------------------
        // CREATE STABLE ORDER SIGNATURE
        // --------------------------------------------------

        function getOrderSignature(
            orders
        ) {

            return JSON.stringify(
                orders.map(
                    order => ({

                        order_id:
                            String(
                                order.order_id ||
                                ""
                            ),

                        order_status:
                            normalizeStatus(
                                order.order_status
                            ),

                        total_amount:
                            String(
                                order.total_amount ||
                                ""
                            ),

                        payment_status:
                            String(
                                order.payment_status ||
                                ""
                            ),

                        created_at:
                            String(
                                order.created_at ||
                                ""
                            ),

                        display_ready_time:
                            String(
                                order.display_ready_time ||
                                ""
                            ),

                        items:
                            Array.isArray(
                                order.items
                            )
                                ? order.items.map(
                                    item => ({

                                        item_name:
                                            String(
                                                item.item_name ||
                                                item.name ||
                                                ""
                                            ),

                                        quantity:
                                            String(
                                                item.quantity ||
                                                item.qty ||
                                                ""
                                            ),

                                        price:
                                            String(
                                                item.price ||
                                                item.item_price ||
                                                ""
                                            )

                                    })
                                )
                                : []

                    })
                )
            );

        }


        const oldSignature =
            getOrderSignature(
                databaseOrders
            );


        const newSignature =
            getOrderSignature(
                freshOrders
            );


        // --------------------------------------------------
        // UPDATE DATA
        // --------------------------------------------------

        databaseOrders =
            freshOrders;


        // --------------------------------------------------
        // RENDER ONLY IF DATA ACTUALLY CHANGED
        // --------------------------------------------------

        if (
            showLoading ||
            oldSignature !== newSignature
        ) {

            render("orders");

        }


        console.log(
            "DATABASE ORDERS CHECKED ✅"
        );


    } catch (error) {

        console.error(
            "ORDER LOAD ERROR ❌",
            error
        );


        // --------------------------------------------------
        // IMPORTANT:
        // DURING BACKGROUND REFRESH DON'T CLEAR
        // EXISTING ORDERS.
        // --------------------------------------------------

        if (showLoading) {

            databaseOrders = [];

            render("orders");

        }

    }


    ordersLoading = false;

}
    // ======================================================
    // RENDER ORDER CARD
    // ======================================================

    function renderOrderCard(order) {

        const status =
            normalizeStatus(
                order.order_status
            );


        const cssStatus =
            statusClass(status);


        const itemCount =
            getItemCount(order);


        const itemText =
            itemCount === 1
                ? "item"
                : "items";


        const amount =
            Number(
                order.total_amount || 0
            ).toFixed(2);


        const date =
            formatOrderDate(
                order.created_at
            );


        const isPickedUp =
            status === "Picked Up";


        return `

            <article
                class="order-card"
                data-order-id="${escapeHTML(
                    order.order_id
                )}"
                role="button"
                tabindex="0"
            >

                <div class="order-top">

                    <h4>
                        ORDER #${escapeHTML(
                            order.order_id
                        )}
                    </h4>


                    <div class="order-status-wrap">

                        <span
                            class="order-status status-${cssStatus}"
                        >
                            ${escapeHTML(
                                status.toUpperCase()
                            )}
                        </span>


                        <i class="fa-solid fa-chevron-right"></i>

                    </div>

                </div>


                <div class="order-divider"></div>


                <div class="order-item-name">

                    ${getItemSummary(order)}

                </div>


                <div class="order-meta">

                    ₹${amount}

                    <span>|</span>

                    ${escapeHTML(date)}

                </div>


                <div class="order-item-count">

                    ${itemCount} ${itemText}

                </div>


                ${renderOrderProgress(status)}


             ${
    isPickedUp &&
    !isOrderRated(order.order_id)
        ? `
            <button
                type="button"
                class="rate-order-btn"
                data-rate-order="${escapeHTML(
                    order.order_id
                )}"
            >
                RATE YOUR ORDER
            </button>
        `
        : ""
}
            </article>

        `;

    }


    // ======================================================
    // ORDER DETAILS
    // ======================================================

    function renderOrderDetails(order) {

        if (!order) {

            render("orders");

            return;

        }


        selectedOrder =
            order;


        const status =
            normalizeStatus(
                order.order_status
            );


        const subtotal =
            getOrderSubtotal(order);


        const gst =
            getOrderGST(order);


        const discount =
            getOrderDiscount(order);


        const payable =
            getTotalPayable(order);


        const paymentMethod =
            order.payment_method ||
            order.paymentMode ||
            "Not Available";


        const orderType =
            order.order_type ||
            "Dine-In";


        const tableName =
            order.table_name ||
            order.table ||
            "";


        const customerName =
            order.customer_name ||
            name;


        const customerPhone =
            order.mobile_no ||
            order.customer_phone ||
            phone;


        const createdAt =
            formatOrderDate(
                order.created_at
            );


        content.innerHTML = `

            <div class="order-detail-page">

                <div class="order-detail-header">

                    <button
                        type="button"
                        class="order-back-btn"
                        id="backToOrders"
                    >
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>


                    <h1>
                        ORDER #${escapeHTML(
                            order.order_id
                        )}
                    </h1>

                </div>


                <div class="order-detail-info-card">

                    <div class="detail-info-row">

                        <div class="detail-info-icon">
                            <i class="fa-solid fa-location-dot"></i>
                        </div>


                        <div>

                            <span>
                                ORDER TYPE
                            </span>


                            <strong>

                                ${escapeHTML(
                                    orderType
                                )}

                                ${
                                    tableName
                                        ? " · " +
                                          escapeHTML(
                                              tableName
                                          )
                                        : ""
                                }

                            </strong>

                        </div>

                    </div>


                    <div class="detail-info-row">

                        <div class="detail-info-icon">

                            <i class="fa-solid fa-credit-card"></i>

                        </div>


                        <div>

                            <span>
                                PAYMENT METHOD
                            </span>


                            <strong>
                                ${escapeHTML(
                                    paymentMethod
                                )}
                            </strong>

                        </div>

                    </div>


                    <div class="detail-info-row">

                        <div class="detail-info-icon">

                            <i class="fa-solid fa-user"></i>

                        </div>


                        <div>

                            <span>
                                ORDERED FOR
                            </span>


                            <strong>
                                ${escapeHTML(
                                    customerName
                                )}
                            </strong>


                            <small>
                                ${escapeHTML(
                                    customerPhone
                                )}
                            </small>

                        </div>

                    </div>


                    <div class="detail-info-row">

                        <div class="detail-info-icon">

                            <i class="fa-regular fa-clock"></i>

                        </div>


                        <div>

                            <span>
                                ORDER DATE
                            </span>


                            <strong>
                                ${escapeHTML(
                                    createdAt
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- STATUS -->

                <div class="order-detail-status-card">

                    <div>

                        <span class="detail-small-title">
                            ORDER STATUS
                        </span>


                        <div class="
                            detail-status-badge
                            status-${statusClass(status)}
                        ">

                            ${escapeHTML(
                                status.toUpperCase()
                            )}

                        </div>

                    </div>


                   ${
    status === "Ready"
        ? `
            <div class="ready-message">

                <i class="fa-solid fa-bell"></i>

                <span>
                    Your order is ready for pickup!
                </span>

            </div>
        `
        : ""
}

                </div>


                <!-- ITEMS -->

                <div class="order-items-detail-card">

                    <div class="detail-section-title">
                        ORDER ITEMS
                    </div>


                    ${
                        order.items &&
                        order.items.length
                            ? order.items
                                .map(
                                    item => {

                                        const itemName =
                                            item.item_name ||
                                            item.name ||
                                            "Item";


                                        const quantity =
                                            Number(
                                                item.quantity ||
                                                item.qty ||
                                                0
                                            );


                                        const price =
                                            Number(
                                                item.price ||
                                                item.item_price ||
                                                0
                                            );


                                        const lineTotal =
                                            price *
                                            quantity;


                                        return `

                                            <div class="detail-item-row">

                                                <div class="detail-item-left">

                                                    <div class="detail-item-image">

                                                        ${
                                                            item.image
                                                                ? `
                                                                    <img
                                                                        src="${escapeHTML(
                                                                            item.image
                                                                        )}"
                                                                        alt="${escapeHTML(
                                                                            itemName
                                                                        )}"
                                                                    >
                                                                `
                                                                : `
                                                                    <i class="fa-solid fa-burger"></i>
                                                                `
                                                        }

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            ${escapeHTML(
                                                                itemName
                                                            )}
                                                        </strong>


                                                        <span>
                                                            ₹${price.toFixed(
                                                                2
                                                            )} × ${quantity}
                                                        </span>

                                                    </div>

                                                </div>


                                                <strong>
                                                    ₹${lineTotal.toFixed(
                                                        2
                                                    )}
                                                </strong>

                                            </div>

                                        `;

                                    }
                                )
                                .join("")
                            : `
                                <div class="detail-no-items">
                                    Order items are not available.
                                </div>
                            `
                    }

                </div>


                <!-- PRICE SUMMARY -->

                <div class="order-summary-card">

                    <div class="summary-row">

                        <span>
                            Order Total
                        </span>


                        <strong>
                            ₹${subtotal.toFixed(2)}
                        </strong>

                    </div>


                    <div class="summary-row">

                        <span>
                            Discount
                        </span>


                        <strong class="discount-value">

                            - ₹${discount.toFixed(2)}

                        </strong>

                    </div>


                    <div class="summary-row">

                        <span>
                            Taxes and Charges
                        </span>


                        <strong>
                            ₹${gst.toFixed(2)}
                        </strong>

                    </div>


                    <div class="summary-divider"></div>


                    <div class="summary-row total-row">

                        <span>
                            TOTAL PAYABLE
                        </span>


                        <strong>
                            ₹${payable.toFixed(2)}
                        </strong>

                    </div>

                </div>


                <!-- RECEIPT BUTTON -->

                <div class="receipt-button-wrap">

                    <button
                        type="button"
                        id="viewReceiptBtn"
                        class="view-receipt-btn"
                    >

                        <i class="fa-solid fa-receipt"></i>

                        VIEW RECEIPT

                    </button>

                </div>

            </div>

        `;


        // ==================================================
        // BACK BUTTON
        // ==================================================

        const backButton =
            document.getElementById(
                "backToOrders"
            );


        if (backButton) {

            backButton.onclick =
                function () {

                    selectedOrder =
                        null;


                    render("orders");

                };

        }

        // ==================================================
        // RECEIPT BUTTON
        // ==================================================

        const receiptButton =
            document.getElementById(
                "viewReceiptBtn"
            );


        if (receiptButton) {

            receiptButton.onclick =
                function () {

                    showReceipt(
                        order
                    );

                };

        }

    }


    // ======================================================
    // RECEIPT POPUP
    // ======================================================

    function showReceipt(order) {

        closeReceipt();


        const status =
            normalizeStatus(
                order.order_status
            );


        const subtotal =
            getOrderSubtotal(order);


        const gst =
            getOrderGST(order);


        const discount =
            getOrderDiscount(order);


        const payable =
            getTotalPayable(order);


        const paymentMethod =
            order.payment_method ||
            order.paymentMode ||
            "Not Available";


        const orderType =
            order.order_type ||
            "Dine-In";


        const createdAt =
            formatOrderDate(
                order.created_at
            );


        const receipt =
            document.createElement(
                "div"
            );


        receipt.id =
            "receiptOverlay";


        receipt.innerHTML = `

            <div class="receipt-overlay-bg"></div>


            <div class="receipt-modal">

                <button
                    type="button"
                    class="receipt-close"
                    id="receiptCloseBtn"
                >

                    <i class="fa-solid fa-xmark"></i>

                </button>


                <div class="receipt-top">

                    <div class="receipt-logo">

                        <i class="fa-solid fa-fire"></i>

                    </div>


                    <h2>
                        THE GRILL HOUSE
                    </h2>


                    <p>
                        Order Receipt
                    </p>

                </div>


                <div class="receipt-line"></div>


                <div class="receipt-order-info">

                    <div>

                        <span>
                            Order
                        </span>


                        <strong>
                            #${escapeHTML(
                                order.order_id
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Date
                        </span>


                        <strong>
                            ${escapeHTML(
                                createdAt
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Order Type
                        </span>


                        <strong>
                            ${escapeHTML(
                                orderType
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Payment
                        </span>


                        <strong>
                            ${escapeHTML(
                                paymentMethod
                            )}
                        </strong>

                    </div>

                </div>


                <div class="receipt-line"></div>


                <div class="receipt-items">

                    ${
                        order.items &&
                        order.items.length
                            ? order.items
                                .map(
                                    item => {

                                        const itemName =
                                            item.item_name ||
                                            item.name ||
                                            "Item";


                                        const quantity =
                                            Number(
                                                item.quantity ||
                                                item.qty ||
                                                0
                                            );


                                        const price =
                                            Number(
                                                item.price ||
                                                item.item_price ||
                                                0
                                            );


                                        const total =
                                            price *
                                            quantity;


                                        return `

                                            <div class="receipt-item">

                                                <div>

                                                    <strong>
                                                        ${escapeHTML(
                                                            itemName
                                                        )}
                                                    </strong>


                                                    <span>
                                                        ${quantity} × ₹${price.toFixed(
                                                            2
                                                        )}
                                                    </span>

                                                </div>


                                                <strong>
                                                    ₹${total.toFixed(
                                                        2
                                                    )}
                                                </strong>

                                            </div>

                                        `;

                                    }
                                )
                                .join("")
                            : `
                                <div class="receipt-no-items">
                                    No item details available.
                                </div>
                            `
                    }

                </div>


                <div class="receipt-line"></div>


                <div class="receipt-summary">

                    <div>

                        <span>
                            Order Total
                        </span>


                        <strong>
                            ₹${subtotal.toFixed(2)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Discount
                        </span>


                        <strong class="receipt-discount">
                            - ₹${discount.toFixed(2)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Taxes & Charges
                        </span>


                        <strong>
                            ₹${gst.toFixed(2)}
                        </strong>

                    </div>


                    <div class="receipt-total">

                        <span>
                            TOTAL PAYABLE
                        </span>


                        <strong>
                            ₹${payable.toFixed(2)}
                        </strong>

                    </div>

                </div>


                <div class="receipt-line"></div>


                <div class="receipt-status">

                    <span>
                        STATUS
                    </span>


                    <strong>
                        ${escapeHTML(
                            status.toUpperCase()
                        )}
                    </strong>

                </div>


                ${
                    status === "Ready"
                        ? `
                            <div class="receipt-ready">

                                <i class="fa-solid fa-bell"></i>

                                Your order is ready for pickup!

                            </div>
                        `
                        : ""
                }


                <div class="receipt-footer">

                    <strong>
                        Thank you for ordering!
                    </strong>


                    <span>
                        The Grill House
                    </span>

                </div>

            </div>

        `;


        document.body.appendChild(
            receipt
        );


        document
            .getElementById(
                "receiptCloseBtn"
            )
            ?.addEventListener(
                "click",
                closeReceipt
            );


        document
            .querySelector(
                ".receipt-overlay-bg"
            )
            ?.addEventListener(
                "click",
                closeReceipt
            );


        document.addEventListener(
            "keydown",
            receiptEscapeHandler
        );


        injectReceiptCSS();

    }


    // ======================================================
    // CLOSE RECEIPT
    // ======================================================

    function closeReceipt() {

        const receipt =
            document.getElementById(
                "receiptOverlay"
            );


        if (receipt) {

            receipt.remove();

        }


        document.removeEventListener(
            "keydown",
            receiptEscapeHandler
        );

    }


    // ======================================================
    // ESC RECEIPT
    // ======================================================

    function receiptEscapeHandler(event) {

        if (
            event.key === "Escape"
        ) {

            closeReceipt();

        }

    }


    // ======================================================
    // RECEIPT CSS
    // ======================================================

    function injectReceiptCSS() {

        if (
            document.getElementById(
                "profileReceiptCSS"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "profileReceiptCSS";


        style.textContent = `

            #receiptOverlay {

                position: fixed;

                inset: 0;

                z-index: 99999;

                display: flex;

                align-items: center;

                justify-content: center;

                padding: 20px;

                box-sizing: border-box;

            }


            .receipt-overlay-bg {

                position: absolute;

                inset: 0;

                background:
                    rgba(0,0,0,.58);

                backdrop-filter:
                    blur(3px);

            }


            .receipt-modal {

                position: relative;

                z-index: 2;

                width:
                    min(430px, 100%);

                max-height: 90vh;

                overflow-y: auto;

                background: #fff;

                border-radius: 12px;

                padding: 26px;

                box-sizing: border-box;

                box-shadow:
                    0 20px 60px
                    rgba(0,0,0,.28);

                color: #222;

            }


            .receipt-close {

                position: absolute;

                right: 14px;

                top: 14px;

                width: 34px;

                height: 34px;

                border: 0;

                border-radius: 50%;

                background: #f4f1ef;

                color: #6d392a;

                cursor: pointer;

                font-size: 16px;

            }


            .receipt-top {

                text-align: center;

                padding-top: 5px;

            }


            .receipt-logo {

                width: 48px;

                height: 48px;

                margin:
                    0 auto 10px;

                border-radius: 50%;

                display: flex;

                align-items: center;

                justify-content: center;

                background: #8d4024;

                color: #fff;

                font-size: 21px;

            }


            .receipt-top h2 {

                margin: 0;

                color: #502314;

                font-size: 20px;

                font-weight: 800;

            }


            .receipt-top p {

                margin:
                    5px 0 0;

                color: #777;

                font-size: 12px;

            }


            .receipt-line {

                height: 1px;

                background: #e8e2dd;

                margin: 18px 0;

            }


            .receipt-order-info {

                display: grid;

                grid-template-columns:
                    1fr 1fr;

                gap: 15px;

            }


            .receipt-order-info div {

                display: flex;

                flex-direction: column;

                gap: 4px;

            }


            .receipt-order-info span {

                font-size: 10px;

                color: #888;

                text-transform: uppercase;

                letter-spacing: .4px;

            }


            .receipt-order-info strong {

                font-size: 12px;

                color: #222;

            }


            .receipt-item {

                display: flex;

                align-items: flex-start;

                justify-content: space-between;

                gap: 15px;

                padding: 9px 0;

            }


            .receipt-item > div {

                display: flex;

                flex-direction: column;

                gap: 3px;

            }


            .receipt-item strong {

                font-size: 13px;

                color: #222;

            }


            .receipt-item span {

                font-size: 11px;

                color: #777;

            }


            .receipt-summary {

                display: flex;

                flex-direction: column;

                gap: 10px;

            }


            .receipt-summary > div {

                display: flex;

                justify-content: space-between;

                gap: 15px;

                font-size: 12px;

            }


            .receipt-summary span {

                color: #666;

            }


            .receipt-summary strong {

                color: #222;

            }


            .receipt-summary
            .receipt-discount {

                color: #72a800;

            }


            .receipt-total {

                margin-top: 5px;

                padding-top: 13px;

                border-top:
                    1px solid #ddd;

                font-size:
                    14px !important;

                font-weight: 800;

            }


            .receipt-total span,
            .receipt-total strong {

                color: #502314;

            }


            .receipt-status {

                display: flex;

                justify-content:
                    space-between;

                align-items: center;

                padding: 11px 13px;

                border-radius: 7px;

                background: #f8f5f2;

            }


            .receipt-status span {

                color: #777;

                font-size: 10px;

                font-weight: 700;

            }


            .receipt-status strong {

                color: #2d8b48;

                font-size: 11px;

            }


            .receipt-ready {

                margin-top: 12px;

                padding: 11px;

                border-radius: 7px;

                background: #edf8ef;

                color: #28763d;

                text-align: center;

                font-size: 12px;

                font-weight: 700;

            }


            .receipt-ready i {

                margin-right: 5px;

            }


            .receipt-footer {

                text-align: center;

                margin-top: 20px;

                display: flex;

                flex-direction: column;

                gap: 4px;

            }


            .receipt-footer strong {

                color: #502314;

                font-size: 13px;

            }


            .receipt-footer span {

                color: #888;

                font-size: 11px;

            }


            .receipt-no-items {

                padding: 15px 0;

                color: #888;

                text-align: center;

                font-size: 12px;

            }


            @media (max-width: 480px) {

                .receipt-modal {

                    padding:
                        22px 18px;

                }


                .receipt-order-info {

                    gap: 12px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    // ======================================================
    // ORDER BUTTONS
    // ======================================================

    function bindOrderButtons() {

        // --------------------------------------------------
        // ORDER CARD CLICK
        // --------------------------------------------------

        document
            .querySelectorAll(
                ".order-card"
            )
            .forEach(
                card => {

                    card.onclick =
                        function (event) {

                            if (
                                event.target.closest(
                                    "[data-rate-order]"
                                )
                            ) {

                                return;

                            }


                            const orderId =
                                String(
                                    card.dataset.orderId
                                );


                            const order =
                                databaseOrders.find(
                                    x =>
                                        String(
                                            x.order_id
                                        ) ===
                                        orderId
                                );


                            if (order) {

                                renderOrderDetails(
                                    order
                                );

                            }

                        };


                    card.onkeydown =
                        function (event) {

                            if (
                                event.key === "Enter" ||
                                event.key === " "
                            ) {

                                event.preventDefault();


                                const orderId =
                                    String(
                                        card.dataset.orderId
                                    );


                                const order =
                                    databaseOrders.find(
                                        x =>
                                            String(
                                                x.order_id
                                            ) ===
                                            orderId
                                    );


                                if (order) {

                                    renderOrderDetails(
                                        order
                                    );

                                }

                            }

                        };

                }
            );

        }

    // ======================================================
    // ADDRESS FORM
    // ======================================================

    function showAddress(i) {

        const a =
            get(
                "grillHouseAddresses"
            );


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
                    value="${escapeHTML(
                        x.label || ""
                    )}"
                >


                <input
                    name="text"
                    required
                    placeholder="Full delivery address"
                    value="${escapeHTML(
                        x.text || ""
                    )}"
                >


                <button
                    type="submit"
                    class="profile-primary"
                >

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
                        new FormData(
                            e.target
                        )
                    );


                if (i == null) {

                    a.push(d);

                } else {

                    a[i] = d;

                }


                set(
                    "grillHouseAddresses",
                    a
                );


                render(
                    "addresses"
                );

            };

    }


    // ======================================================
    // DYNAMIC BUTTONS
    // ======================================================

    function bindDynamic() {

        // --------------------------------------------------
        // DELETE ADDRESS
        // --------------------------------------------------

        document
            .querySelectorAll(
                "[data-delete-address]"
            )
            .forEach(
                button => {

                    button.onclick =
                        function () {

                            const a =
                                get(
                                    "grillHouseAddresses"
                                );


                            a.splice(
                                Number(
                                    button.dataset
                                        .deleteAddress
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


        // --------------------------------------------------
        // EDIT ADDRESS
        // --------------------------------------------------

        document
            .querySelectorAll(
                "[data-edit-address]"
            )
            .forEach(
                button => {

                    button.onclick =
                        function () {

                            showAddress(
                                Number(
                                    button.dataset
                                        .editAddress
                                )
                            );

                        };

                }
            );


        // --------------------------------------------------
        // FAVOURITE REMOVE
        // --------------------------------------------------

        document
            .querySelectorAll(
                "[data-fav-remove]"
            )
            .forEach(
                button => {

                    button.onclick =
                        function () {

                            const f =
                                fav();


                            f.splice(
                                Number(
                                    button.dataset
                                        .favRemove
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


        // --------------------------------------------------
        // FAVOURITE TO CART
        // --------------------------------------------------

        document
            .querySelectorAll(
                "[data-fav-cart]"
            )
            .forEach(
                button => {

                    button.onclick =
                        function () {

                            const f =
                                fav()[
                                    Number(
                                        button.dataset
                                            .favCart
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

                            } else {

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
            button => {

                button.onclick =
                    function () {

                        document
                            .querySelectorAll(
                                "[data-section]"
                            )
                            .forEach(
                                x => {

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


                sessionStorage.removeItem(
                    "loginReturnPage"
                );


                sessionStorage.removeItem(
                    "loginFromCheckout"
                );


                window.location.replace(
                    "index.html"
                );

            };

    }


    // ======================================================
    // RENDER PROFILE SECTION
    // ======================================================

    function render(section) {

        if (!content) {
            return;
        }


        // ==================================================
        // ORDERS
        // ==================================================

        if (section === "orders") {

            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        Recent Orders
                    </h1>


                    <p class="profile-sub">
                        Your Grill House orders will always be here.
                    </p>


                    ${
                        ordersLoading
                            ? `

                                <div class="profile-empty">

                                    <i class="fa-solid fa-spinner fa-spin"></i>

                                    <h3>
                                        Loading your orders
                                    </h3>

                                    <p>
                                        Please wait while we fetch your latest Grill House orders.
                                    </p>

                                </div>

                            `
                            :
                        databaseOrders.length
                            ? databaseOrders
                                .map(
                                    order =>
                                        renderOrderCard(
                                            order
                                        )
                                )
                                .join("")

                            : empty(
                                "fa-solid fa-bag-shopping",
                                "No orders yet",
                                "Your next Grill House favourite is waiting.",
                                `
                                    <a href="menu.html">

                                        <button
                                            type="button"
                                            class="profile-primary"
                                        >
                                            ORDER NOW
                                        </button>

                                    </a>
                                `
                            )
                    }

                </div>

            `;


            bindOrderButtons();


            return;

        }


        // ==================================================
        // ADDRESSES
        // ==================================================

        if (section === "addresses") {

            const a =
                get(
                    "grillHouseAddresses"
                );


            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        Saved Addresses
                    </h1>


                    <p class="profile-sub">
                        Save delivery details to checkout faster.
                    </p>


                    <button
                        type="button"
                        class="profile-primary"
                        id="showAddressForm"
                    >
                        + ADD ADDRESS
                    </button>


                    <div id="addressFormWrap"></div>


                    <div id="addressList">

                        ${
                            a.length
                                ? a.map(
                                    (x, i) => `

                                        <article class="address-card">

                                            <div class="address-actions">

                                                <h4>
                                                    ${escapeHTML(
                                                        x.label
                                                    )}
                                                </h4>


                                                <span>

                                                    <button
                                                        type="button"
                                                        class="profile-link-btn"
                                                        data-edit-address="${i}"
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        class="profile-link-btn"
                                                        data-delete-address="${i}"
                                                    >
                                                        Delete
                                                    </button>

                                                </span>

                                            </div>


                                            <p>
                                                ${escapeHTML(
                                                    x.text
                                                )}
                                            </p>

                                        </article>

                                    `
                                ).join("")
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


            bindDynamic();


            return;

        }


        // ==================================================
        // DEALS
        // ==================================================

        if (section === "deals") {

            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        Saved King Deals
                    </h1>


                    <p class="profile-sub">
                        Exclusive Grill House treats, ready when you are.
                    </p>


                    <article class="deal-card">

                        <h4>
                            WELCOME100 · ₹100 OFF
                        </h4>


                        <p>
                            Get ₹100 off when your eligible
                            order reaches ₹599.
                        </p>

                    </article>


                    <article class="deal-card">

                        <h4>
                            WELCOME299 · ₹299 OFF
                        </h4>


                        <p>
                            Get ₹299 off when your eligible
                            order reaches ₹1299.
                        </p>

                    </article>


                    <article class="deal-card">

                        <h4>
                            GRILL20 · 20% OFF
                        </h4>


                        <p>
                            Your saved Grill House deal.
                        </p>

                    </article>

                </div>

            `;


            return;

        }


        // ==================================================
        // WALL / ABOUT
        // ==================================================

        if (
            section === "wall" ||
            section === "about"
        ) {

            window.location.href =
                "about.html";

            return;

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
                            ? n.map(
                                x => `

                                    <article class="notice-card">

                                        <b>
                                            ${escapeHTML(
                                                x.title
                                            )}
                                        </b>


                                        <p>
                                            ${escapeHTML(
                                                x.text
                                            )}
                                        </p>


                                        <small>
                                            ${escapeHTML(
                                                x.date || ""
                                            )}
                                        </small>

                                    </article>

                                `
                            ).join("")
                            : empty(
                                "fa-solid fa-bell",
                                "You are all caught up",
                                "We’ll let you know when there is something worth tasting."
                            )
                    }

                </div>

            `;


            return;

        }


        // ==================================================
        // SUPPORT
        // ==================================================

        if (section === "support") {

            content.innerHTML = `

                <div class="profile-panel">

                    <h1>
                        FAQ's & Support
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


            return;

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


            return;

        }


        bindDynamic();

    }


    // ======================================================
// INITIAL RENDER
// ======================================================

render(
    "orders"
);


// ======================================================
// INITIAL DATABASE LOAD
// ======================================================

loadDatabaseOrders(
    true
);


// ======================================================
// SILENT AUTO REFRESH
// ======================================================

setInterval(
    function () {

        if (selectedOrder) {
            return;
        }


        if (
            document.querySelector(
                '[data-section="orders"].active'
            )
        ) {

            // ------------------------------------------
            // BACKGROUND CHECK ONLY
            // NO LOADING UI
            // NO UNNECESSARY RENDER
            // ------------------------------------------

            loadDatabaseOrders(
                false
            );

        }

    },
    15000
);

    // ======================================================
    // ABOUT BUTTON
    // ======================================================

    const aboutBtn =
        document.querySelector(
            '[data-section="about"]'
        );


    if (aboutBtn) {

        aboutBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "about.html";

            }
        );

    }


    // ======================================================
    // SAVED DEALS
    // ======================================================

    const savedDealsBtn =
        document.querySelector(
            '[data-section="deals"]'
        );


    if (savedDealsBtn) {

        savedDealsBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "special.html";

            }
        );

    }

});