const router = require("express").Router();
const controller = require("../controllers/statistics_c.js");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

router.get("/select", controller.selectDateInterval);

router.post("/stats", urlencodedParser, controller.showStats);

module.exports = router;