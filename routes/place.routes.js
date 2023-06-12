const express = require("express");
const router = express.Router();

const Place = require("../models/Place.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const async = require("hbs/lib/async");

// READ: display all places

router.get("/places", (req, res, next) => {
  Place.find()
    .then((placesFromDb) => {
      const data = {
        places: placesFromDb,
      };
      res.render("places/places-list", data);
    })
    .catch((err) => {
      console.log("error getting list of places from DB", err);
      next(err);
    });
});

//CREATE: display form
router.get("/places/create", isLoggedIn, (req, res, next) => {
  res.render("places/place-create").catch((err) => {
    console.log("error displaying create form", err);
  });
});
//CREATE: process form
router.post("/places/create"),
  isLoggedIn,
  (req, res, next) => {
    const newPlace = {
      title: req.body.title,
      description: req.body.description,
      address: req.body.address,
      review: req.body.review,
    };
    Place.create(newPlace)
      .then((newPlace) => {
        res.redirect("/places");
      })
      .catch((err) => {
        console.log("error creating new place", err);
        next(err);
      });
  };

  //UPDATE: display form
  router.get("places/:placeId/edit", isLoggedIn, async (req, res , next) =>{
    const {placeId} = req.params;

    try{
        const placeDetails = await Place.findById(placeId)
    
    res.render("places/place-edit.hbs", {place: placeDetails})
    } catch(err) {
        next(err)
    }
})

//UPDATE: process form
router.post("/places/place-edit.hbs", isLoggedIn, (req, res, next) =>{
    const {placeId} = req.params;
    const {title, description, address, review} = req.body;

    Place.findByIdAndUpdate(
        placeId,
        {title, description, address, review},
        {new: true}
    )
    .then((updatedPlace)=> res.redirect(`/places/${updatedPlace.id}`))
    .catch((err)=> next(err));
})

//DELETE: delete place
router.post("/places/:placeId/delete", (req, res, next) => {
    const {placeId} = req.params

    Place.findByIdAndDelete(placeId)
    .then(() => res.redirect("/places"))
    .catch((err) => next(err))
});

//READ: display details of one place
router.get("/places/:placeId", (req, res , next) => {
    const id = req.params.bookId;

    Place.findById(id)
    .then((placesFromDb) =>{
        res.render("places/place-details", placesFromDb);
    })
    .catch((err) => {
        console.log("error getting place details from DB", err);
    })
})

module.exports = router;