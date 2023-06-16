const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Place = require("../models/Place.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const async = require("hbs/lib/async");

// READ: display all places

router.get("/places", (req, res, next) => {
  Place.find()
    .then((placesFromDb) => {
      const data = {
        places: placesFromDb,
      };
      res.render("places/place-list", data);
    })
    .catch((err) => {
      console.log("error getting list of places from DB", err);
      next(err);
    });
});

//CREATE: display form
router.get("/places/create", isLoggedIn, (req, res, next) => {
  if (req.session.currentUser) {
    res.render("places/place-create", { userDetails: req.session.currentUser });
  } else {
    res.render("/login");
  }
});
//CREATE: process form
router.post("/places/create", isLoggedIn, (req, res, next) => {
  const newPlace = {
    name: req.body.name,
    address: {
      country: req.body.country,
      city: req.body.city,
      street: req.body.street,
    },
    // postalCode: req.body.postalCode,
    review: {
      score: req.body.score,
      comment: req.body.comment,
    },
  };

  Place.create({ ...newPlace, creator: req.session.currentUser._id })
    .then((createdPlace) => {
      console.log("CREATED PLACE", createdPlace);
      res.redirect("/places");
    })
    .catch((err) => {
      console.log("error creating new place", err);
      next(err);
    });
});

//UPDATE: display form
router.get("/places/:placeId/edit", isLoggedIn, async (req, res, next) => {
  const { placeId } = req.params;

  try {
    const placeDetails = await Place.findById(placeId);

    res.render("places/place-edit", { place: placeDetails });
  } catch (err) {
    next(err);
  }
});

//UPDATE: process form
router.post("/places/:placeId/edit", isLoggedIn, (req, res, next) => {
  const { placeId } = req.params;
  const { name, country, city, street, score, comment } = req.body;

  console.log("edit", placeId, req.body);
  Place.findByIdAndUpdate(
    placeId,
    { name, address: {country, city, street}, review: { score, comment} },
    { new: true }
  )
    .then((updatedPlace) => res.redirect(`/places/${updatedPlace.id}`)) // go to the details page to see the updates
    .catch((error) => next(error));
});

//DELETE: delete place
router.post("/places/:placeId/delete", isLoggedIn, (req, res, next) => {
  const { placeId } = req.params;

  Place.findByIdAndDelete(placeId)
    .then(() => res.redirect("/places"))
    .catch((err) => next(err));
});

//READ: display details of one place
router.get("/places/:placeId", (req, res, next) => {
  const id = req.params.placeId;
  const user = req.session.currentUser;
  Place.findById(id)
    .then((place) => {
      res.render("places/place-details", { place: place, user: user });
    })
    .catch((err) => {
      console.log("error getting place details from DB", err);
    });
});

module.exports = router;
