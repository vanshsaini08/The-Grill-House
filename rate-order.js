// ======================================================
// THE GRILL HOUSE
// RATE YOUR ORDER
// ======================================================

(function () {

    "use strict";


    // ==================================================
    // RATING DATA
    // ==================================================

    const ratings = {

        1: {
            emoji: "😡",
            text: "Very Bad"
        },

        2: {
            emoji: "😞",
            text: "Not Good"
        },

        3: {
            emoji: "😐",
            text: "It Was Okay"
        },

        4: {
            emoji: "😊",
            text: "Really Good"
        },

        5: {
            emoji: "🤩",
            text: "Excellent!"
        }

    };


    let currentOrderId = null;
    let selectedRating = 3;


    // ==================================================
    // RATED ORDERS STORAGE
    // ==================================================

    function saveRatedOrder(orderId) {

        const customerId =
            localStorage.getItem(
                "customerId"
            ) || "";


        if (!customerId || !orderId) {
            return;
        }


        const key =
            `grillHouseRatedOrders_${customerId}`;


        let ratedOrders = [];


        try {

            ratedOrders =
                JSON.parse(
                    localStorage.getItem(
                        key
                    ) || "[]"
                );


            if (
                !Array.isArray(
                    ratedOrders
                )
            ) {

                ratedOrders = [];

            }

        } catch (error) {

            ratedOrders = [];

        }


        const orderID =
            String(orderId);


        if (
            !ratedOrders
                .map(String)
                .includes(orderID)
        ) {

            ratedOrders.push(
                orderID
            );

        }


        localStorage.setItem(
            key,
            JSON.stringify(
                ratedOrders
            )
        );

    }


    // ==================================================
    // REMOVE RATE BUTTON
    // ==================================================

    function removeRateButton(
        orderId
    ) {

        if (!orderId) {
            return;
        }


        document
            .querySelectorAll(
                "[data-rate-order]"
            )
            .forEach(
                function (button) {

                    if (
                        String(
                            button.dataset.rateOrder
                        ) ===
                        String(orderId)
                    ) {

                        button.remove();

                    }

                }
            );

    }


    // ==================================================
    // ADD CSS
    // ==================================================

    function addRatingStyles() {

        if (
            document.getElementById(
                "grillHouseRatingStyles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "grillHouseRatingStyles";


        style.textContent = `

            .gh-rating-overlay {

                position: fixed;

                inset: 0;

                background:
                    rgba(0, 0, 0, 0.58);

                display: flex;

                align-items: center;

                justify-content: center;

                padding: 20px;

                z-index: 999999;

                animation:
                    ghRatingFade
                    0.2s ease;

            }


            .gh-rating-box {

                width: 100%;

                max-width: 470px;

                background: #fdfbf8;

                border-radius: 7px;

                padding:
                    24px
                    20px
                    20px;

                box-sizing: border-box;

                text-align: center;

                position: relative;

                box-shadow:
                    0 20px 60px
                    rgba(0,0,0,0.25);

                animation:
                    ghRatingUp
                    0.25s ease;

            }


            .gh-rating-close {

                position: absolute;

                top: 10px;

                right: 12px;

                width: 30px;

                height: 30px;

                border: none;

                background: transparent;

                color: #502314;

                font-size: 22px;

                cursor: pointer;

                line-height: 30px;

            }


            .gh-rating-burger {

                font-size: 72px;

                line-height: 1;

                margin:
                    4px
                    0
                    25px;

            }


            .gh-rating-title {

                margin: 0;

                color: #111;

                font-family:
                    Georgia,
                    "Times New Roman",
                    serif;

                font-size: 18px;

                font-weight: 800;

                letter-spacing: 0.2px;

            }


            .gh-rating-subtitle {

                margin:
                    7px
                    0
                    22px;

                color: #777;

                font-size: 11px;

            }


            .gh-rating-emoji {

                width: 82px;

                height: 82px;

                margin:
                    0
                    auto
                    12px;

                display: flex;

                align-items: center;

                justify-content: center;

                font-size: 64px;

                line-height: 1;

                transition:
                    transform
                    0.2s
                    ease;

            }


            .gh-rating-emoji.pop {

                transform:
                    scale(1.16);

            }


            .gh-rating-text {

                min-height: 20px;

                color: #502314;

                font-size: 13px;

                font-weight: 700;

                margin-bottom: 16px;

            }


            .gh-rating-slider-wrap {

                width: 100%;

                padding:
                    0
                    3px;

                box-sizing: border-box;

            }


            .gh-rating-slider {

                width: 100%;

                height: 6px;

                appearance: none;

                -webkit-appearance: none;

                cursor: pointer;

                border-radius: 10px;

                outline: none;

                background:
                    linear-gradient(
                        to right,
                        #743b2d 50%,
                        #dddddd 50%
                    );

            }


            .gh-rating-slider::-webkit-slider-thumb {

                appearance: none;

                -webkit-appearance: none;

                width: 21px;

                height: 21px;

                border-radius: 50%;

                background: #ffffff;

                border:
                    1px solid #bdbdbd;

                box-shadow:
                    0
                    1px
                    4px
                    rgba(0,0,0,0.12);

                cursor: pointer;

            }


            .gh-rating-slider::-moz-range-thumb {

                width: 21px;

                height: 21px;

                border-radius: 50%;

                background: #ffffff;

                border:
                    1px solid #bdbdbd;

                box-shadow:
                    0
                    1px
                    4px
                    rgba(0,0,0,0.12);

                cursor: pointer;

            }


            .gh-rating-numbers {

                display: flex;

                justify-content: space-between;

                align-items: flex-start;

                margin-top: 10px;

                padding:
                    0
                    1px;

            }


            .gh-rating-number {

                width: 24px;

                color: #222;

                font-size: 12px;

                font-weight: 500;

                position: relative;

            }


            .gh-rating-number::before {

                content: "";

                display: block;

                width: 4px;

                height: 4px;

                border-radius: 50%;

                background: #111;

                margin:
                    0
                    auto
                    6px;

            }


            .gh-rating-number.active {

                color: #743b2d;

                font-weight: 800;

            }


            .gh-rating-number.active::before {

                background: #743b2d;

                transform:
                    scale(1.35);

            }


            .gh-rating-submit {

                margin-top: 20px;

                min-width: 105px;

                height: 42px;

                padding:
                    0
                    22px;

                border: none;

                border-radius: 22px;

                background: #743b2d;

                color: #ffffff;

                font-size: 12px;

                font-weight: 800;

                cursor: pointer;

                transition:
                    transform
                    0.15s ease,
                    background
                    0.15s ease;

            }


            .gh-rating-submit:hover {

                background: #5d2d22;

                transform:
                    translateY(-1px);

            }


            .gh-rating-submit:active {

                transform:
                    scale(0.97);

            }


            .gh-rating-success {

                padding:
                    25px
                    10px
                    10px;

            }


            .gh-rating-success-emoji {

                font-size: 58px;

                margin-bottom: 12px;

            }


            .gh-rating-success-title {

                color: #502314;

                font-size: 17px;

                font-weight: 800;

            }


            .gh-rating-success-text {

                color: #777;

                font-size: 12px;

                margin-top: 7px;

            }


            @keyframes ghRatingFade {

                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }

            }


            @keyframes ghRatingUp {

                from {

                    opacity: 0;

                    transform:
                        translateY(15px)
                        scale(0.97);

                }

                to {

                    opacity: 1;

                    transform:
                        translateY(0)
                        scale(1);

                }

            }


            @media (max-width: 480px) {

                .gh-rating-overlay {

                    padding: 12px;

                }


                .gh-rating-box {

                    max-width: 100%;

                    padding:
                        22px
                        16px
                        18px;

                }


                .gh-rating-burger {

                    font-size: 62px;

                    margin-bottom: 20px;

                }


                .gh-rating-title {

                    font-size: 16px;

                }


                .gh-rating-emoji {

                    font-size: 58px;

                    width: 72px;

                    height: 72px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    // ==================================================
    // CREATE POPUP
    // ==================================================

    function createRatingPopup(
        orderId
    ) {

        closeRatingPopup();


        currentOrderId =
            String(
                orderId || ""
            );


        const overlay =
            document.createElement(
                "div"
            );


        overlay.className =
            "gh-rating-overlay";


        overlay.id =
            "ghRatingOverlay";


        overlay.innerHTML = `

            <div
                class="gh-rating-box"
                role="dialog"
                aria-modal="true"
                aria-label="Rate your order"
            >

                <button
                    type="button"
                    class="gh-rating-close"
                    id="ghRatingClose"
                    aria-label="Close"
                >
                    ×
                </button>


                <div class="gh-rating-burger">
                    🍔
                </div>


                <h2 class="gh-rating-title">
                    RATE YOUR EXPERIENCE
                </h2>


                <div class="gh-rating-subtitle">
                    How was your order?
                </div>


                <div
                    class="gh-rating-emoji"
                    id="ghRatingEmoji"
                >
                    😐
                </div>


                <div
                    class="gh-rating-text"
                    id="ghRatingText"
                >
                    It Was Okay
                </div>


                <div class="gh-rating-slider-wrap">

                    <input
                        type="range"
                        id="ghRatingSlider"
                        class="gh-rating-slider"
                        min="1"
                        max="5"
                        step="1"
                        value="3"
                    >


                    <div
                        class="gh-rating-numbers"
                        id="ghRatingNumbers"
                    >

                        <span
                            class="gh-rating-number"
                            data-rating-number="1"
                        >
                            1
                        </span>

                        <span
                            class="gh-rating-number"
                            data-rating-number="2"
                        >
                            2
                        </span>

                        <span
                            class="gh-rating-number active"
                            data-rating-number="3"
                        >
                            3
                        </span>

                        <span
                            class="gh-rating-number"
                            data-rating-number="4"
                        >
                            4
                        </span>

                        <span
                            class="gh-rating-number"
                            data-rating-number="5"
                        >
                            5
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    class="gh-rating-submit"
                    id="ghRatingSubmit"
                >
                    SUBMIT
                </button>

            </div>

        `;


        document.body.appendChild(
            overlay
        );


        bindRatingEvents();


        updateRatingUI(3);

    }


    // ==================================================
    // UPDATE RATING UI
    // ==================================================

    function updateRatingUI(
        rating
    ) {

        selectedRating =
            Number(rating);


        const data =
            ratings[
                selectedRating
            ];


        if (!data) {
            return;
        }


        const emoji =
            document.getElementById(
                "ghRatingEmoji"
            );


        const text =
            document.getElementById(
                "ghRatingText"
            );


        const slider =
            document.getElementById(
                "ghRatingSlider"
            );


        if (
            emoji &&
            text &&
            slider
        ) {

            emoji.classList.remove(
                "pop"
            );


            void emoji.offsetWidth;


            emoji.textContent =
                data.emoji;


            text.textContent =
                data.text;


            slider.value =
                selectedRating;


            const percentage =
                (
                    (selectedRating - 1)
                    / 4
                ) * 100;


            slider.style.background =
                `
                    linear-gradient(
                        to right,
                        #743b2d
                        ${percentage}%,
                        #dddddd
                        ${percentage}%
                    )
                `;


            emoji.classList.add(
                "pop"
            );

        }


        document
            .querySelectorAll(
                ".gh-rating-number"
            )
            .forEach(
                number => {

                    const value =
                        Number(
                            number.dataset
                                .ratingNumber
                        );


                    number.classList.toggle(
                        "active",
                        value ===
                        selectedRating
                    );

                }
            );

    }


    // ==================================================
    // BIND POPUP EVENTS
    // ==================================================

    function bindRatingEvents() {

        const overlay =
            document.getElementById(
                "ghRatingOverlay"
            );


        const close =
            document.getElementById(
                "ghRatingClose"
            );


        const slider =
            document.getElementById(
                "ghRatingSlider"
            );


        const submit =
            document.getElementById(
                "ghRatingSubmit"
            );


        if (close) {

            close.onclick =
                function () {

                    closeRatingPopup();

                };

        }


        if (overlay) {

            overlay.onclick =
                function (event) {

                    if (
                        event.target ===
                        overlay
                    ) {

                        closeRatingPopup();

                    }

                };

        }


        if (slider) {

            slider.oninput =
                function () {

                    updateRatingUI(
                        this.value
                    );

                };

        }


        document
            .querySelectorAll(
                ".gh-rating-number"
            )
            .forEach(
                number => {

                    number.onclick =
                        function () {

                            updateRatingUI(
                                this.dataset
                                    .ratingNumber
                            );

                        };

                }
            );


        if (submit) {

            submit.onclick =
                function () {

                    submitRating();

                };

        }


        document.onkeydown =
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeRatingPopup();

                }

            };

    }


    // ==================================================
    // SUBMIT RATING
    // ==================================================

    function submitRating() {

        const box =
            document.querySelector(
                ".gh-rating-box"
            );


        if (!box) {
            return;
        }


        const data =
            ratings[
                selectedRating
            ];


        // --------------------------------------------------
        // SAVE RATED ORDER PERMANENTLY
        // --------------------------------------------------

        if (currentOrderId) {

            saveRatedOrder(
                currentOrderId
            );


            // ------------------------------------------------
            // REMOVE BUTTON IMMEDIATELY
            // ------------------------------------------------

            removeRateButton(
                currentOrderId
            );

        }


        // --------------------------------------------------
        // SHOW THANK YOU
        // --------------------------------------------------

        box.innerHTML = `

            <div class="gh-rating-success">

                <div class="gh-rating-success-emoji">
                    ${data.emoji}
                </div>

                <div class="gh-rating-success-title">
                    Thank You!
                </div>

                <div class="gh-rating-success-text">
                    Your feedback means a lot to us.
                </div>

            </div>

        `;


        // --------------------------------------------------
        // CLOSE POPUP
        // --------------------------------------------------

        setTimeout(
            function () {

                closeRatingPopup();

            },
            1400
        );

    }


    // ==================================================
    // OPEN RATING POPUP
    // ==================================================

    function openRatingPopup(
        orderId
    ) {

        addRatingStyles();


        createRatingPopup(
            orderId
        );

    }


    // ==================================================
    // CLOSE RATING POPUP
    // ==================================================

    function closeRatingPopup() {

        const overlay =
            document.getElementById(
                "ghRatingOverlay"
            );


        if (overlay) {

            overlay.remove();

        }


        currentOrderId =
            null;

    }


    // ==================================================
    // RATE ORDER CLICK
    // ==================================================

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-rate-order]"
                );


            if (!button) {
                return;
            }


            event.preventDefault();


            event.stopPropagation();


            const orderId =
                button.dataset.rateOrder;


            // ------------------------------------------------
            // EXTRA SAFETY:
            // DON'T OPEN RATING AGAIN
            // ------------------------------------------------

            const customerId =
                localStorage.getItem(
                    "customerId"
                ) || "";


            if (customerId) {

                const key =
                    `grillHouseRatedOrders_${customerId}`;


                let ratedOrders = [];


                try {

                    ratedOrders =
                        JSON.parse(
                            localStorage.getItem(
                                key
                            ) || "[]"
                        );


                    if (
                        !Array.isArray(
                            ratedOrders
                        )
                    ) {

                        ratedOrders = [];

                    }

                } catch (error) {

                    ratedOrders = [];

                }


                if (
                    ratedOrders
                        .map(String)
                        .includes(
                            String(orderId)
                        )
                ) {

                    button.remove();

                    return;

                }

            }


            openRatingPopup(
                orderId
            );

        },
        true
    );


})();