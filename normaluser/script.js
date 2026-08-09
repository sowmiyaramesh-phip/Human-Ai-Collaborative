/* =================================
   AI STATUS
================================= */

setTimeout(function () {

    document.getElementById("aiStatus").innerHTML =
        "✓ Design analyzed — I found an opportunity to improve it.";

}, 1800);


/* =================================
   ADD TEXT
================================= */

function addText() {

    const text = document.createElement("div");

    text.innerText = "✨ New Text";

    text.style.padding = "25px";

    text.style.textAlign = "center";

    text.style.fontSize = "24px";

    text.style.fontWeight = "700";

    document.getElementById("canvas")
        .appendChild(text);

    addHistory("Added new text");
}


/* =================================
   ADD BUTTON
================================= */

function addButton() {

    const button = document.createElement("button");

    button.innerText = "New Button";

    button.style.display = "block";

    button.style.margin = "20px auto";

    button.style.padding = "12px 25px";

    button.style.border = "none";

    button.style.borderRadius = "9px";

    button.style.background = "#7c3aed";

    button.style.color = "white";

    button.style.cursor = "pointer";

    document.getElementById("canvas")
        .appendChild(button);

    addHistory("Added new button");
}


/* =================================
   ADD IMAGE
================================= */

function addImage() {

    const image = document.createElement("div");

    image.innerHTML =
        "🖼️ <br><br> Image Placeholder";

    image.style.margin = "20px";

    image.style.padding = "40px";

    image.style.textAlign = "center";

    image.style.borderRadius = "12px";

    image.style.background = "#ede9fe";

    image.style.color = "#7c3aed";

    document.getElementById("canvas")
        .appendChild(image);

    addHistory("Added image placeholder");
}


/* =================================
   ADD SECTION
================================= */

function addSection() {

    const section = document.createElement("section");

    section.innerHTML = `
        <h2>New Design Section</h2>
        <p>Created by the designer.</p>
    `;

    section.style.padding = "50px";

    section.style.textAlign = "center";

    section.style.background = "#f8fafc";

    document.getElementById("canvas")
        .appendChild(section);

    addHistory("Added new section");
}


/* =================================
   APPLY AI SUGGESTION
================================= */

function applySuggestion() {

    const button =
        document.getElementById("mainButton");

    /* ACTUAL DESIGN CHANGE */

    button.style.background =
        "linear-gradient(135deg,#7c3aed,#ec4899)";

    button.style.padding =
        "16px 34px";

    button.style.boxShadow =
        "0 10px 30px rgba(124,58,237,.35)";

    button.innerText =
        "Register Now →";


    /* UPDATE STATUS */

    document.getElementById("aiStatus").innerHTML =
        "✓ Suggestion applied successfully.";


    /* UPDATE HISTORY */

    addHistory(
        "AI suggestion accepted"
    );


    /* CHANGE AI CARD */

    document.getElementById("suggestion").innerHTML = `

        <div class="suggestion-label">
            ✓ APPLIED
        </div>

        <h3 style="color:#4ade80;">
            Design improved
        </h3>

        <p>
            The primary action is now
            more visually prominent.
        </p>

        <div class="why">

            <strong>
                🤝 Human + AI
            </strong>

            <span>
                AI suggested the improvement.
                You made the final decision.
            </span>

        </div>

    `;
}


/* =================================
   MODIFY AI SUGGESTION
================================= */

function modifySuggestion() {

    const newText =
        prompt(
            "How would you like to modify the suggestion?"
        );

    if (!newText) return;


    const button =
        document.getElementById("mainButton");


    button.innerText =
        newText;


    addHistory(
        "User modified AI suggestion"
    );


    document.getElementById("aiStatus").innerHTML =
        "✓ Your modification has been applied.";
}


/* =================================
   REJECT AI SUGGESTION
================================= */

function rejectSuggestion() {

    addHistory(
        "User rejected AI suggestion"
    );


    document.getElementById("aiStatus").innerHTML =
        "Suggestion rejected — your original design is unchanged.";


    document.getElementById("suggestion").innerHTML = `

        <div class="suggestion-label">
            HUMAN DECISION
        </div>

        <h3 style="color:#f87171;">
            Suggestion rejected
        </h3>

        <p>
            No changes were made to your design.
        </p>

        <div class="why">

            <strong>
                ✦ You are in control
            </strong>

            <span>
                AI provides suggestions.
                The designer makes the final decision.
            </span>

        </div>

    `;
}


/* =================================
   HISTORY
================================= */

function addHistory(text) {

    const history =
        document.getElementById("historyList");


    const item =
        document.createElement("div");


    item.className =
        "history-item";


    item.innerHTML =
        `<span>●</span>${text}`;


    history.appendChild(item);
}


/* =================================
   PREVIEW
================================= */

function previewDesign() {

    alert(
        "✨ Preview Mode\n\nYour final design is ready!"
    );
}


/* =================================
   BUTTON TEST
================================= */

function mainButtonClicked() {

    addHistory(
        "User interacted with main CTA"
    );

}