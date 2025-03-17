const express = require("express");
const app = express();

const {
  getEndpoints,
  getAllUsers,
  getUserByUsernamePassword,
  postNewUser,
  deleteUserByUsernamePassword,
  getCollectionsByUser,
  getCollectionByUserAndId,
  postNewCollection,
  patchCollectionById,
  deleteObjectFromCollection,
  deleteCollectionByUsernamePassword,
} = require("./controllers/index-controllers");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/errors");

app.use(express.json());

// GET REQUESTS

app.get("/api", getEndpoints);

app.get("/api/users", getAllUsers);

app.get("/api/user/:username/:password", getUserByUsernamePassword);

app.get("/api/collections/:user_id", getCollectionsByUser);

app.get("/api/collections/:user_id/:collection_id", getCollectionByUserAndId);

// POST REQUESTS

app.post("/api/users", postNewUser);

app.post("/api/collections/:user_id/:password", postNewCollection);

// DELETE REQUESTS

app.delete("/api/user/:username/:password", deleteUserByUsernamePassword);

app.delete(
  "/api/collections/:user_id/:password/:collection_id",
  deleteCollectionByUsernamePassword
);

// PATCH REQUESTS

app.patch(
  "/api/collections/:user_id/:password/:collection_id",
  patchCollectionById
);

app.patch(
  "/api/collections/:user_id/:password/:collection_id/remove",
  deleteObjectFromCollection
);

// Error handling

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found!" });
});

module.exports = app;
