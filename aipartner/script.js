/* =========================
   RUN AI ANALYSIS
========================= */

function runAnalysis() {

    if (analysisRunning) {
        return;
    }

    analysisRunning = true;

    const status =
        document.getElementById("analysisStatus");

    status.innerHTML = `
        <div class="status-icon">
            ◌
        </div>

        <div>

            <strong>
                AI is analyzing the design...
            </strong>

            <p>
                Checking accessibility, clarity and visual hierarchy
            </p>

        </div>

        <span class="status-time">
            Processing
        </span>
    `;


    setTimeout(function () {

        status.innerHTML = `
            <div class="status-icon">
                ✓
            </div>

            <div>

                <strong>
                    Analysis complete
                </strong>

                <p>
                    3 improvement opportunities detected
                </p>

            </div>

            <span class="status-time">
                Live
            </span>
        `;


        /* Change scores slightly */

        animateScore(
            "overallScore",
            82,
            88
        );

        animateScore(
            "accessScore",
            86,
            90
        );

        animateScore(
            "readScore",
            74,
            81
        );

        animateScore(
            "visualScore",
            91,
            94
        );


        document.getElementById("accessBar")
            .style.width = "90%";

        document.getElementById("readBar")
            .style.width = "81%";

        document.getElementById("visualBar")
            .style.width = "94%";


        analysisRunning = false;

    }, 1800);
}


/* =========================
   SCORE ANIMATION
========================= */

function animateScore(
    elementId,
    start,
    end
) {

    const element =
        document.getElementById(elementId);

    let current = start;

    const timer =
        setInterval(function () {

            current += 1;

            element.innerText =
                current;

            if (current >= end) {

                clearInterval(timer);

            }

        }, 35);
}


/* =========================
   SEND SUGGESTION
========================= */

function sendSuggestion(number) {

    const button =
        event.currentTarget;

    button.innerText =
        "✓ Sent to Designer";

    button.style.color =
        "#4ade80";

    button.style.borderColor =
        "#22c55e33";

    button.style.background =
        "#22c55e10";


    if (number === 1) {

        showNotification(
            "CTA recommendation sent to Designer"
        );

    } else {

        showNotification(
            "Heading recommendation sent to Designer"
        );

    }
}


/* =========================
   NOTIFICATION
========================= */

function showNotification(message) {

    const notification =
        document.createElement("div");

    notification.innerText =
        "✦ " + message;


    notification.style.position =
        "fixed";

    notification.style.right =
        "25px";

    notification.style.bottom =
        "25px";

    notification.style.padding =
        "13px 18px";

    notification.style.borderRadius =
        "10px";

    notification.style.background =
        "#111827";

    notification.style.color =
        "#c4b5fd";

    notification.style.border =
        "1px solid #8b5cf633";

    notification.style.boxShadow =
        "0 15px 40px #00000055";

    notification.style.fontSize =
        "11px";

    notification.style.zIndex =
        "9999";


    document.body.appendChild(
        notification
    );


    setTimeout(function () {

        notification.remove();

    }, 2500);
}


/* =========================
   SIDEBAR NAVIGATION
========================= */

const navItems =
    document.querySelectorAll(".nav-item");


navItems.forEach(function(item) {

    item.addEventListener(
        "click",
        function() {

            navItems.forEach(function(nav) {

                nav.classList.remove(
                    "active"
                );

            });

            item.classList.add(
                "active"
            );

        }
    );

});
