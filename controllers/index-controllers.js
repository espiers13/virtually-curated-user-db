const { getEndpoints } = require("./endpoints-controller");
const {
  getAllUsers,
  getUserByUsernamePassword,
  postNewUser,
  deleteUserByUsernamePassword,
} = require("./user-info-controllers");
const {
  getCollectionsByUser,
  getCollectionByUserAndId,
  postNewCollection,
  patchCollectionById,
  deleteObjectFromCollection,
  deleteCollectionByUsernamePassword,
} = require("./collections-controllers");

module.exports = {
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
};
