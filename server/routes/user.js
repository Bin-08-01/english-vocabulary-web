const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
// const clientController = require("../controllers/clientController");

router.get("/all", userController.viewAll);
router.get("/add", userController.form);
router.post("/add", userController.create);
router.get("/", userController.view);
router.post("/", userController.find);
router.get("/edit/:id", userController.edit);
router.post("/edit/:id", userController.update);
router.get("/:id", userController.remove);

module.exports = router;