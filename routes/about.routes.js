const express = require("express");
const router = express.Router();

//about

router.get("/about", (req, res, next) => {
  res.render("about").catch(err);
  console.log("error getting this page", err);
  next(err);
});

module.exports = router;
