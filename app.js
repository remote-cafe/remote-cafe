// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

hbs.registerPartials(__dirname + "/views/partials"); //tell HBS which directory we use for partials

app.set("views", __dirname + "/views"); //tells our Express app where to look for our views
app.set("view engine", "hbs"); //sets HBS as the template engine

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "remote-cc";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

hbs.registerHelper("isOwner", (userId, placeCreator) =>{
  console.log(userId, placeCreator)
  return userId === String(placeCreator)
})

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});

// 👇 Start handling routes here

app.use("/", require("./routes/index.routes"));
app.use("/", require("./routes/auth.routes"));
app.use("/", require("./routes/place.routes"));
app.use("/", require("./routes/about.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
