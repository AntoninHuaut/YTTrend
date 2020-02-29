const router = require("express").Router();
const controller = require("../controllers/api_c");

router.get("/", controller.listTrend);
router.get("/:startDate/:endDate?", controller.listVideoTrend);

module.exports = router;