const express = require("express");
const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__basedir + '/static')));

router.use("/", require("./home_r"));
router.use("/api", require("./api_r"));
router.use("/statistics", require("./statistics_r"));

module.exports = router;