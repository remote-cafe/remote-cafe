const express = require("express");
const router = express.Router();

//about

router.get("/about", (req, res, next) => {
  res.render("about")
});

module.exports = router;
