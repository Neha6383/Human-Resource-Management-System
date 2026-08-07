const express = require("express");

const app = express();

const PORT = 5000

app.get("/", (req, res) => {
    res.send("HRMS backend is running...");
});

app.listen(PORT, () => {
    console.log(`Server is runnning on http://localhost:${PORT}`);
});