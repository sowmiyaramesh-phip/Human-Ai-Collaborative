const express = require("express");
const cors = require("cors");

const normalAPI = require("./normal-api");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/normal", normalAPI);

app.get("/", (req, res) => {
    res.json({
        message: "InclusiDesign Backend is running!"
    });
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});