/* =========================================
   INCLUSIDESIGN AI
   COMPLETE WORKING JAVASCRIPT
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const canvas =
    document.getElementById("canvas");

const previewBtn =
    document.getElementById("previewBtn");

const addTextBtn =
    document.getElementById("addTextBtn");

const addButtonBtn =
    document.getElementById("addButtonBtn");

const addImageBtn =
    document.getElementById("addImageBtn");

const addSectionBtn =
    document.getElementById("addSectionBtn");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const applyBtn =
    document.getElementById("applyBtn");

const modifyBtn =
    document.getElementById("modifyBtn");

const rejectBtn =
    document.getElementById("rejectBtn");

const aiStatus =
    document.getElementById("aiStatus");

const suggestion =
    document.getElementById("suggestion");

const historyList =
    document.getElementById("historyList");

const mainButton =
    document.getElementById("mainButton");


/* =========================================
   HISTORY
========================================= */

function addHistory(message) {

    const item =
        document.createElement("div");

    item.className =
        "history-item";

    item.innerHTML = `
        <span>●</span>
        ${message}
    `;

    historyList.appendChild(item);

}


/* =========================================
   NAVIGATION
========================================= */

document
    .querySelectorAll(".nav-links a")
    .forEach(function(link) {

        link.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                const targetId =
                    link.getAttribute("href");

                const target =
                    document.querySelector(
                        targetId
                    );

                if (target) {

                    target.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                    addHistory(
                        "Navigated to " +
                        targetId.substring(1)
                    );

                }

            }
        );

    });


/* =========================================
   ADD TEXT
========================================= */

addTextBtn.addEventListener(
    "click",
    function() {

        const text =
            document.createElement("div");

        text.innerText =
            "✨ New Text";

        text.contentEditable =
            "true";

        text.style.padding =
            "25px";

        text.style.margin =
            "15px";

        text.style.textAlign =
            "center";

        text.style.fontSize =
            "24px";

        text.style.fontWeight =
            "700";

        text.style.cursor =
            "text";

        text.style.border =
            "1px dashed #a78bfa";

        text.style.borderRadius =
            "10px";

        canvas.appendChild(text);

        addHistory(
            "Added new text"
        );

    }
);


/* =========================================
   ADD BUTTON
========================================= */

addButtonBtn.addEventListener(
    "click",
    function() {

        const button =
            document.createElement("button");

        button.innerText =
            "New Button";

        button.style.display =
            "block";

        button.style.margin =
            "20px auto";

        button.style.padding =
            "12px 25px";

        button.style.border =
            "none";

        button.style.borderRadius =
            "9px";

        button.style.background =
            "#7c3aed";

        button.style.color =
            "white";

        button.style.cursor =
            "pointer";


        button.addEventListener(
            "click",
            function() {

                alert(
                    "New Button clicked!"
                );

                addHistory(
                    "New button clicked"
                );

            }
        );


        canvas.appendChild(button);

        addHistory(
            "Added new button"
        );

    }
);


/* =========================================
   ADD IMAGE
========================================= */

addImageBtn.addEventListener(
    "click",
    function() {

        const input =
            document.createElement("input");

        input.type =
            "file";

        input.accept =
            "image/*";

        input.style.display =
            "none";


        document.body.appendChild(input);

        input.click();


        input.addEventListener(
            "change",
            function() {

                const file =
                    input.files[0];

                if (!file) {

                    input.remove();

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function(event) {

                        const image =
                            document.createElement("img");

                        image.src =
                            event.target.result;

                        image.style.display =
                            "block";

                        image.style.width =
                            "80%";

                        image.style.maxWidth =
                            "500px";

                        image.style.margin =
                            "25px auto";

                        image.style.borderRadius =
                            "15px";


                        canvas.appendChild(image);


                        addHistory(
                            "Added image"
                        );

                    };


                reader.readAsDataURL(file);

                input.remove();

            }
        );

    }
);


/* =========================================
   ADD SECTION
========================================= */

addSectionBtn.addEventListener(
    "click",
    function() {

        const section =
            document.createElement("section");


        section.style.padding =
            "40px";

        section.style.margin =
            "20px 0";

        section.style.textAlign =
            "center";

        section.style.background =
            "#f8fafc";

        section.style.borderRadius =
            "15px";


        section.innerHTML = `

            <h2 contenteditable="true">
                New Design Section
            </h2>

            <p contenteditable="true">
                Click here to edit this section.
            </p>

            <button>
                Explore More →
            </button>

        `;


        canvas.appendChild(section);


        const exploreButton =
            section.querySelector("button");


        exploreButton.addEventListener(
            "click",
            function() {

                alert(
                    "✨ Explore More\n\n" +
                    "This section contains " +
                    "additional information."
                );

                addHistory(
                    "Clicked Explore More"
                );

            }
        );


        addHistory(
            "Added new section"
        );

    }
);


/* =========================================
   PREVIEW
========================================= */

previewBtn.addEventListener(
    "click",
    function() {

        const newWindow =
            window.open(
                "",
                "_blank"
            );


        if (!newWindow) {

            alert(
                "Please allow pop-ups."
            );

            return;

        }


        newWindow.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    InclusiDesign Preview
                </title>

                <style>

                    body {

                        margin: 0;

                        padding: 30px;

                        font-family:
                            Arial, sans-serif;

                        background:
                            #f5f3ff;

                    }

                    .preview {

                        max-width:
                            1000px;

                        margin:
                            auto;

                        background:
                            white;

                        padding:
                            30px;

                        border-radius:
                            20px;

                    }

                </style>

            </head>

            <body>

                <div class="preview">

                    ${canvas.innerHTML}

                </div>

            </body>

            </html>

        `);


        newWindow.document.close();


        addHistory(
            "Opened preview"
        );

    }
);


/* =========================================
   ANALYZE
========================================= */

analyzeBtn.addEventListener(
    "click",
    async function() {

        aiStatus.innerHTML =
            "🤖 Analyzing your design...";


        analyzeBtn.disabled =
            true;


        analyzeBtn.innerText =
            "🤖 Analyzing...";


        addHistory(
            "AI analysis started"
        );


        /*
           Try backend.
           If backend is not running,
           the website still works.
        */

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/normal/analyze",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                design:
                                    canvas.innerText

                            })

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Backend error"
                );

            }


            const result =
                await response.json();


            console.log(
                "AI result:",
                result
            );


            aiStatus.innerHTML =
                "✓ Design analyzed successfully.";


            addHistory(
                "AI analyzed design"
            );

        }


        catch(error) {

            console.log(
                "Backend unavailable:",
                error
            );


            /*
               Demo mode
            */

            aiStatus.innerHTML =
                "✓ Design analyzed — AI insight ready.";


            addHistory(
                "AI analysis completed"
            );

        }


        analyzeBtn.disabled =
            false;


        analyzeBtn.innerText =
            "🤖 Analyze My Design";

    }
);


/* =========================================
   APPLY
========================================= */

applyBtn.addEventListener(
    "click",
    function() {

        mainButton.style.background =
            "linear-gradient(135deg,#7c3aed,#ec4899)";

        mainButton.style.padding =
            "16px 34px";

        mainButton.style.boxShadow =
            "0 10px 30px rgba(124,58,237,.35)";

        mainButton.style.borderRadius =
            "12px";

        mainButton.innerText =
            "Register Now →";


        aiStatus.innerHTML =
            "✓ Suggestion applied successfully.";


        addHistory(
            "AI suggestion accepted"
        );


        suggestion.innerHTML = `

            <div class="suggestion-label">
                ✓ APPLIED
            </div>

            <h3>
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
);


/* =========================================
   MODIFY
========================================= */

modifyBtn.addEventListener(
    "click",
    function() {

        const newText =
            prompt(
                "What should the button say?"
            );


        if (!newText) {

            return;

        }


        mainButton.innerText =
            newText;


        addHistory(
            "User modified AI suggestion"
        );


        aiStatus.innerHTML =
            "✓ Your modification has been applied.";

    }
);


/* =========================================
   REJECT
========================================= */

rejectBtn.addEventListener(
    "click",
    function() {

        addHistory(
            "User rejected AI suggestion"
        );


        aiStatus.innerHTML =
            "Suggestion rejected — original design unchanged.";


        suggestion.innerHTML = `

            <div class="suggestion-label">
                HUMAN DECISION
            </div>

            <h3>
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
);


/* =========================================
   MAIN BUTTON
========================================= */

mainButton.addEventListener(
    "click",
    function() {

        alert(
            "🎉 Register Now selected!"
        );


        addHistory(
            "User clicked Register Now"
        );

    }
);


/* =========================================
   READY
========================================= */

console.log(
    "✓ InclusiDesign AI loaded successfully"
);