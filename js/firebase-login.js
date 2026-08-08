// ==========================================
// LOGIN OTP SYSTEM
// DEMO OTP = 123456
// ==========================================

console.log("OTP LOGIN JS LOADED ✅");

document.addEventListener("DOMContentLoaded", function () {

    const continueBtn = document.getElementById("continueBtn");
    const phoneInput = document.getElementById("txtPhone");

    const mobileBox = document.getElementById("mobileBox");
    const otpBox = document.getElementById("otpBox");

    const txtOTP = document.getElementById("txtOTP");

    const nameBox = document.getElementById("nameBox");
    const txtName = document.getElementById("txtName");

    const loginOverlay = document.getElementById("loginOverlay");

    let enteredMobile = "";
    let customerId = "";

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
    // INITIAL STATE
    // ==========================================

    otpBox.style.display = "none";

    if (nameBox) {
        nameBox.style.display = "none";
    }


    // ==========================================
    // CONTINUE BUTTON
    // ==========================================

    continueBtn.addEventListener("click", async function () {

        // ======================================
        // STEP 1 - MOBILE NUMBER
        // ======================================

        if (otpBox.style.display === "none") {

            const phone = phoneInput.value.trim();

            // Validate mobile
            if (!/^[0-9]{10}$/.test(phone)) {

                alert("Enter Valid 10 Digit Mobile Number");

                return;
            }

            enteredMobile = phone;

            console.log("Mobile:", enteredMobile);


            // ==================================
            // DEMO OTP
            // ==================================

            alert(
                "OTP Sent Successfully ✅\n\n" +
                "Demo OTP: 123456"
            );


            // Hide mobile
            mobileBox.style.display = "none";


            // Show OTP
            otpBox.style.display = "flex";


            // Change button
            continueBtn.innerText = "VERIFY OTP";


            // Focus OTP
            txtOTP.focus();

            return;
        }


        // ======================================
        // STEP 2 - VERIFY OTP
        // ======================================

        const otp = txtOTP.value.trim();


        if (!/^[0-9]{6}$/.test(otp)) {

            alert("Enter 6 Digit OTP");

            return;
        }


        // ==================================
        // DEMO OTP CHECK
        // ==================================

        if (otp !== "123456") {

            alert("Invalid OTP ❌");

            return;
        }


        console.log("OTP VERIFIED ✅");


        continueBtn.disabled = true;

        continueBtn.innerText = "CHECKING...";


        // ======================================
        // STEP 3 - CHECK CUSTOMER
        // ======================================

        try {

            const formData = new FormData();

            formData.append(
                "mobile",
                enteredMobile
            );


            const response = await fetch(
                "api/check_customer.php",
                {
                    method: "POST",
                    body: formData
                }
            );


            // ==================================
            // GET RAW PHP RESPONSE
            // ==================================

            const rawResponse = await response.text();

            console.log(
                "CHECK CUSTOMER RESPONSE:",
                rawResponse
            );


            // ==================================
            // EMPTY RESPONSE
            // ==================================

            if (!rawResponse.trim()) {

                alert(
                    "PHP se empty response aa raha hai."
                );

                continueBtn.disabled = false;

                continueBtn.innerText = "VERIFY OTP";

                return;
            }


            // ==================================
            // JSON PARSE
            // ==================================

            let data;

            try {

                data = JSON.parse(rawResponse);

            }
            catch (jsonError) {

                console.error(
                    "PHP RESPONSE JSON ERROR:",
                    rawResponse
                );

                alert(
                    "PHP se valid JSON response nahi aa raha.\n\n" +
                    "Browser Console check karo."
                );

                continueBtn.disabled = false;

                continueBtn.innerText = "VERIFY OTP";

                return;
            }


            console.log(
                "CUSTOMER DATA:",
                data
            );


            // ==================================
            // PHP STATUS FALSE
            // ==================================

            if (!data.status) {

                alert(
                    data.message ||
                    "Customer check failed"
                );

                continueBtn.disabled = false;

                continueBtn.innerText = "VERIFY OTP";

                return;
            }


            // ======================================
            // EXISTING CUSTOMER
            // ======================================

            if (data.exists === true) {

                customerId = data.customer_id;

                const customerName =
                    data.customer_name;


                console.log(
                    "Existing Customer:",
                    customerName
                );


                // Save customer information
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


                // Update last login
                await updateLastLogin(
                    customerId
                );


                alert(
                    "Welcome Back " +
                    customerName +
                    " ✅"
                );


                // Close login popup
                if (loginOverlay) {

                    loginOverlay.style.display = "none";

                }


                // Open profile
                window.location.href =
                    "profile.html";

                return;
            }


            // ======================================
            // NEW CUSTOMER
            // ======================================

            console.log(
                "New Customer - Name Required"
            );


            // Hide OTP
            otpBox.style.display = "none";


            // Show name box
            if (nameBox && txtName) {

                nameBox.style.display = "flex";


                continueBtn.disabled = false;

                continueBtn.innerText =
                    "SAVE & CONTINUE";


                txtName.value = "";

                txtName.focus();


                // ==================================
                // SAVE BUTTON
                // ==================================

                continueBtn.onclick = async function () {

                    const name =
                        txtName.value.trim();


                    if (name === "") {

                        alert(
                            "Please Enter Your Name"
                        );

                        return;
                    }


                    continueBtn.disabled = true;

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
                    "Name input nahi mila.\n\n" +
                    "HTML me nameBox aur txtName check karo."
                );

                continueBtn.disabled = false;

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

            continueBtn.disabled = false;

            continueBtn.innerText =
                "VERIFY OTP";

        }

    });


    // ==========================================
    // SAVE NEW CUSTOMER
    // ==========================================

    async function saveNewCustomer(
        name,
        mobile
    ) {

        try {

            const formData = new FormData();

            formData.append(
                "name",
                name
            );

            formData.append(
                "mobile",
                mobile
            );


            const response = await fetch(
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

                continueBtn.disabled = false;

                continueBtn.innerText =
                    "SAVE & CONTINUE";

                return;
            }


            let data;


            try {

                data = JSON.parse(
                    rawResponse
                );

            }
            catch (jsonError) {

                console.error(
                    "SAVE CUSTOMER JSON ERROR:",
                    rawResponse
                );

                alert(
                    "save_customer.php valid JSON nahi de raha."
                );

                continueBtn.disabled = false;

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

                continueBtn.disabled = false;

                continueBtn.innerText =
                    "SAVE & CONTINUE";

                return;
            }


            // ==================================
            // SAVE LOCAL LOGIN
            // ==================================

            customerId =
                data.customer_id;


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


            // Update last login
            await updateLastLogin(
                customerId
            );


            alert(
                "Profile Created Successfully ✅"
            );


            // Close popup
            if (loginOverlay) {

                loginOverlay.style.display =
                    "none";

            }


            // Open profile
            window.location.href =
                "profile.html";

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

            continueBtn.disabled = false;

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

            const formData = new FormData();

            formData.append(
                "customer_id",
                customerId
            );


            const response = await fetch(
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

});