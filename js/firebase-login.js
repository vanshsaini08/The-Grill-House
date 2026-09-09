// ==========================================
// LOGIN OTP SYSTEM
// DEMO OTP = 123456
// ==========================================

console.log("OTP LOGIN JS LOADED ✅");


document.addEventListener("DOMContentLoaded", function () {

    const continueBtn =
        document.getElementById("continueBtn");

    const phoneInput =
        document.getElementById("txtPhone");

    const mobileBox =
        document.getElementById("mobileBox");

    const otpBox =
        document.getElementById("otpBox");

    const txtOTP =
        document.getElementById("txtOTP");

    const nameBox =
        document.getElementById("nameBox");

    const txtName =
        document.getElementById("txtName");

    const loginOverlay =
        document.getElementById("loginOverlay");


    // ==========================================
    // CHECK HTML ELEMENTS
    // ==========================================

    if (!continueBtn) {
        console.error("continueBtn not found ❌");
        return;
    }

    if (!phoneInput) {
        console.error("txtPhone not found ❌");
        return;
    }

    if (!mobileBox) {
        console.error("mobileBox not found ❌");
        return;
    }

    if (!otpBox) {
        console.error("otpBox not found ❌");
        return;
    }

    if (!txtOTP) {
        console.error("txtOTP not found ❌");
        return;
    }


    // ==========================================
    // VARIABLES
    // ==========================================

    let enteredMobile = "";
    let customerId = "";


    // ==========================================
    // INITIAL STATE
    // ==========================================

    otpBox.style.display = "none";

    if (nameBox) {
        nameBox.style.display = "none";
    }


    // ==========================================
    // CONTINUE BUTTON
    // ==========================================

    continueBtn.addEventListener(
        "click",
        async function () {

            // ======================================
            // STEP 1 - MOBILE
            // ======================================

            if (
                otpBox.style.display === "none" &&
                (!nameBox ||
                 nameBox.style.display === "none")
            ) {

                const phone =
                    phoneInput.value.trim();


                if (!/^[0-9]{10}$/.test(phone)) {

                    alert(
                        "Enter Valid 10 Digit Mobile Number"
                    );

                    return;
                }


                enteredMobile = phone;


                console.log(
                    "Mobile:",
                    enteredMobile
                );


                // ==================================
                // DEMO OTP
                // ==================================

                alert(
                    "OTP Sent Successfully ✅\n\n" +
                    "Demo OTP: 123456"
                );


                mobileBox.style.display = "none";

                otpBox.style.display = "flex";

                continueBtn.innerText =
                    "VERIFY OTP";

                txtOTP.focus();

                return;
            }


            // ======================================
            // STEP 2 - VERIFY OTP
            // ======================================

            if (
                otpBox.style.display !== "none" &&
                (!nameBox ||
                 nameBox.style.display === "none")
            ) {

                const otp =
                    txtOTP.value.trim();


                if (!/^[0-9]{6}$/.test(otp)) {

                    alert(
                        "Enter 6 Digit OTP"
                    );

                    return;
                }


                if (otp !== "123456") {

                    alert(
                        "Invalid OTP ❌"
                    );

                    return;
                }


                console.log(
                    "OTP VERIFIED ✅"
                );


                continueBtn.disabled = true;

                continueBtn.innerText =
                    "CHECKING...";


                // ==================================
                // CHECK CUSTOMER
                // ==================================

                try {

                    const formData =
                        new FormData();


                    formData.append(
                        "mobile",
                        enteredMobile
                    );


                    const response =
                        await fetch(
                            "api/check_customer.php",
                            {
                                method: "POST",
                                body: formData
                            }
                        );


                    const rawResponse =
                        await response.text();


                    console.log(
                        "CHECK CUSTOMER RESPONSE:",
                        rawResponse
                    );


                    if (!rawResponse.trim()) {

                        alert(
                            "PHP se empty response aa raha hai."
                        );

                        continueBtn.disabled = false;

                        continueBtn.innerText =
                            "VERIFY OTP";

                        return;
                    }


                    let data;


                    try {

                        data =
                            JSON.parse(rawResponse);

                    }
                    catch (jsonError) {

                        console.error(
                            "PHP JSON ERROR:",
                            rawResponse
                        );

                        alert(
                            "PHP se valid JSON response nahi aa raha."
                        );

                        continueBtn.disabled = false;

                        continueBtn.innerText =
                            "VERIFY OTP";

                        return;
                    }


                    console.log(
                        "CUSTOMER DATA:",
                        data
                    );


                    if (!data.status) {

                        alert(
                            data.message ||
                            "Customer check failed"
                        );

                        continueBtn.disabled = false;

                        continueBtn.innerText =
                            "VERIFY OTP";

                        return;
                    }


                    // ======================================
                    // EXISTING CUSTOMER
                    // ======================================

                    if (data.exists === true) {

                        customerId =
                            data.customer_id;


                        const customerName =
                            data.customer_name;


                        console.log(
                            "Existing Customer:",
                            customerName
                        );


                        // ==================================
                        // SAVE LOGIN
                        // ==================================

                        localStorage.setItem(
                            "customerId",
                            customerId
                        );

                        localStorage.setItem(
                            "customerName",
                            customerName
                        );

                        localStorage.setItem(
                            "customerPhone",
                            enteredMobile
                        );

                        localStorage.setItem(
                            "isLoggedIn",
                            "true"
                        );


                        // ==================================
                        // UPDATE LAST LOGIN
                        // ==================================

                        await updateLastLogin(
                            customerId
                        );


                        alert(
                            "Welcome Back " +
                            customerName +
                            " ✅"
                        );


                        // ==================================
                        // CLOSE LOGIN POPUP
                        // ==================================

                        if (loginOverlay) {

                            loginOverlay.style.display =
                                "none";

                        }


                        // ==================================
                        // UPDATE CART LOGIN STATE
                        // ==================================

                        if (
                            typeof updateCartLoginState ===
                            "function"
                        ) {

                            updateCartLoginState();

                        }


                        // ==================================
                        // AFTER LOGIN
                        // ==================================

                        redirectAfterLogin();


                        return;
                    }


                    // ======================================
                    // NEW CUSTOMER
                    // ======================================

                    console.log(
                        "New Customer - Name Required"
                    );


                    otpBox.style.display =
                        "none";


                    if (nameBox && txtName) {

                        nameBox.style.display =
                            "flex";


                        continueBtn.disabled =
                            false;


                        continueBtn.innerText =
                            "SAVE & CONTINUE";


                        txtName.value = "";

                        txtName.focus();


                        // ==================================
                        // NEW CUSTOMER SAVE
                        // ==================================

                        continueBtn.onclick =
                            async function () {

                                const name =
                                    txtName.value.trim();


                                if (name === "") {

                                    alert(
                                        "Please Enter Your Name"
                                    );

                                    return;
                                }


                                continueBtn.disabled =
                                    true;


                                continueBtn.innerText =
                                    "SAVING...";


                                await saveNewCustomer(
                                    name,
                                    enteredMobile
                                );

                            };

                    }
                    else {

                        alert(
                            "Name input nahi mila."
                        );

                        continueBtn.disabled =
                            false;

                        continueBtn.innerText =
                            "VERIFY OTP";

                    }

                }
                catch (error) {

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );


                    alert(
                        "Something went wrong:\n\n" +
                        error.message
                    );


                    continueBtn.disabled =
                        false;

                    continueBtn.innerText =
                        "VERIFY OTP";

                }


                return;
            }

        }
    );


    // ==========================================
    // SAVE NEW CUSTOMER
    // ==========================================

    async function saveNewCustomer(
        name,
        mobile
    ) {

        try {

            const formData =
                new FormData();


            formData.append(
                "name",
                name
            );


            formData.append(
                "mobile",
                mobile
            );


            const response =
                await fetch(
                    "api/save_customer.php",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const rawResponse =
                await response.text();


            console.log(
                "SAVE CUSTOMER RESPONSE:",
                rawResponse
            );


            if (!rawResponse.trim()) {

                alert(
                    "save_customer.php se empty response aa raha hai."
                );

                continueBtn.disabled =
                    false;

                continueBtn.innerText =
                    "SAVE & CONTINUE";

                return;
            }


            let data;


            try {

                data =
                    JSON.parse(rawResponse);

            }
            catch (jsonError) {

                console.error(
                    "SAVE CUSTOMER JSON ERROR:",
                    rawResponse
                );

                alert(
                    "save_customer.php valid JSON nahi de raha."
                );

                continueBtn.disabled =
                    false;

                continueBtn.innerText =
                    "SAVE & CONTINUE";

                return;
            }


            console.log(
                "SAVE CUSTOMER DATA:",
                data
            );


            if (!data.status) {

                alert(
                    data.message ||
                    "Customer save failed"
                );

                continueBtn.disabled =
                    false;

                continueBtn.innerText =
                    "SAVE & CONTINUE";

                return;
            }


            // ==================================
            // CUSTOMER ID
            // ==================================

            customerId =
                data.customer_id;


            // ==================================
            // SAVE LOGIN DETAILS
            // ==================================

            localStorage.setItem(
                "customerId",
                customerId
            );

            localStorage.setItem(
                "customerName",
                name
            );

            localStorage.setItem(
                "customerPhone",
                mobile
            );

            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            // ==================================
            // UPDATE LAST LOGIN
            // ==================================

            await updateLastLogin(
                customerId
            );


            alert(
                "Profile Created Successfully ✅"
            );


            // ==================================
            // CLOSE POPUP
            // ==================================

            if (loginOverlay) {

                loginOverlay.style.display =
                    "none";

            }


            // ==================================
            // UPDATE CART LOGIN STATE
            // ==================================

            if (
                typeof updateCartLoginState ===
                "function"
            ) {

                updateCartLoginState();

            }


            // ==================================
            // AFTER LOGIN
            // ==================================

            redirectAfterLogin();

        }
        catch (error) {

            console.error(
                "SAVE CUSTOMER ERROR:",
                error
            );


            alert(
                "Unable to save customer:\n\n" +
                error.message
            );


            continueBtn.disabled =
                false;

            continueBtn.innerText =
                "SAVE & CONTINUE";

        }

    }


    // ==========================================
    // UPDATE LAST LOGIN
    // ==========================================

    async function updateLastLogin(
        customerId
    ) {

        try {

            const formData =
                new FormData();


            formData.append(
                "customer_id",
                customerId
            );


            const response =
                await fetch(
                    "api/update_last_login.php",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const rawResponse =
                await response.text();


            console.log(
                "LAST LOGIN RESPONSE:",
                rawResponse
            );

        }
        catch (error) {

            console.error(
                "LAST LOGIN ERROR:",
                error
            );

        }

    }


    // ==========================================
    // REDIRECT AFTER LOGIN
    // ==========================================

    function redirectAfterLogin() {

        /*
        Agar user checkout se login kar raha hai
        to checkout par hi wapas jayega.
        */

        const returnPage =
            sessionStorage.getItem(
                "loginReturnPage"
            );


        if (returnPage) {

            sessionStorage.removeItem(
                "loginReturnPage"
            );


            window.location.href =
                returnPage;

            return;

        }


        /*
        Normal navbar login
        */

        window.location.href =
            "profile.html";

    }

});