const express = require("express");

const router = express.Router();

router.post("/analyze", (req, res) => {

    const { design } = req.body;

    if (!design) {
        return res.status(400).json({
            error: "Please provide design information."
        });
    }

    // Temporary AI-style analysis
    // We will connect the real LLM later.

    const result = {
        score: 82,

        accessibility: 86,

        readability: 74,

        visualHierarchy: 91,

        issues: [
            "Primary button may need better visibility.",
            "Some text may need stronger hierarchy.",
            "Consider improving keyboard accessibility."
        ],

        suggestions: [
            "Increase contrast for important buttons.",
            "Use clearer heading sizes.",
            "Add visible focus states for interactive elements."
        ]
    };

    res.json(result);
});

module.exports = router;