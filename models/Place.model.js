const { Schema, model, mongoose } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const placeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address:{
      country:{
        type: String,
        required: true
      },
      city:{
        type: String,
        required: true
      },
      street:{
        type: String,
        required: true
      },
    },
    review: {
      score:{
        type: Number,
        max:5,
        min:1,
        required: true
      },
      comment:{
        type: String,
      required: true,
    },
   
  } ,creator: {
      type: mongoose.Types.ObjectId, ref: "User"
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Place = model("Place", placeSchema);

module.exports = Place;
