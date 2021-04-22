const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/", userController.getAllUsers);
router.get("/:phone", userController.getUser);

// Sign-up a User
router.post("/add", userController.addUser);

// Delete user
router.delete("/delete/:phone", userController.deleteUser);

module.exports = router;
