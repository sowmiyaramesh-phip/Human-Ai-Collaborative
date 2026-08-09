/* =========================================================
   INCLUSIDESIGN AI
   BLIND USER - COMPLETE VOICE + MANUAL DESIGN EDITOR

   Features:
   - Voice commands with "Hey Alexa"
   - Text editing
   - Text colour
   - Text size
   - Text position
   - Images
   - Shapes
   - Shape size
   - Dragging
   - Undo / Redo
   - Read design
   - Manual controls
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentDesignType = "";

let recognition = null;

let isListening = false;
let voiceModeActive = false;
let wakeWordMode = true;
let waitingForText = false;

let selectedElement = null;

let designHistory = [];
let historyIndex = -1;


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setupVoiceRecognition();

    injectTextToolbar();

    setupCanvasClick();

    setupKeyboardShortcuts();

    goHome();

    setTimeout(function () {
        readWelcome();
    }, 700);

    setTimeout(function () {
        startAutomaticVoiceMode();
    }, 2000);

});


/* =========================================================
   TEXT TO SPEECH
========================================================= */

function speak(message, callback = null) {

    if (!message) return;

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(message);

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    if (callback) {
        speech.onend = callback;
    }

    window.speechSynthesis.speak(speech);
}


/* =========================================================
   HOME
========================================================= */

function goHome() {

    const home =
        document.getElementById("homePage");

    const create =
        document.getElementById("createPage");

    const editor =
        document.getElementById("editorPage");

    if (home) {
        home.classList.remove("hidden");
    }

    if (create) {
        create.classList.add("hidden");
    }

    if (editor) {
        editor.classList.add("hidden");
    }

    const sidebar =
        document.getElementById("mainSidebar");

    const header =
        document.getElementById("mainHeader");

    const footer =
        document.getElementById("mainFooter");

    if (sidebar) {
        sidebar.style.display = "flex";
    }

    if (header) {
        header.style.display = "flex";
    }

    if (footer) {
        footer.style.display = "flex";
    }

    document.body.style.overflow = "auto";
}


/* =========================================================
   CREATE MENU
========================================================= */

function showCreateOptions() {

    document
        .getElementById("homePage")
        ?.classList.add("hidden");

    document
        .getElementById("createPage")
        ?.classList.remove("hidden");

    document
        .getElementById("editorPage")
        ?.classList.add("hidden");

    speak(
        "You can create a poster, presentation, or invitation."
    );
}


/* =========================================================
   OPEN EDITOR
========================================================= */

function openEditor(type) {

    currentDesignType =
        type.toLowerCase();

    document
        .getElementById("homePage")
        ?.classList.add("hidden");

    document
        .getElementById("createPage")
        ?.classList.add("hidden");

    document
        .getElementById("editorPage")
        ?.classList.remove("hidden");

    const sidebar =
        document.getElementById("mainSidebar");

    const header =
        document.getElementById("mainHeader");

    const footer =
        document.getElementById("mainFooter");

    if (sidebar) {
        sidebar.style.display = "none";
    }

    if (header) {
        header.style.display = "none";
    }

    if (footer) {
        footer.style.display = "none";
    }

    document.body.style.overflow = "hidden";

    setupCanvas();

    speak(
        "Your " +
        currentDesignType +
        " design page is ready."
    );
}


/* =========================================================
   SETUP CANVAS
========================================================= */

function setupCanvas() {

    const canvas =
        document.getElementById("realCanvas");

    if (!canvas) return;

    canvas.className =
        "real-canvas " +
        currentDesignType;

    const title =
        document.getElementById("editorTitle");

    const canvasType =
        document.getElementById("canvasType");

    const heading =
        document.getElementById("canvasHeading");

    const subheading =
        document.getElementById("canvasSubheading");


    if (currentDesignType === "poster") {

        if (title)
            title.textContent = "Poster Design";

        if (canvasType)
            canvasType.textContent = "POSTER";

        if (heading)
            heading.textContent = "Your Poster";

        if (subheading)
            subheading.textContent =
                "Start creating your poster";
    }


    if (currentDesignType === "presentation") {

        if (title)
            title.textContent =
                "Presentation Design";

        if (canvasType)
            canvasType.textContent =
                "PRESENTATION";

        if (heading)
            heading.textContent =
                "Your Presentation";

        if (subheading)
            subheading.textContent =
                "Start creating your slide";
    }


    if (currentDesignType === "invitation") {

        if (title)
            title.textContent =
                "Invitation Design";

        if (canvasType)
            canvasType.textContent =
                "INVITATION";

        if (heading)
            heading.textContent =
                "Your Invitation";

        if (subheading)
            subheading.textContent =
                "Start creating your invitation";
    }


    canvas.style.background = "#ffffff";

    canvas.innerHTML = "";

    canvas.style.borderRadius = "0";


    const placeholder =
        document.createElement("div");

    placeholder.className =
        "canvas-placeholder";

    placeholder.innerHTML = `
        <div class="big-design-icon">✦</div>
        <h1>Your ${capitalize(currentDesignType)}</h1>
        <p>Start creating with your voice</p>
    `;

    canvas.appendChild(placeholder);

    selectedElement = null;

    designHistory = [];
    historyIndex = -1;

    saveCanvasState();
}


/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(text) {

    if (!text) return "";

    return text.charAt(0).toUpperCase()
        + text.slice(1);
}


/* =========================================================
   BACK TO CREATE
========================================================= */

function backToCreate() {

    document
        .getElementById("editorPage")
        ?.classList.add("hidden");

    document
        .getElementById("createPage")
        ?.classList.remove("hidden");

    const sidebar =
        document.getElementById("mainSidebar");

    const header =
        document.getElementById("mainHeader");

    const footer =
        document.getElementById("mainFooter");

    if (sidebar) {
        sidebar.style.display = "flex";
    }

    if (header) {
        header.style.display = "flex";
    }

    if (footer) {
        footer.style.display = "flex";
    }

    document.body.style.overflow = "auto";

    speak(
        "Choose poster, presentation, or invitation."
    );
}


/* =========================================================
   VOICE RECOGNITION SETUP
========================================================= */

function setupVoiceRecognition() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        console.log(
            "Speech recognition is not supported."
        );

        return;
    }


    recognition =
        new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = false;

    recognition.lang = "en-IN";


    recognition.onstart = function () {

        isListening = true;

        if (wakeWordMode) {

            setVoiceStatus(
                "🎙️ Listening... Say Hey Alexa"
            );

        }
        else {

            setVoiceStatus(
                "🎙️ Voice mode active"
            );
        }

        updateVoiceIndicator(true);
    };


    recognition.onresult =
        function (event) {

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                if (
                    !event.results[i].isFinal
                ) {
                    continue;
                }

                const text =
                    event.results[i][0]
                        .transcript
                        .trim();

                console.log(
                    "VOICE:",
                    text
                );

                handleContinuousVoice(text);
            }
        };


    recognition.onerror =
        function (event) {

            console.log(
                "Voice error:",
                event.error
            );

            isListening = false;

            setVoiceStatus(
                "🎙️ Voice mode ready"
            );
        };


    recognition.onend = function () {

        isListening = false;

        if (voiceModeActive) {

            setTimeout(
                function () {

                    try {

                        if (
                            voiceModeActive &&
                            !isListening
                        ) {
                            recognition.start();
                        }

                    }
                    catch (error) {

                        console.log(error);
                    }

                },
                500
            );
        }
    };
}


/* =========================================================
   START AUTOMATIC VOICE MODE
========================================================= */

function startAutomaticVoiceMode() {

    if (!recognition) {

        console.log(
            "Speech recognition is not supported."
        );

        return;
    }

    voiceModeActive = true;

    wakeWordMode = true;

    try {

        if (!isListening) {
            recognition.start();
        }

    }
    catch (error) {

        console.log(
            "Automatic voice start:",
            error
        );
    }

    setVoiceStatus(
        "🎙️ Listening for Hey Alexa..."
    );

    updateVoiceIndicator(true);
}


/* =========================================================
   START VOICE BUTTON
========================================================= */

function startVoice() {

    if (!recognition) {

        speak(
            "Voice recognition is not supported in this browser."
        );

        return;
    }

    voiceModeActive = true;

    wakeWordMode = true;

    try {

        if (!isListening) {
            recognition.start();
        }

    }
    catch (error) {

        console.log(error);
    }

    setVoiceStatus(
        "🎙️ Voice mode ON. Say Hey Alexa."
    );

    updateVoiceIndicator(true);

    speak(
        "Voice mode is on. Say Hey Alexa followed by your command."
    );
}


/* =========================================================
   EDITOR VOICE
========================================================= */

function startEditorVoice() {

    if (!recognition) {

        speak(
            "Voice recognition is not supported."
        );

        return;
    }

    voiceModeActive = true;

    wakeWordMode = true;

    try {

        if (!isListening) {
            recognition.start();
        }

    }
    catch (error) {

        console.log(error);
    }

    setVoiceStatus(
        "🎙️ Say Hey Alexa followed by your command."
    );

    speak(
        "Voice mode is active. Say Hey Alexa followed by your command."
    );
}


/* =========================================================
   CONTINUOUS VOICE HANDLER
========================================================= */

function handleContinuousVoice(command) {

    let text =
        command
            .toLowerCase()
            .trim();


    console.log(
        "Processed voice:",
        text
    );


    /* -----------------------------------------
       WAITING FOR TEXT
    ----------------------------------------- */

    if (waitingForText) {

        if (
            !containsWakeWord(text)
        ) {

            if (text.length > 0) {

                createText(text);

                waitingForText = false;

                speak(
                    "Your text has been added."
                );

                return;
            }
        }
    }


    /* -----------------------------------------
       WAKE WORD
    ----------------------------------------- */

    const wakeWords = [
        "hey alexa",
        "hey alex",
        "alexa"
    ];


    let wakeDetected = false;


    for (const word of wakeWords) {

        if (text.includes(word)) {

            wakeDetected = true;

            text =
                text
                    .replace(word, "")
                    .trim();

            break;
        }
    }


    /*
       When waiting for wake word,
       ignore normal speech.
    */

    if (
        wakeWordMode &&
        !wakeDetected
    ) {

        return;
    }


    /*
       Wake word alone.
    */

    if (
        wakeDetected &&
        text === ""
    ) {

        speak(
            "Yes. What would you like me to do?"
        );

        wakeWordMode = false;

        return;
    }


    if (text !== "") {

        wakeWordMode = true;

        processVoiceCommand(text);
    }
}


/* =========================================================
   CHECK WAKE WORD
========================================================= */

function containsWakeWord(text) {

    return (
        text.includes("hey alexa") ||
        text.includes("hey alex") ||
        text.includes("alexa")
    );
}


/* =========================================================
   VOICE STATUS
========================================================= */

function setVoiceStatus(message) {

    const status =
        document.getElementById("voiceStatus");

    if (status) {
        status.textContent = message;
    }


    const editorStatus =
        document.getElementById(
            "editorVoiceStatus"
        );

    if (editorStatus) {
        editorStatus.textContent = message;
    }
}


/* =========================================================
   VOICE INDICATOR
========================================================= */

function updateVoiceIndicator(active) {

    const button =
        document.getElementById("voiceButton");

    if (!button) return;

    if (active) {

        button.innerHTML =
            "🎙️ Voice Mode ON";

    }
    else {

        button.innerHTML =
            "🎙️ Start Designing";
    }
}


/* =========================================================
   MAIN VOICE COMMAND
========================================================= */

function processVoiceCommand(command) {

    const text =
        command
            .toLowerCase()
            .trim();


    /* =====================================================
       CREATE POSTER
    ===================================================== */

    if (
        text.includes("create a poster") ||
        text.includes("create poster") ||
        text.includes("open poster") ||
        text === "poster"
    ) {

        openEditor("poster");

        return;
    }


    /* =====================================================
       CREATE PRESENTATION
    ===================================================== */

    if (
        text.includes("create a presentation") ||
        text.includes("create presentation") ||
        text.includes("open presentation") ||
        text === "presentation"
    ) {

        openEditor("presentation");

        return;
    }


    /* =====================================================
       CREATE INVITATION
    ===================================================== */

    if (
        text.includes("create an invitation") ||
        text.includes("create invitation") ||
        text.includes("open invitation") ||
        text === "invitation"
    ) {

        openEditor("invitation");

        return;
    }


    /* =====================================================
       CREATE MENU
    ===================================================== */

    if (
        text === "create" ||
        text.includes("new design")
    ) {

        showCreateOptions();

        return;
    }


    /* =====================================================
       EDITOR COMMANDS
    ===================================================== */

    const editor =
        document.getElementById("editorPage");


    if (
        editor &&
        !editor.classList.contains("hidden")
    ) {

        processEditorVoice(text);

        return;
    }


    speak(
        "Say create poster, create presentation, or create invitation."
    );
}


/* =========================================================
   EDITOR VOICE COMMANDS
========================================================= */

function processEditorVoice(text) {


    /* =====================================================
       ADD TEXT
    ===================================================== */

    if (
        text === "add text" ||
        text === "add a text box" ||
        text === "add textbox" ||
        text.includes("add text")
    ) {

        const extracted =
            extractTextToAdd(text);


        if (extracted) {

            createText(extracted);

            speak(
                "Text added to your design."
            );

        }
        else {

            const textBox =
                createText("");

            waitingForText = true;

            if (textBox) {

                textBox.focus();

                speak(
                    "Text box created. Tell me what you want to write."
                );
            }
        }

        return;
    }


    /* =====================================================
       WRITE / TYPE
    ===================================================== */

    if (
        text.startsWith("write ") ||
        text.startsWith("type ")
    ) {

        const content =
            text
                .replace(/^write /, "")
                .replace(/^type /, "")
                .trim();

        if (content) {

            createText(content);

            speak(
                "Text added."
            );
        }

        return;
    }


    /* =====================================================
       BOLD
    ===================================================== */

    if (
        text.includes("bold")
    ) {

        formatSelectedText("bold");

        return;
    }


    /* =====================================================
       ITALIC
    ===================================================== */

    if (
        text.includes("italic")
    ) {

        formatSelectedText("italic");

        return;
    }


    /* =====================================================
       UNDERLINE
    ===================================================== */

    if (
        text.includes("underline")
    ) {

        formatSelectedText("underline");

        return;
    }


    /* =====================================================
       TEXT COLOUR
    ===================================================== */

    if (
        text.includes("text color") ||
        text.includes("text colour") ||
        text.includes("font color") ||
        text.includes("font colour") ||
        text.includes("make text red") ||
        text.includes("make text blue") ||
        text.includes("make text green") ||
        text.includes("make text purple") ||
        text.includes("make text yellow") ||
        text.includes("make text orange") ||
        text.includes("make text pink") ||
        text.includes("make text black") ||
        text.includes("make text white")
    ) {

        const color =
            extractColor(text);

        if (color) {

            changeTextColor(color);

        }
        else {

            speak(
                "Please say a colour such as red, blue, green, or purple."
            );
        }

        return;
    }


    /* =====================================================
       TEXT SIZE
    ===================================================== */

    if (
        text.includes("text size") ||
        text.includes("font size") ||
        text.includes("make text bigger") ||
        text.includes("make the text bigger") ||
        text.includes("make text smaller") ||
        text.includes("make the text smaller") ||
        text.includes("increase text size") ||
        text.includes("decrease text size")
    ) {

        const number =
            text.match(/\d+/);


        if (number) {

            changeTextSize(
                parseInt(number[0])
            );

        }
        else if (
            text.includes("bigger") ||
            text.includes("increase")
        ) {

            changeTextSize(
                getCurrentTextSize() + 5
            );

        }
        else if (
            text.includes("smaller") ||
            text.includes("decrease")
        ) {

            changeTextSize(
                Math.max(
                    8,
                    getCurrentTextSize() - 5
                )
            );
        }

        return;
    }


    /* =====================================================
       MOVE TEXT / ELEMENT
    ===================================================== */

    if (
        text.includes("move") ||
        text.includes("put text") ||
        text.includes("place text")
    ) {

        const position =
            extractPosition(text);

        if (position) {

            moveSelectedElement(position);

        }
        else {

            speak(
                "Say move text to top, bottom, left, right, or centre."
            );
        }

        return;
    }


    /* =====================================================
       IMAGE
    ===================================================== */

    if (
        (
            text.includes("add") ||
            text.includes("insert")
        )
        &&
        (
            text.includes("image") ||
            text.includes("picture") ||
            text.includes("photo")
        )
    ) {

        const keyword =
            extractImageKeyword(text);

        if (!keyword) {

            speak(
                "Tell me what image you want."
            );

            return;
        }

        searchAndAddImage(keyword);

        return;
    }


    /* =====================================================
       IMAGE SIZE
    ===================================================== */

    if (
        text.includes("make image bigger") ||
        text.includes("make the image bigger") ||
        text.includes("increase image size") ||
        text.includes("make image smaller") ||
        text.includes("make the image smaller") ||
        text.includes("decrease image size") ||
        text.includes("image size")
    ) {

        const number =
            text.match(/\d+/);

        if (number) {

            resizeSelectedElement(
                parseInt(number[0])
            );

        }
        else if (
            text.includes("bigger") ||
            text.includes("increase")
        ) {

            resizeSelectedElement(
                120
            );

        }
        else {

            resizeSelectedElement(
                80
            );
        }

        return;
    }


    /* =====================================================
       ADD SHAPE
    ===================================================== */

    if (
        text.includes("add circle") ||
        text.includes("circle")
    ) {

        addShape("circle");

        return;
    }


    if (
        text.includes("add semicircle") ||
        text.includes("add semi circle") ||
        text.includes("semicircle") ||
        text.includes("semi circle")
    ) {

        addShape("semicircle");

        return;
    }


    if (
        text.includes("add triangle") ||
        text.includes("triangle")
    ) {

        addShape("triangle");

        return;
    }


    if (
        text.includes("add rectangle") ||
        text.includes("rectangle")
    ) {

        addShape("rectangle");

        return;
    }


    if (
        text.includes("add square") ||
        text.includes("square")
    ) {

        addShape("square");

        return;
    }


    if (
        text.includes("add pentagon") ||
        text.includes("pentagon") ||
        text.includes("pentagone")
    ) {

        addShape("pentagon");

        return;
    }


    if (
        text.includes("add hexagon") ||
        text.includes("hexagon")
    ) {

        addShape("hexagon");

        return;
    }


    if (
        text.includes("add star") ||
        text.includes("star")
    ) {

        addShape("star");

        return;
    }


    if (
        text.includes("add diamond") ||
        text.includes("diamond")
    ) {

        addShape("diamond");

        return;
    }


    /* =====================================================
       SHAPE SIZE
    ===================================================== */

    if (
        text.includes("make shape bigger") ||
        text.includes("make the shape bigger") ||
        text.includes("increase shape size") ||
        text.includes("make shape smaller") ||
        text.includes("make the shape smaller") ||
        text.includes("decrease shape size")
    ) {

        if (
            text.includes("bigger") ||
            text.includes("increase")
        ) {

            resizeSelectedElement(120);

        }
        else {

            resizeSelectedElement(80);
        }

        return;
    }


    /* =====================================================
       BACKGROUND
    ===================================================== */

    if (
        text.includes("background")
    ) {

        const color =
            extractColor(text);

        if (color) {

            setBackgroundColor(color);

        }
        else {

            showBackgroundPicker();
        }

        return;
    }


    /* =====================================================
       DELETE
    ===================================================== */

    if (
        text.includes("delete") ||
        text.includes("remove")
    ) {

        deleteSelectedElement();

        return;
    }


    /* =====================================================
       IMPORT
    ===================================================== */

    if (
        text.includes("import")
    ) {

        importDesign();

        return;
    }


    /* =====================================================
       UNDO
    ===================================================== */

    if (
        text.includes("undo")
    ) {

        undoDesign();

        return;
    }


    /* =====================================================
       REDO
    ===================================================== */

    if (
        text.includes("redo")
    ) {

        redoDesign();

        return;
    }


    /* =====================================================
       READ
    ===================================================== */

    if (
        text.includes("read design") ||
        text.includes("read my design")
    ) {

        readCurrentDesign();

        return;
    }


    /* =====================================================
       SAVE
    ===================================================== */

    if (
        text.includes("save")
    ) {

        saveDesign();

        return;
    }


    speak(
        "I did not understand that command."
    );
}


/* =========================================================
   EXTRACT TEXT
========================================================= */

function extractTextToAdd(text) {

    const patterns = [

        "add text saying ",
        "add the text ",
        "add text ",
        "write ",
        "type "

    ];


    for (const pattern of patterns) {

        if (
            text.startsWith(pattern)
        ) {

            const result =
                text
                    .substring(pattern.length)
                    .trim();

            if (result) {
                return result;
            }
        }
    }

    return "";
}


/* =========================================================
   CREATE TEXT
========================================================= */

function createText(text = "") {

    const canvas =
        document.getElementById("realCanvas");

    if (!canvas) return null;


    canvas
        .querySelector(".canvas-placeholder")
        ?.remove();


    const element =
        document.createElement("div");


    element.className =
        "design-text";


    element.textContent =
        text;


    element.contentEditable =
        "true";


    element.setAttribute(
        "role",
        "textbox"
    );


    element.setAttribute(
        "aria-label",
        "Design text box"
    );


    element.style.position =
        "absolute";


    element.style.left =
        "50%";


    element.style.top =
        "40%";


    element.style.transform =
        "translate(-50%, -50%)";


    element.style.fontSize =
        "32px";


    element.style.color =
        "#222222";


    element.style.fontWeight =
        "400";


    element.style.fontStyle =
        "normal";


    element.style.textDecoration =
        "none";


    element.style.cursor =
        "move";


    element.style.zIndex =
        "10";


    element.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            selectElement(element);
        }
    );


    element.addEventListener(
        "input",
        function () {

            saveCanvasState();

        }
    );


    element.addEventListener(
        "dblclick",
        function () {

            selectElement(element);

            element.focus();

            placeCaretAtEnd(element);

        }
    );


    canvas.appendChild(element);


    selectElement(element);


    if (!text) {

        element.focus();

        placeCaretAtEnd(element);

        waitingForText = true;
    }


    makeElementDraggable(element);


    saveCanvasState();


    updateAI(
        text
            ? "Text added: " + text
            : "Text box created."
    );


    return element;
}


/* =========================================================
   PLACE CARET
========================================================= */

function placeCaretAtEnd(element) {

    const range =
        document.createRange();

    const selection =
        window.getSelection();

    range.selectNodeContents(element);

    range.collapse(false);

    selection.removeAllRanges();

    selection.addRange(range);
}


/* =========================================================
   SELECT ELEMENT
========================================================= */

function selectElement(element) {

    selectedElement =
        element;


    document
        .querySelectorAll(
            ".design-text, .design-image, .design-shape"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "selected"
                );
            }
        );


    element.classList.add(
        "selected"
    );


    if (
        element.classList.contains(
            "design-text"
        )
    ) {

        showTextToolbar(element);
    }
    else {

        hideTextToolbar();
    }
}


/* =========================================================
   OLD COMPATIBILITY FUNCTION
========================================================= */

function selectText(element) {

    selectElement(element);
}


/* =========================================================
   TEXT TOOLBAR
========================================================= */

function injectTextToolbar() {

    if (
        document.getElementById(
            "dynamicTextToolbar"
        )
    ) {
        return;
    }


    const toolbar =
        document.createElement("div");


    toolbar.id =
        "dynamicTextToolbar";


    toolbar.className =
        "text-toolbar";


    toolbar.style.display =
        "none";


    toolbar.style.position =
        "fixed";


    toolbar.style.zIndex =
        "5000";


    toolbar.innerHTML = `

        <button type="button"
                onclick="formatSelectedText('bold')">
            <b>B</b>
        </button>

        <button type="button"
                onclick="formatSelectedText('italic')">
            <i>I</i>
        </button>

        <button type="button"
                onclick="formatSelectedText('underline')">
            <u>U</u>
        </button>

        <label>
            Size
            <input
                id="manualTextSize"
                type="number"
                min="8"
                max="150"
                value="32"
                onchange="changeTextSize(this.value)">
        </label>

        <label>
            Colour
            <input
                id="manualTextColor"
                type="color"
                value="#222222"
                onchange="changeTextColor(this.value)">
        </label>

        <button type="button"
                onclick="deleteSelectedElement()">
            🗑
        </button>

    `;


    document.body.appendChild(toolbar);
}


/* =========================================================
   SHOW TEXT TOOLBAR
========================================================= */

function showTextToolbar(element) {

    const toolbar =
        document.getElementById(
            "dynamicTextToolbar"
        );

    if (!toolbar) return;


    toolbar.style.display =
        "flex";


    const rect =
        element.getBoundingClientRect();


    toolbar.style.left =
        Math.max(
            10,
            rect.left
        ) + "px";


    toolbar.style.top =
        Math.max(
            10,
            rect.top - 55
        ) + "px";


    const sizeInput =
        document.getElementById(
            "manualTextSize"
        );


    const colorInput =
        document.getElementById(
            "manualTextColor"
        );


    if (sizeInput) {

        sizeInput.value =
            parseInt(
                getComputedStyle(
                    element
                ).fontSize
            ) || 32;
    }


    if (colorInput) {

        colorInput.value =
            rgbToHex(
                getComputedStyle(
                    element
                ).color
            );
    }
}


/* =========================================================
   HIDE TEXT TOOLBAR
========================================================= */

function hideTextToolbar() {

    const toolbar =
        document.getElementById(
            "dynamicTextToolbar"
        );

    if (toolbar) {

        toolbar.style.display =
            "none";
    }
}


/* =========================================================
   CANVAS CLICK
========================================================= */

function setupCanvasClick() {

    document.addEventListener(
        "click",
        function (event) {

            const canvas =
                document.getElementById(
                    "realCanvas"
                );

            if (!canvas) return;


            if (
                event.target === canvas
            ) {

                document
                    .querySelectorAll(
                        ".design-text, .design-image, .design-shape"
                    )
                    .forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );
                        }
                    );


                selectedElement = null;

                hideTextToolbar();
            }
        }
    );
}


/* =========================================================
   FORMAT TEXT
========================================================= */

function formatSelectedText(format) {

    if (!selectedElement) {

        speak(
            "Please select a text box first."
        );

        return;
    }


    if (
        !selectedElement.classList.contains(
            "design-text"
        )
    ) {

        speak(
            "Please select a text box first."
        );

        return;
    }


    if (format === "bold") {

        const current =
            getComputedStyle(
                selectedElement
            ).fontWeight;


        selectedElement.style.fontWeight =
            current === "700"
                ? "400"
                : "700";


        speak(
            selectedElement.style.fontWeight === "700"
                ? "Text is bold."
                : "Bold removed."
        );
    }


    if (format === "italic") {

        selectedElement.style.fontStyle =
            getComputedStyle(
                selectedElement
            ).fontStyle === "italic"
                ? "normal"
                : "italic";


        speak(
            "Italic formatting changed."
        );
    }


    if (format === "underline") {

        const current =
            getComputedStyle(
                selectedElement
            ).textDecorationLine;


        selectedElement.style.textDecoration =
            current.includes("underline")
                ? "none"
                : "underline";


        speak(
            "Underline formatting changed."
        );
    }


    saveCanvasState();

    showTextToolbar(selectedElement);
}


/* =========================================================
   TEXT SIZE
========================================================= */

function changeTextSize(size) {

    if (!selectedElement) {

        speak(
            "Please select a text box first."
        );

        return;
    }


    if (
        !selectedElement.classList.contains(
            "design-text"
        )
    ) {

        speak(
            "Please select a text box first."
        );

        return;
    }


    const numericSize =
        parseInt(size);


    if (
        isNaN(numericSize)
    ) {
        return;
    }


    const finalSize =
        Math.max(
            8,
            Math.min(
                150,
                numericSize
            )
        );


    selectedElement.style.fontSize =
        finalSize + "px";


    saveCanvasState();


    speak(
        "Text size changed to " +
        finalSize +
        " pixels."
    );


    showTextToolbar(selectedElement);
}


/* =========================================================
   CURRENT TEXT SIZE
========================================================= */

function getCurrentTextSize() {

    if (!selectedElement) {
        return 32;
    }


    return (
        parseInt(
            getComputedStyle(
                selectedElement
            ).fontSize
        ) || 32
    );
}


/* =========================================================
   TEXT COLOR
========================================================= */

function changeTextColor(color) {

    if (!selectedElement) {

        speak(
            "Please select a text box first."
        );

        return;
    }


    if (
        !selectedElement.classList.contains(
            "design-text"
        )
    ) {

        speak(
            "Please select a text box first."
        );

        return;
    }


    if (!color) return;


    /*
       IMPORTANT:
       Use setProperty so CSS cannot
       override the selected colour.
    */

    selectedElement.style.setProperty(
        "color",
        color,
        "important"
    );


    /*
       Update toolbar colour picker.
    */

    const colorInput =
        document.getElementById(
            "manualTextColor"
        );


    if (colorInput) {

        colorInput.value =
            rgbToHex(
                color
            );
    }


    saveCanvasState();


    updateAI(
        "Text colour changed."
    );


    speak(
        "Text colour changed."
    );


    showTextToolbar(selectedElement);
}


/* =========================================================
   RGB TO HEX
========================================================= */

function rgbToHex(rgb) {

    if (!rgb) {
        return "#222222";
    }


    if (
        rgb.startsWith("#")
    ) {

        return rgb;
    }


    const result =
        rgb.match(
            /\d+/g
        );


    if (!result) {
        return "#222222";
    }


    return "#" +
        result
            .slice(0, 3)
            .map(
                function (x) {

                    return parseInt(x)
                        .toString(16)
                        .padStart(2, "0");

                }
            )
            .join("");
}


/* =========================================================
   COLOUR LIST
========================================================= */

function extractColor(text) {

    const colors = {

        red: "#ef4444",

        blue: "#3b82f6",

        "light blue": "#bfdbfe",

        "dark blue": "#1e3a8a",

        green: "#22c55e",

        "light green": "#bbf7d0",

        yellow: "#facc15",

        orange: "#f97316",

        pink: "#f472b6",

        purple: "#8b5cf6",

        violet: "#7c3aed",

        white: "#ffffff",

        black: "#000000",

        grey: "#9ca3af",

        gray: "#9ca3af",

        cream: "#fff7ed",

        beige: "#f5f5dc",

        brown: "#92400e",

        navy: "#172554",

        cyan: "#06b6d4",

        gold: "#eab308",

        teal: "#14b8a6",

        magenta: "#d946ef"
    };


    const names =
        Object.keys(colors)
            .sort(
                function (a, b) {

                    return b.length - a.length;

                }
            );


    for (const name of names) {

        if (
            text.includes(name)
        ) {

            return colors[name];
        }
    }


    return null;
}


/* =========================================================
   POSITION
========================================================= */

function extractPosition(text) {

    if (
        text.includes("top left") ||
        text.includes("upper left")
    ) {
        return "top-left";
    }


    if (
        text.includes("top right") ||
        text.includes("upper right")
    ) {
        return "top-right";
    }


    if (
        text.includes("bottom left") ||
        text.includes("lower left")
    ) {
        return "bottom-left";
    }


    if (
        text.includes("bottom right") ||
        text.includes("lower right")
    ) {
        return "bottom-right";
    }


    if (
        text.includes("top") ||
        text.includes("upper")
    ) {
        return "top";
    }


    if (
        text.includes("bottom") ||
        text.includes("lower")
    ) {
        return "bottom";
    }


    if (
        text.includes("left")
    ) {
        return "left";
    }


    if (
        text.includes("right")
    ) {
        return "right";
    }


    if (
        text.includes("centre") ||
        text.includes("center") ||
        text.includes("middle")
    ) {
        return "center";
    }


    return null;
}


/* =========================================================
   MOVE SELECTED ELEMENT
========================================================= */

function moveSelectedElement(position) {

    if (!selectedElement) {

        speak(
            "Please select an element first."
        );

        return;
    }


    switch (position) {

        case "top":

            selectedElement.style.left =
                "50%";

            selectedElement.style.top =
                "10%";

            selectedElement.style.transform =
                "translate(-50%, 0)";

            break;


        case "bottom":

            selectedElement.style.left =
                "50%";

            selectedElement.style.top =
                "90%";

            selectedElement.style.transform =
                "translate(-50%, -100%)";

            break;


        case "left":

            selectedElement.style.left =
                "10%";

            selectedElement.style.top =
                "50%";

            selectedElement.style.transform =
                "translate(0, -50%)";

            break;


        case "right":

            selectedElement.style.left =
                "90%";

            selectedElement.style.top =
                "50%";

            selectedElement.style.transform =
                "translate(-100%, -50%)";

            break;


        case "center":

            selectedElement.style.left =
                "50%";

            selectedElement.style.top =
                "50%";

            selectedElement.style.transform =
                "translate(-50%, -50%)";

            break;


        case "top-left":

            selectedElement.style.left =
                "10%";

            selectedElement.style.top =
                "10%";

            selectedElement.style.transform =
                "none";

            break;


        case "top-right":

            selectedElement.style.left =
                "90%";

            selectedElement.style.top =
                "10%";

            selectedElement.style.transform =
                "translate(-100%, 0)";

            break;


        case "bottom-left":

            selectedElement.style.left =
                "10%";

            selectedElement.style.top =
                "90%";

            selectedElement.style.transform =
                "translate(0, -100%)";

            break;


        case "bottom-right":

            selectedElement.style.left =
                "90%";

            selectedElement.style.top =
                "90%";

            selectedElement.style.transform =
                "translate(-100%, -100%)";

            break;
    }


    saveCanvasState();


    speak(
        "Element moved to " +
        position.replace("-", " ")
    );
}


/* =========================================================
   BACKGROUND
========================================================= */

function changeBackground() {

    showBackgroundPicker();
}


/* =========================================================
   BACKGROUND PICKER
========================================================= */

function showBackgroundPicker() {

    const old =
        document.getElementById(
            "backgroundPickerPanel"
        );

    if (old) {
        old.remove();
    }


    const panel =
        document.createElement("div");


    panel.id =
        "backgroundPickerPanel";


    panel.style.position =
        "fixed";

    panel.style.top =
        "50%";

    panel.style.left =
        "50%";

    panel.style.transform =
        "translate(-50%, -50%)";

    panel.style.zIndex =
        "6000";

    panel.style.background =
        "#191827";

    panel.style.color =
        "white";

    panel.style.padding =
        "25px";

    panel.style.border =
        "1px solid #444";

    panel.style.borderRadius =
        "12px";


    panel.innerHTML = `

        <h3>Choose Background</h3>

        <br>

        <input
            id="manualBackgroundColor"
            type="color"
            value="#ffffff"
            style="width:70px;height:50px">

        <br><br>

        <button
            onclick="applyManualBackground()">
            Apply
        </button>

        <button
            onclick="document.getElementById('backgroundPickerPanel').remove()">
            Cancel
        </button>
    `;


    document.body.appendChild(panel);
}


/* =========================================================
   APPLY BACKGROUND
========================================================= */

function applyManualBackground() {

    const input =
        document.getElementById(
            "manualBackgroundColor"
        );

    if (!input) return;


    setBackgroundColor(
        input.value
    );


    document
        .getElementById(
            "backgroundPickerPanel"
        )
        ?.remove();
}


/* =========================================================
   SET BACKGROUND
========================================================= */

function setBackgroundColor(color) {

    const canvas =
        document.getElementById(
            "realCanvas"
        );

    if (!canvas) return;


    canvas.style.setProperty(
        "background",
        color,
        "important"
    );


    canvas.style.setProperty(
        "background-color",
        color,
        "important"
    );


    updateAI(
        "Background changed to " +
        color
    );


    saveCanvasState();


    speak(
        "Background changed."
    );
}


/* =========================================================
   IMAGE KEYWORD
========================================================= */

function extractImageKeyword(text) {

    let keyword =
        text
            .toLowerCase()
            .trim();


    const phrases = [

        "add an image of",
        "add a image of",
        "add image of",

        "add an image",
        "add a image",
        "add image",

        "insert an image of",
        "insert image of",

        "add a picture of",
        "add picture of",

        "add a picture",
        "add picture",

        "add a photo of",
        "add photo of",

        "add a photo",
        "add photo",

        "insert picture of",
        "insert photo of"
    ];


    for (const phrase of phrases) {

        if (
            keyword.startsWith(phrase)
        ) {

            keyword =
                keyword
                    .substring(
                        phrase.length
                    )
                    .trim();

            break;
        }
    }


    keyword =
        keyword
            .replace(
                /\s+image\s*$/i,
                ""
            )
            .replace(
                /\s+picture\s*$/i,
                ""
            )
            .replace(
                /\s+photo\s*$/i,
                ""
            )
            .trim();


    keyword =
        keyword
            .replace(
                /[.,!?]+$/g,
                ""
            )
            .trim();


    return keyword;
}


/* =========================================================
   SEARCH EXACT IMAGE
   WIKIMEDIA COMMONS
========================================================= */

async function searchAndAddImage(keyword) {

    keyword =
        keyword
            .trim()
            .toLowerCase();


    if (!keyword) {

        speak(
            "Please tell me which image to add."
        );

        return;
    }


    updateAI(
        "Searching for " +
        keyword +
        "..."
    );


    speak(
        "Searching for a " +
        keyword +
        " image."
    );


    try {

        const apiURL =
            "https://commons.wikimedia.org/w/api.php" +
            "?action=query" +
            "&generator=search" +
            "&gsrsearch=" +
            encodeURIComponent(
                keyword
            ) +
            "&gsrnamespace=6" +
            "&gsrlimit=50" +
            "&prop=imageinfo" +
            "&iiprop=url|extmetadata" +
            "&iiurlwidth=1000" +
            "&format=json" +
            "&origin=*";


        const response =
            await fetch(apiURL);


        if (!response.ok) {

            throw new Error(
                "Image search failed"
            );
        }


        const data =
            await response.json();


        if (
            !data.query ||
            !data.query.pages
        ) {

            throw new Error(
                "No image found"
            );
        }


        const pages =
            Object.values(
                data.query.pages
            );


        const words =
            keyword
                .split(/\s+/)
                .filter(Boolean);


        const candidates =
            pages
                .map(
                    function (page) {

                        const title =
                            (
                                page.title ||
                                ""
                            )
                                .toLowerCase();


                        const cleanTitle =
                            title
                                .replace(
                                    /^file:/,
                                    ""
                                )
                                .replace(
                                    /[_\-(),.]/g,
                                    " "
                                );


                        let score = 0;


                        /*
                           Exact phrase
                        */

                        if (
                            cleanTitle.includes(
                                keyword
                            )
                        ) {

                            score += 100;
                        }


                        /*
                           Match words
                        */

                        let matchedWords = 0;


                        words.forEach(
                            function (word) {

                                if (
                                    cleanTitle.includes(
                                        word
                                    )
                                ) {

                                    matchedWords++;

                                    score += 20;
                                }
                            }
                        );


                        /*
                           All words matched
                        */

                        if (
                            matchedWords ===
                            words.length
                        ) {

                            score += 50;
                        }


                        const imageInfo =
                            page.imageinfo &&
                            page.imageinfo[0];


                        if (
                            !imageInfo ||
                            !(
                                imageInfo.thumburl ||
                                imageInfo.url
                            )
                        ) {

                            return null;
                        }


                        return {

                            page: page,

                            score: score
                        };
                    }
                )
                .filter(Boolean)
                .sort(
                    function (a, b) {

                        return b.score -
                            a.score;

                    }
                );


        if (
            candidates.length === 0
        ) {

            throw new Error(
                "No matching image"
            );
        }


        /*
           Use best available match.
        */

        const best =
            candidates[0];


        const page =
            best.page;


        const imageInfo =
            page.imageinfo[0];


        const imageURL =
            imageInfo.thumburl ||
            imageInfo.url;


        console.log(
            "Requested image:",
            keyword
        );


        console.log(
            "Selected image:",
            page.title
        );


        console.log(
            "Match score:",
            best.score
        );


        addImageToCanvas(
            imageURL,
            keyword
        );

    }
    catch (error) {

        console.error(
            "Image search error:",
            error
        );


        updateAI(
            "Could not find " +
            keyword +
            " image."
        );


        speak(
            "I could not find a " +
            keyword +
            " image."
        );
    }
}


/* =========================================================
   ADD IMAGE TO CANVAS
========================================================= */

function addImageToCanvas(
    url,
    keyword
) {

    const canvas =
        document.getElementById(
            "realCanvas"
        );


    if (!canvas) return;


    canvas
        .querySelector(
            ".canvas-placeholder"
        )
        ?.remove();


    const image =
        document.createElement("img");


    image.className =
        "design-image";


    image.src =
        url;


    image.alt =
        keyword;


    image.title =
        keyword;


    image.draggable =
        false;


    image.style.position =
        "absolute";


    image.style.left =
        "15%";


    image.style.top =
        "20%";


    image.style.width =
        "250px";


    image.style.height =
        "auto";


    image.style.maxWidth =
        "70%";


    image.style.maxHeight =
        "70%";


    image.style.objectFit =
        "contain";


    image.style.cursor =
        "move";


    image.style.zIndex =
        "5";


    image.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            selectElement(image);
        }
    );


    image.onload =
        function () {

            canvas.appendChild(
                image
            );


            makeElementDraggable(
                image
            );


            selectElement(
                image
            );


            saveCanvasState();


            updateAI(
                "Added " +
                keyword +
                " image."
            );


            speak(
                "I added a " +
                keyword +
                " image."
            );
        };


    image.onerror =
        function () {

            speak(
                "The image could not be loaded."
            );
        };
}


/* =========================================================
   MANUAL IMAGE SEARCH
========================================================= */

function searchImageManually() {

    showImageSearchPanel();
}


/* =========================================================
   IMAGE SEARCH PANEL
========================================================= */

function showImageSearchPanel() {

    document
        .getElementById(
            "imageSearchPanel"
        )
        ?.remove();


    const panel =
        document.createElement("div");


    panel.id =
        "imageSearchPanel";


    panel.style.position =
        "fixed";

    panel.style.top =
        "50%";

    panel.style.left =
        "50%";

    panel.style.transform =
        "translate(-50%, -50%)";

    panel.style.zIndex =
        "6000";

    panel.style.width =
        "350px";

    panel.style.background =
        "#191827";

    panel.style.color =
        "white";

    panel.style.padding =
        "25px";

    panel.style.border =
        "1px solid #444";

    panel.style.borderRadius =
        "12px";


    panel.innerHTML = `

        <h3>Search Image</h3>

        <p style="
            color:#aaa;
            font-size:12px;
            margin:10px 0;">
            Type what image you want.
        </p>

        <input
            id="imageSearchInput"
            type="text"
            placeholder="Example: mountain"
            style="
                width:100%;
                padding:12px;
                border-radius:8px;
                border:1px solid #555;
                background:#242235;
                color:white;">

        <br><br>

        <button
            onclick="manualImageSearchSubmit()">
            Search & Add
        </button>

        <button
            onclick="document.getElementById('imageSearchPanel').remove()">
            Cancel
        </button>
    `;


    document.body.appendChild(
        panel
    );


    document
        .getElementById(
            "imageSearchInput"
        )
        ?.focus();
}


/* =========================================================
   MANUAL IMAGE SUBMIT
========================================================= */

function manualImageSearchSubmit() {

    const input =
        document.getElementById(
            "imageSearchInput"
        );


    if (!input) return;


    const keyword =
        input.value.trim();


    if (!keyword) return;


    document
        .getElementById(
            "imageSearchPanel"
        )
        ?.remove();


    searchAndAddImage(
        keyword
    );
}


/* =========================================================
   SHAPE LIST
========================================================= */

function showShapeOptions() {

    document
        .getElementById(
            "shapePickerPanel"
        )
        ?.remove();


    const panel =
        document.createElement("div");


    panel.id =
        "shapePickerPanel";


    panel.style.position =
        "fixed";

    panel.style.top =
        "50%";

    panel.style.left =
        "50%";

    panel.style.transform =
        "translate(-50%, -50%)";

    panel.style.zIndex =
        "6000";

    panel.style.background =
        "#191827";

    panel.style.color =
        "white";

    panel.style.padding =
        "25px";

    panel.style.border =
        "1px solid #444";

    panel.style.borderRadius =
        "15px";


    panel.innerHTML = `

        <h3>Choose Shape</h3>

        <br>

        <button onclick="addShape('circle')">
            ⚪ Circle
        </button>

        <button onclick="addShape('semicircle')">
            ◐ Semicircle
        </button>

        <button onclick="addShape('triangle')">
            🔺 Triangle
        </button>

        <button onclick="addShape('square')">
            ◼ Square
        </button>

        <button onclick="addShape('rectangle')">
            ▬ Rectangle
        </button>

        <button onclick="addShape('pentagon')">
            ⬟ Pentagon
        </button>

        <button onclick="addShape('hexagon')">
            ⬢ Hexagon
        </button>

        <button onclick="addShape('star')">
            ★ Star
        </button>

        <button onclick="addShape('diamond')">
            ◆ Diamond
        </button>

        <br><br>

        <button onclick="
            document.getElementById('shapePickerPanel').remove()
        ">
            Cancel
        </button>
    `;


    document.body.appendChild(
        panel
    );
}


/* =========================================================
   ADD SHAPE
========================================================= */

function addShape(type = "rectangle") {

    const canvas =
        document.getElementById(
            "realCanvas"
        );


    if (!canvas) return;


    canvas
        .querySelector(
            ".canvas-placeholder"
        )
        ?.remove();


    document
        .getElementById(
            "shapePickerPanel"
        )
        ?.remove();


    const shape =
        document.createElement("div");


    shape.className =
        "design-shape";


    shape.dataset.shape =
        type;


    shape.style.position =
        "absolute";


    shape.style.left =
        "20%";


    shape.style.top =
        "20%";


    shape.style.width =
        "150px";


    shape.style.height =
        "150px";


    shape.style.background =
        "#8b5cf6";


    shape.style.cursor =
        "move";


    shape.style.zIndex =
        "4";


    applyShapeStyle(
        shape,
        type
    );


    shape.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            selectElement(shape);
        }
    );


    canvas.appendChild(
        shape
    );


    makeElementDraggable(
        shape
    );


    selectElement(
        shape
    );


    saveCanvasState();


    updateAI(
        type +
        " shape added."
    );


    speak(
        type +
        " added."
    );
}


/* =========================================================
   APPLY SHAPE STYLE
========================================================= */

function applyShapeStyle(
    shape,
    type
) {

    shape.style.clipPath =
        "none";

    shape.style.borderRadius =
        "0";

    shape.style.background =
        "#8b5cf6";


    switch (type) {

        case "circle":

            shape.style.borderRadius =
                "50%";

            break;


        case "semicircle":

            shape.style.borderRadius =
                "150px 150px 0 0";

            break;


        case "triangle":

            shape.style.clipPath =
                "polygon(50% 0%, 100% 100%, 0% 100%)";

            break;


        case "square":

            shape.style.width =
                "150px";

            shape.style.height =
                "150px";

            break;


        case "rectangle":

            shape.style.width =
                "220px";

            shape.style.height =
                "130px";

            break;


        case "pentagon":

            shape.style.clipPath =
                "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)";

            break;


        case "hexagon":

            shape.style.clipPath =
                "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";

            break;


        case "star":

            shape.style.clipPath =
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

            break;


        case "diamond":

            shape.style.clipPath =
                "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";

            break;
    }
}


/* =========================================================
   RESIZE SELECTED ELEMENT
========================================================= */

function resizeSelectedElement(value) {

    if (!selectedElement) {

        speak(
            "Please select an element first."
        );

        return;
    }


    let width =
        selectedElement.offsetWidth;


    let height =
        selectedElement.offsetHeight;


    if (
        typeof value === "number" &&
        value > 0
    ) {

        /*
           Voice command like:
           "make image 200"
        */

        width =
            value;

        height =
            value;
    }


    else {

        const factor =
            value / 100;


        width =
            width * factor;

        height =
            height * factor;
    }


    width =
        Math.max(
            30,
            Math.min(
                800,
                width
            )
        );


    height =
        Math.max(
            30,
            Math.min(
                800,
                height
            )
        );


    selectedElement.style.width =
        width + "px";


    if (
        selectedElement.dataset.shape
    ) {

        selectedElement.style.height =
            height + "px";
    }


    saveCanvasState();


    speak(
        "Element size changed."
    );
}


/* =========================================================
   DRAG ELEMENT
========================================================= */

function makeElementDraggable(element) {

    if (
        element.dataset.dragReady === "true"
    ) {
        return;
    }


    element.dataset.dragReady =
        "true";


    let dragging = false;

    let startX = 0;

    let startY = 0;

    let originalLeft = 0;

    let originalTop = 0;


    element.addEventListener(
        "mousedown",
        function (event) {

            if (
                element.classList.contains(
                    "design-text"
                ) &&
                document.activeElement === element
            ) {
                return;
            }


            dragging = true;


            startX =
                event.clientX;


            startY =
                event.clientY;


            originalLeft =
                element.offsetLeft;


            originalTop =
                element.offsetTop;


            selectElement(
                element
            );


            event.preventDefault();
        }
    );


    function move(event) {

        if (!dragging) return;


        const canvas =
            document.getElementById(
                "realCanvas"
            );


        if (!canvas) return;


        const rect =
            canvas.getBoundingClientRect();


        const newLeft =
            originalLeft +
            (
                event.clientX -
                startX
            );


        const newTop =
            originalTop +
            (
                event.clientY -
                startY
            );


        element.style.left =
            (
                newLeft /
                rect.width *
                100
            ) + "%";


        element.style.top =
            (
                newTop /
                rect.height *
                100
            ) + "%";


        element.style.transform =
            "none";
    }


    function stop() {

        if (!dragging) return;

        dragging = false;

        saveCanvasState();
    }


    document.addEventListener(
        "mousemove",
        move
    );


    document.addEventListener(
        "mouseup",
        stop
    );
}


/* =========================================================
   DELETE SELECTED ELEMENT
========================================================= */

function deleteSelectedElement() {

    if (!selectedElement) {

        speak(
            "Please select an element first."
        );

        return;
    }


    selectedElement.remove();

    selectedElement = null;

    hideTextToolbar();

    saveCanvasState();


    speak(
        "Element deleted."
    );
}


/* =========================================================
   OLD COMPATIBILITY
========================================================= */

function deleteSelectedText() {

    deleteSelectedElement();
}


/* =========================================================
   IMPORT DESIGN
========================================================= */

function importDesign() {

    const input =
        document.createElement("input");


    input.type =
        "file";


    input.accept =
        "image/*";


    input.onchange =
        function () {

            const file =
                input.files[0];


            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    addImageToCanvas(
                        event.target.result,
                        "imported image"
                    );
                };


            reader.readAsDataURL(file);
        };


    input.click();
}


/* =========================================================
   READ DESIGN
========================================================= */

function readCurrentDesign() {

    const canvas =
        document.getElementById(
            "realCanvas"
        );


    if (!canvas) return;


    const texts =
        canvas.querySelectorAll(
            ".design-text"
        );


    const images =
        canvas.querySelectorAll(
            ".design-image"
        );


    const shapes =
        canvas.querySelectorAll(
            ".design-shape"
        );


    let message =
        "This is your " +
        currentDesignType +
        ".";


    if (texts.length > 0) {

        message +=
            " The text says: ";


        texts.forEach(
            function (text) {

                const value =
                    text.innerText.trim();


                if (value) {

                    message +=
                        value +
                        ". ";
                }
            }
        );
    }


    if (images.length > 0) {

        message +=
            " There are " +
            images.length +
            " images.";
    }


    if (shapes.length > 0) {

        message +=
            " There are " +
            shapes.length +
            " shapes.";
    }


    speak(message);
}


/* =========================================================
   SAVE DESIGN
========================================================= */

function saveDesign() {

    speak(
        "Your " +
        currentDesignType +
        " design has been saved."
    );


    updateAI(
        "Design saved successfully."
    );
}


/* =========================================================
   HISTORY
========================================================= */

function saveCanvasState() {

    const canvas =
        document.getElementById(
            "realCanvas"
        );


    if (!canvas) return;


    const state = {

        html:
            canvas.innerHTML,

        background:
            canvas.style.background

    };


    if (
        historyIndex <
        designHistory.length - 1
    ) {

        designHistory =
            designHistory.slice(
                0,
                historyIndex + 1
            );
    }


    const last =
        designHistory[
            designHistory.length - 1
        ];


    if (
        last &&
        last.html === state.html &&
        last.background === state.background
    ) {

        return;
    }


    designHistory.push(
        state
    );


    historyIndex =
        designHistory.length - 1;
}


/* =========================================================
   UNDO
========================================================= */

function undoDesign() {

    if (
        historyIndex <= 0
    ) {

        speak(
            "Nothing to undo."
        );

        return;
    }


    historyIndex--;


    restoreState(
        designHistory[
            historyIndex
        ]
    );


    speak(
        "Last change undone."
    );
}


/* =========================================================
   REDO
========================================================= */

function redoDesign() {

    if (
        historyIndex >=
        designHistory.length - 1
    ) {

        speak(
            "Nothing to redo."
        );

        return;
    }


    historyIndex++;


    restoreState(
        designHistory[
            historyIndex
        ]
    );


    speak(
        "Change restored."
    );
}


/* =========================================================
   RESTORE STATE
========================================================= */

function restoreState(state) {

    const canvas =
        document.getElementById(
            "realCanvas"
        );


    if (!canvas) return;


    canvas.innerHTML =
        state.html;


    canvas.style.background =
        state.background;


    selectedElement = null;


    canvas
        .querySelectorAll(
            ".design-text"
        )
        .forEach(
            function (element) {

                element.contentEditable =
                    "true";


                element.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        selectElement(
                            element
                        );
                    }
                );


                element.addEventListener(
                    "input",
                    function () {

                        saveCanvasState();

                    }
                );


                makeElementDraggable(
                    element
                );
            }
        );


    canvas
        .querySelectorAll(
            ".design-image, .design-shape"
        )
        .forEach(
            function (element) {

                element.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        selectElement(
                            element
                        );
                    }
                );


                makeElementDraggable(
                    element
                );
            }
        );
}


/* =========================================================
   AI MESSAGE
========================================================= */

function updateAI(message) {

    const ai =
        document.getElementById(
            "aiMessage"
        );


    if (ai) {

        ai.textContent =
            message;
    }
}


/* =========================================================
   WELCOME AUDIO
========================================================= */

function readWelcome() {

    speak(
        "Welcome to InclusiDesign platform. " +
        "Here you can design a poster, " +
        "a presentation, " +
        "or an invitation. " +
        "Say Hey Alexa followed by your command."
    );
}


/* =========================================================
   REPEAT OPTIONS
========================================================= */

function repeatDesignOptions() {

    speak(
        "The available designs are Poster, Presentation, and Invitation."
    );
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        function (event) {

            /*
               Delete selected element
            */

            if (
                event.key === "Delete" &&
                selectedElement
            ) {

                deleteSelectedElement();

                return;
            }


            /*
               Ctrl + Z
            */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "z"
            ) {

                event.preventDefault();

                undoDesign();

                return;
            }


            /*
               Ctrl + Y
            */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "y"
            ) {

                event.preventDefault();

                redoDesign();

                return;
            }
        }
    );
}


/* =========================================================
   GLOBAL WINDOW FUNCTIONS
   Helps HTML onclick buttons
========================================================= */

window.goHome =
    goHome;

window.showCreateOptions =
    showCreateOptions;

window.openEditor =
    openEditor;

window.backToCreate =
    backToCreate;

window.startVoice =
    startVoice;

window.startEditorVoice =
    startEditorVoice;

window.showBackgroundPicker =
    showBackgroundPicker;

window.changeBackground =
    changeBackground;

window.applyManualBackground =
    applyManualBackground;

window.setBackgroundColor =
    setBackgroundColor;

window.searchImageManually =
    searchImageManually;

window.manualImageSearchSubmit =
    manualImageSearchSubmit;

window.showShapeOptions =
    showShapeOptions;

window.addShape =
    addShape;

window.addText =
    function () {
        createText("");
    };

window.createText =
    createText;

window.formatSelectedText =
    formatSelectedText;

window.changeTextSize =
    changeTextSize;

window.changeTextColor =
    changeTextColor;

window.deleteSelectedText =
    deleteSelectedText;

window.deleteSelectedElement =
    deleteSelectedElement;

window.importDesign =
    importDesign;

window.undoDesign =
    undoDesign;

window.redoDesign =
    redoDesign;

window.readCurrentDesign =
    readCurrentDesign;

window.saveDesign =
    saveDesign;

window.repeatDesignOptions =
    repeatDesignOptions;