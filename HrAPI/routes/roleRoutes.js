const express = require("express");

const {
    getRoles
} = require("../controllers/roleController");

const {
    authentication,
    authenticateToken
} = require("../middleware/authMiddleware")

const router = express.Router();

router.get("/", authenticateToken, getRoles);

module.exports = router;