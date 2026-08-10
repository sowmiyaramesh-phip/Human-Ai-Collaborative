/* =========================================================
   INCLUSIDESIGN AI
   Voice Controlled Accessibility System
========================================================= */


/* =========================================================
   GET ELEMENTS
========================================================= */

const modeScreen =
    document.getElementById("modeScreen");

const mainWebsite =
    document.getElementById("mainWebsite");

const normalModeCard =
    document.getElementById("normalModeCard");

const blindModeCard =
    document.getElementById("blindModeCard");

const registerButton =
    document.getElementById("registerButton");

const analyzeButton =
    document.getElementById("analyzeButton");

const applyButton =
    document.getElementById("applyButton");

const modifyButton =
    document.getElementById("modifyButton");

const rejectButton =
    document.getElementById("rejectButton");

const previewButton =
    document.getElementById("previewButton");

const message =
    document.getElementById("message");


/* =========================================================
   VARIABLES
========================================================= */

let currentMode = null;

let recognition = null;

let recognitionRunning = false;

let voiceInitialized = false;


/* =========================================================
   VOICE MESSAGE WHEN PAGE OPENS
========================================================= */

function welcomeVoice() {

    const welcomeText =
        "Welcome to InclusiDesign AI. " +
        "Please select Normal Mode or Blind Mode. " +
        "You can also say, Hey Alexa, open Normal Mode, " +
        "or Hey Alexa, open Blind Mode.";

    speak(welcomeText);

}


/* =========================================================
   TEXT TO SPEECH
========================================================= */

function speak(text) {

    if (!("speechSynthesis" in window)) {

        console.log(
            "Speech synthesis is not supported."
        );

        return;
    }


    /*
       Stop any previous speech.
    */

    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.lang = "en-US";

    speech.rate = 0.9;

    speech.pitch = 1;

    speech.volume = 1;


    window.speechSynthesis.speak(
        speech
    );
}


/* =========================================================
   SELECT MODE
========================================================= */

function selectMode(mode) {

    currentMode = mode;


    /* -----------------------------------------
       NORMAL MODE
    ----------------------------------------- */

    if (mode === "normal") {

        document.body.classList.remove(
            "blind-mode"
        );


        showWebsite();


        showMessage(
            "Normal User Mode activated"
        );


        /*
           Voice confirmation
        */

        speak(
            "Normal User Mode activated. Welcome."
        );

    }


    /* -----------------------------------------
       BLIND MODE
    ----------------------------------------- */

    if (mode === "blind") {

        document.body.classList.add(
            "blind-mode"
        );


        showWebsite();


        showMessage(
            "Blind User Mode activated"
        );


        /*
           Voice confirmation
        */

        speak(
            "Blind User Mode activated. " +
            "Voice assistance is now enabled. " +
            "You can use your keyboard or voice commands."
        );

    }


    /*
       Stop recognition after mode has been selected.

       This prevents the page from continuously
       listening after entering the website.
    */

    stopVoiceRecognition();

}


/* =========================================================
   SHOW WEBSITE
========================================================= */

function showWebsite() {

    modeScreen.style.display = "none";

    mainWebsite.style.display = "block";


    /*
       Move keyboard focus to first button.
    */

    setTimeout(function () {

        const firstButton =
            mainWebsite.querySelector(
                "button"
            );


        if (firstButton) {

            firstButton.focus();

        }

    }, 200);

}


/* =========================================================
   NORMAL MODE CARD
========================================================= */

normalModeCard.addEventListener(
    "click",
    function () {

        selectMode("normal");

    }
);


/* =========================================================
   BLIND MODE CARD
========================================================= */

blindModeCard.addEventListener(
    "click",
    function () {

        selectMode("blind");

    }
);


/* =========================================================
   NORMAL MODE KEYBOARD
========================================================= */

normalModeCard.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            selectMode("normal");

        }

    }
);


/* =========================================================
   BLIND MODE KEYBOARD
========================================================= */

blindModeCard.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            selectMode("blind");

        }

    }
);


/* =========================================================
   REGISTER BUTTON
========================================================= */

registerButton.addEventListener(
    "click",
    function () {

        showMessage(
            "Registration process started"
        );


        if (currentMode === "blind") {

            speak(
                "Registration process started."
            );

        }

    }
);


/* =========================================================
   ANALYZE DESIGN
========================================================= */

analyzeButton.addEventListener(
    "click",
    function () {

        showMessage(
            "AI is analyzing your design..."
        );


        if (currentMode === "blind") {

            speak(
                "AI is analyzing your design. " +
                "A suggestion was found to improve " +
                "Register Now button visibility."
            );

        }

    }
);


/* =========================================================
   APPLY AI SUGGESTION
========================================================= */

applyButton.addEventListener(
    "click",
    function () {

        registerButton.style.background =
            "linear-gradient(90deg, #6034e8, #d02894)";


        registerButton.style.boxShadow =
            "0 10px 35px rgba(100, 40, 220, 0.45)";


        registerButton.style.transform =
            "scale(1.05)";


        showMessage(
            "AI suggestion applied"
        );


        if (currentMode === "blind") {

            speak(
                "AI suggestion applied. " +
                "Register Now button visibility improved."
            );

        }

    }
);


/* =========================================================
   MODIFY AI SUGGESTION
========================================================= */

modifyButton.addEventListener(
    "click",
    function () {

        showMessage(
            "Modify suggestion selected"
        );


        if (currentMode === "blind") {

            speak(
                "Modify suggestion selected."
            );

        }

    }
);


/* =========================================================
   REJECT AI SUGGESTION
========================================================= */

rejectButton.addEventListener(
    "click",
    function () {

        const insightCard =
            document.querySelector(
                ".insight-card"
            );


        insightCard.style.opacity = "0.4";


        showMessage(
            "AI suggestion rejected"
        );


        if (currentMode === "blind") {

            speak(
                "AI suggestion rejected."
            );

        }

    }
);


/* =========================================================
   PREVIEW BUTTON
========================================================= */

previewButton.addEventListener(
    "click",
    function () {

        showMessage(
            "Preview opened"
        );


        if (currentMode === "blind") {

            speak(
                "Preview opened."
            );

        }

    }
);


/* =========================================================
   SHOW MESSAGE
========================================================= */

let messageTimer;


function showMessage(text) {

    message.textContent = text;

    message.style.display = "block";


    clearTimeout(
        messageTimer
    );


    messageTimer =
        setTimeout(
            function () {

                message.style.display =
                    "none";

            },
            2500
        );

}


/* =========================================================
   VOICE COMMAND RECOGNITION
========================================================= */

function setupVoiceRecognition() {

    /*
       Check browser support.

       Chrome uses:
       webkitSpeechRecognition

       Some browsers use:
       SpeechRecognition
    */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        console.warn(
            "Speech recognition is not supported in this browser."
        );

        return;

    }


    recognition =
        new SpeechRecognition();


    /*
       Keep listening continuously
       while the mode selection screen
       is visible.
    */

    recognition.continuous = true;


    /*
       We only need one language.
    */

    recognition.lang = "en-US";


    /*
       We want the final recognized sentence.
    */

    recognition.interimResults = false;


    /*
       Return multiple possible results.
    */

    recognition.maxAlternatives = 3;


    /* -----------------------------------------
       WHEN SPEECH IS RECOGNIZED
    ----------------------------------------- */

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


                const transcript =
                    event.results[i][0]
                        .transcript
                        .toLowerCase()
                        .trim();


                console.log(
                    "Voice command:",
                    transcript
                );


                processVoiceCommand(
                    transcript
                );

            }

        };


    /* -----------------------------------------
       RECOGNITION STARTED
    ----------------------------------------- */

    recognition.onstart =
        function () {

            recognitionRunning = true;

            console.log(
                "Voice recognition started."
            );

        };


    /* -----------------------------------------
       RECOGNITION ENDED
    ----------------------------------------- */

    recognition.onend =
        function () {

            recognitionRunning = false;


            /*
               Only restart while the user
               is still choosing a mode.
            */

            if (
                modeScreen.style.display !== "none"
            ) {

                setTimeout(
                    function () {

                        startVoiceRecognition();

                    },
                    500
                );

            }

        };


    /* -----------------------------------------
       RECOGNITION ERROR
    ----------------------------------------- */

    recognition.onerror =
        function (event) {

            console.log(
                "Voice recognition error:",
                event.error
            );


            /*
               If microphone permission is denied,
               don't repeatedly restart immediately.
            */

            if (
                event.error ===
                "not-allowed"
            ) {

                console.warn(
                    "Microphone permission was denied."
                );

                return;

            }

        };

}


/* =========================================================
   START VOICE RECOGNITION
========================================================= */

function startVoiceRecognition() {

    if (!recognition) {

        return;

    }


    /*
       Don't start if already listening.
    */

    if (recognitionRunning) {

        return;

    }


    /*
       Only listen on the mode screen.
    */

    if (
        modeScreen.style.display === "none"
    ) {

        return;

    }


    try {

        recognition.start();

    }

    catch (error) {

        console.log(
            "Recognition could not start:",
            error
        );

    }

}


/* =========================================================
   STOP VOICE RECOGNITION
========================================================= */

function stopVoiceRecognition() {

    if (!recognition) {

        return;

    }


    try {

        recognition.stop();

    }

    catch (error) {

        console.log(
            "Recognition already stopped."
        );

    }


    recognitionRunning = false;

}


/* =========================================================
   PROCESS VOICE COMMAND
========================================================= */

function processVoiceCommand(command) {

    /*
       Remove punctuation.
    */

    command =
        command
            .replace(/[.,!?]/g, "")
            .trim();


    console.log(
        "Processing command:",
        command
    );


    /* =====================================================
       BLIND MODE COMMANDS
    ===================================================== */

    const blindCommand =
        (
            command.includes("blind mode") ||
            command.includes("blind user mode") ||
            command.includes("blind user")
        );


    if (blindCommand) {

        /*
           The user can say:

           "Hey Alexa, open blind mode"

           "Alexa open blind mode"

           "Hey Alexa blind mode"

           "Open blind mode"

           "Blind mode"
        */

        if (
            command.includes("hey alexa") ||
            command.includes("alexa") ||
            command.includes("open") ||
            command === "blind mode" ||
            command === "blind"
        ) {

            selectMode("blind");

            return;

        }

    }


    /* =====================================================
       NORMAL MODE COMMANDS
    ===================================================== */

    const normalCommand =
        (
            command.includes("normal mode") ||
            command.includes("normal user mode") ||
            command.includes("normal user")
        );


    if (normalCommand) {

        /*
           Examples:

           "Hey Alexa, open normal mode"

           "Alexa open normal mode"

           "Open normal mode"

           "Normal mode"
        */

        if (
            command.includes("hey alexa") ||
            command.includes("alexa") ||
            command.includes("open") ||
            command === "normal mode" ||
            command === "normal"
        ) {

            selectMode("normal");

            return;

        }

    }


    /* =====================================================
       SHORTER BLIND COMMAND
    ===================================================== */

    if (
        command === "hey alexa open blind" ||
        command === "alexa open blind" ||
        command === "open blind"
    ) {

        selectMode("blind");

        return;

    }


    /* =====================================================
       SHORTER NORMAL COMMAND
    ===================================================== */

    if (
        command === "hey alexa open normal" ||
        command === "alexa open normal" ||
        command === "open normal"
    ) {

        selectMode("normal");

        return;

    }

}


/* =========================================================
   INITIALIZE VOICE SYSTEM
========================================================= */

function initializeVoiceSystem() {

    /*
       Create speech recognition.
    */

    setupVoiceRecognition();


    /*
       Give the user the voice instruction.

       A small delay allows the page UI to
       finish loading first.
    */

    setTimeout(
        function () {

            welcomeVoice();

        },
        800
    );


    /*
       Start microphone recognition.

       Some browsers require user interaction
       before microphone access.
    */

    setTimeout(
        function () {

            startVoiceRecognition();

        },
        1500
    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

/*
   ALT + B
   = Blind Mode

   ALT + N
   = Normal Mode

   ESC
   = Return to mode selection
*/

document.addEventListener(
    "keydown",
    function (event) {


        /* -----------------------------------------
           ALT + B
        ----------------------------------------- */

        if (
            event.altKey &&
            event.key.toLowerCase() === "b"
        ) {

            event.preventDefault();

            selectMode("blind");

        }


        /* -----------------------------------------
           ALT + N
        ----------------------------------------- */

        if (
            event.altKey &&
            event.key.toLowerCase() === "n"
        ) {

            event.preventDefault();

            selectMode("normal");

        }


        /* -----------------------------------------
           ESCAPE
        ----------------------------------------- */

        if (
            event.key === "Escape" &&
            mainWebsite.style.display !== "none"
        ) {

            returnToModeSelection();

        }

    }
);


/* =========================================================
   RETURN TO MODE SELECTION
========================================================= */

function returnToModeSelection() {

    mainWebsite.style.display =
        "none";


    modeScreen.style.display =
        "flex";


    currentMode = null;


    document.body.classList.remove(
        "blind-mode"
    );


    showMessage(
        "Please choose Normal Mode or Blind Mode"
    );


    /*
       Start listening again.
    */

    setTimeout(
        function () {

            startVoiceRecognition();

            normalModeCard.focus();

        },
        300
    );


    speak(
        "Please choose Normal Mode or Blind Mode."
    );

}


/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener(
    "load",
    function () {

        /*
           Always show mode selection
           when the page is opened.
        */

        modeScreen.style.display =
            "flex";


        mainWebsite.style.display =
            "none";


        currentMode = null;


        document.body.classList.remove(
            "blind-mode"
        );


        /*
           Initialize voice.
        */

        initializeVoiceSystem();

    }
);
function goToBlindUser() {
    window.location.href = "../human ai/blind.html";
}
// ==========================================
// WELCOME VOICE
// ==========================================

window.addEventListener("load", function () {

    // Wait a little so the page is fully visible
    setTimeout(function () {

        const welcomeMessage =
            "Welcome to InclusiDesign AI. " +
            "Please select your preferred mode. " +
            "Normal User Mode or Blind User Mode.";

        const speech = new SpeechSynthesisUtterance(welcomeMessage);

        speech.lang = "en-US";
        speech.rate = 0.9;
        speech.pitch = 1;
        speech.volume = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);

    }, 1000);

});