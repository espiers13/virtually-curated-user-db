const {
  fetchAllUsers,
  fetchUserLogin,
  createNewUser,
  removeUser,
} = require("../models/users-models");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers().then((usersData) => {
    res.status(200).send(usersData);
  });
};

exports.getUserByUsernamePassword = (req, res, next) => {
  const { username, password } = req.params;
  fetchUserLogin(username, password)
    .then((userData) => {
      res.status(200).send(userData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewUser = (req, res, next) => {
  const newUser = req.body;
  createNewUser(newUser)
    .then((userData) => {
      res.status(201).send(userData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteUserByUsernamePassword = (req, res, next) => {
  const { username, password } = req.params;
  removeUser(username, password)
    .then((removedUser) => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
