const express = require("express");
require("dotenv").config();

const router = require("./routes");

const app = express();

app.use(express.json());

app.use("/api/v1", router);

app.use(function (err, req, res, next) {
  res.status(500);
  res.send("Oops, something went wrong.");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server running on port:", port);
});
