var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminControllers");

router.get("/", adminController.getAllUsers);
router.get("/getAllUsers", adminController.getAllUsers)
router.put("/disableUser", adminController.disableUser);
router.put("/enableUser", adminController.enableUser);

router.get("/getAllSports", adminController.getAllSports)
router.put("/disableSport", adminController.disableSport);
router.put("/enableSport", adminController.enableSport);

module.exports = router;
