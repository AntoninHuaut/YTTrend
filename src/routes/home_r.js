const router = require("express").Router();

router.get("/", require("../controllers/home_c").home);

module.exports = router;