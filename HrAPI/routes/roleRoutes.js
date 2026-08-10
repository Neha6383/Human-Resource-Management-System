const express = require("express");

const {
    getRoles
} = require("../controllers/roleController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware")

const router = express.Router();

router.get(
    "/", 
    authenticateToken, 
    getRoles);

router.get(
    "/admin-test",
    authenticateToken,
    authorizeRoles("Admin"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome Admin",
            user: req.user
        });
    }
)    ;

module.exports = router;