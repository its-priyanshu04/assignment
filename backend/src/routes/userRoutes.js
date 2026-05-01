const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { listUsers } = require("../controllers/userController");

const router = express.Router();

router.use(authMiddleware);
router.get("/", listUsers);

module.exports = router;
