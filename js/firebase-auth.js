// ===============================
// LOGIN OTP SYSTEM
// DEMO OTP - 123456
// ===============================

const continueBtn = document.getElementById("continueBtn");

const phoneInput = document.getElementById("txtPhone");
const otpBox = document.getElementById("otpBox");
const mobileBox = document.getElementById("mobileBox");
const txtOTP = document.getElementById("txtOTP");

let enteredMobile = "";

// ===============================
// CONTINUE BUTTON
// ===============================

continueBtn.addEventListener("click", async function () {

    // ===========================
    // STEP 1 - SEND OTP
    // ===========================

    if (otpBox.style.display === "none" || otpBox.style.display === "") {

        const phone = phoneInput.value.trim();

        if (!/^[0-9]{10}$/.test(phone)) {

            alert("Enter Valid 10 Digit Mobile Number");
            return;

        }

        enteredMobile = phone;

        try {

            const formData = new FormData();

            formData.append("mobile", phone);

            const response = await fetch("send_otp.php", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            console.log("OTP Response:", data);

            if (!data.status) {

                alert(data.message);
                return;

            }

            // Hide mobile
            mobileBox.style.display = "none";

            // Show OTP
            otpBox.style.display = "flex";

            // Change button
            continueBtn.innerText = "VERIFY OTP";

            // Focus OTP
            txtOTP.focus();

            alert("OTP Sent Successfully");

        }
        catch (error) {

            console.error(error);

            alert("Unable to send OTP");

        }

    }

    // ===========================
    // STEP 2 - VERIFY OTP
    // ===========================

    else {

        const otp = txtOTP.value.trim();

        if (otp.length !== 6) {

            alert("Enter 6 Digit OTP");
            return;

        }

        // Demo OTP
        if (otp !== "123456") {

            alert("Invalid OTP");
            return;

        }

        alert("OTP Verified Successfully ✅");

        console.log("Verified Mobile:", enteredMobile);

    }

});