const {
  fetchCollectionsByUser,
  fetchCollectionByUserAndId,
  createNewCollection,
  addObjectToCollectionById,
  removeObjectFromCollectionById,
  removeCollectionById,
} = require("../models/collections-models");

const { fetchUserLogin } = require("../models/users-models");

exports.getCollectionsByUser = (req, res, next) => {
  const { user_id } = req.params;
  fetchCollectionsByUser(user_id)
    .then((collectionsData) => {
      res.status(200).json(collectionsData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCollectionByUserAndId = (req, res, next) => {
  const { user_id, collection_id } = req.params;
  fetchCollectionByUserAndId(user_id, collection_id)
    .then((collectionData) => {
      res.status(200).json(collectionData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewCollection = (req, res, next) => {
  const { user_id, password } = req.params;
  const { collection_name } = req.body;

  fetchUserLogin(null, password, user_id)
    .then((data) => {
      if (data) {
        createNewCollection(user_id, collection_name)
          .then((newCollection) => {
            res.status(201).json(newCollection);
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCollectionById = (req, res, next) => {
  const { user_id, password, collection_id } = req.params;
  const { objectId } = req.body;

  fetchUserLogin(null, password, user_id)
    .then((data) => {
      addObjectToCollectionById(objectId, collection_id, user_id)
        .then((collectionData) => {
          res.status(200).json(collectionData);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteObjectFromCollection = (req, res, next) => {
  const { user_id, password, collection_id } = req.params;
  const { objectId } = req.body;

  fetchUserLogin(null, password, user_id)
    .then((data) => {
      removeObjectFromCollectionById(objectId, collection_id, user_id)
        .then((updatedCollection) => {
          res.status(200).json(updatedCollection);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCollectionByUsernamePassword = (req, res, next) => {
  const { user_id, password, collection_id } = req.params;

  fetchUserLogin(null, password, user_id)
    .then((data) => {
      removeCollectionById(user_id, collection_id)
        .then(() => {
          res.status(204).json({});
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};
