// ===============================
// LOGIN / PROFILE SYSTEM
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");
    const loginPopup = document.getElementById("loginOverlay");
    const closePopupBtn = document.querySelector(".close-popup");
    if (loginBtn) {
        const isLoggedIn =localStorage.getItem("isLoggedIn") === "true";
        // ===========================
        // ALREADY LOGGED IN
        // ===========================
        if (isLoggedIn) {
            loginBtn.innerHTML ='<i class="fas fa-user-circle"></i> MY PROFILE';
            loginBtn.onclick = function () {
                window.location.href = "profile.html";
            };
        }
        // ===========================
        // NOT LOGGED IN
        // ===========================
        else {
            loginBtn.innerHTML ='<i class="fas fa-user"></i> LOGIN';
            loginBtn.onclick = function () {
                if (loginPopup) {
                    loginPopup.style.display = "flex";
                }
            };
        }
    }
    // ===============================
    // CLOSE LOGIN POPUP
    // ===============================
    if (closePopupBtn && loginPopup) {
        closePopupBtn.addEventListener("click", function () {
            loginPopup.style.display = "none";
        });
    }
    // ===============================
    // OUTSIDE CLICK CLOSE
    // ===============================
    if (loginPopup) {
        loginPopup.addEventListener("click", function (e) {
            if (e.target === loginPopup) {
                loginPopup.style.display = "none";
            }
        });
    }
});
// ===============================
// SLIDER AUTO PLAY
// ===============================
let index = 0;
function showSlides() {
    const slides =document.querySelectorAll(".slide");
    if (slides.length === 0) return;
    slides.forEach(function (slide) {
        slide.style.display = "none";
    });
    index++;
    if (index > slides.length) {
        index = 1;
    }
    slides[index - 1].style.display = "block";
    setTimeout(showSlides, 4000);
}
// ===============================
// SEARCH BUTTON
// ===============================
function openSearch() {
    window.location.href = "search.html";
}
// ===============================
// SEARCH CLEAR BUTTON
// ===============================
function showClearButton() {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("clearBtn");
    if (!input || !btn) return;
    btn.style.display =input.value.length > 0? "block" : "none";
}
function clearSearch() {
    const input =document.getElementById("searchInput");
    const btn = document.getElementById("clearBtn");
    if (!input || !btn) return;
    input.value = "";
    btn.style.display = "none";
    input.focus();
}
// ===============================
// MENU HORIZONTAL SCROLL
// ===============================
function scrollMenu(direction) {
    const container =document.getElementById("menuScroll");
    if (!container) return;
    const scrollAmount =container.offsetWidth / 1.5;
    if (direction === "left") {
        container.scrollBy({
            left: -scrollAmount,
            behavior: "smooth"
        });
    } else {container.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        });
    }
}
// ===============================
// SCROLL REVEAL
// ===============================
const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length > 0) {
    const revealObserver =new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, 
        {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        });
    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });
}
// ===============================
// COUNTER ANIMATION
// ===============================
const statNumbers = document.querySelectorAll(".stat-number[data-target]");
let countersStarted = false;
function animateCounters() {
    if (countersStarted) return;  
      countersStarted = true;
    statNumbers.forEach(function (el) {
        const target = parseInt(el.getAttribute("data-target"));
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 1600;
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration,1);
            const eased = 1 - Math.pow(1 - progress,3);
            const current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(
                    updateCount
                );
            } else {
                el.textContent = target + suffix;
            }
        }
        requestAnimationFrame(updateCount);
    });
}
// ===============================
// STATS OBSERVER
// ===============================
const statsSection = document.querySelector(".stats-section");
if (statsSection) {
    const statsObserver = new IntersectionObserver(
            function (entries) {
                 entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounters();
                        statsObserver.unobserve(
                            entry.target
                        );
                     }
                });
            },
            {
                threshold: 0.3
            }
        );
    statsObserver.observe(statsSection);
}
// ===============================
// PAGE INITIALIZATION
// ===============================
document.addEventListener(
    "DOMContentLoaded",
    function () {
        // Slider
        showSlides();
        // ===========================
        // NAVBAR ACTIVE
        // ===========================
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach(function (item) {
            item.addEventListener(
            "click",
                function () {
                    navItems.forEach(function (i) {
                        i.classList.remove(
                            "active"
                        );
                    });
                    this.classList.add("active");
                }
            );
        });
    }
);

// ==========================================
// ORDER TYPE POPUP
//// ==========================================
// ORDER TYPE POPUP
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const popup = document.getElementById("servicePopup");
    const toggle = document.querySelector(".toggle-container");

    const orderType = localStorage.getItem("orderType");

    // First Visit
    if (!orderType) {
        popup.style.display = "flex";
        return;
    }

    // Hide Popup
    // popup.style.display = "none";

    // Set Navbar Toggle
    if (orderType === "takeaway") {
        toggle.classList.add("switched");
    } else {
        toggle.classList.remove("switched");   // Default = Dine In
    }

});


// ==========================================
// SELECT SERVICE
// ==========================================

function selectService(type) {

    const popup = document.getElementById("servicePopup");
    const toggle = document.querySelector(".toggle-container");

    // Save Selection
    localStorage.setItem("orderType", type);

    // Toggle Update
    if (type === "takeaway") {
        toggle.classList.add("switched");
    } else {
        toggle.classList.remove("switched");
    }

    // Close Popup
    popup.style.display = "none";

}


// ==========================================
// CLOSE POPUP
// ==========================================

function closePopup() {
    document.getElementById("servicePopup").style.display = "flex";
}


// ==========================================
// NAVBAR TOGGLE
// ==========================================

function toggleMode() {

    const toggle = document.querySelector(".toggle-container");

    toggle.classList.toggle("switched");

    if (toggle.classList.contains("switched")) {
        localStorage.setItem("orderType", "takeaway");
    } else {
        localStorage.setItem("orderType", "dinein");
    }

}