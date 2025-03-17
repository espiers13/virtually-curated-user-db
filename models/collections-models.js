const db = require("../db/connection");

exports.fetchCollectionsByUser = (user_id) => {
  return db
    .query(
      `SELECT collection_id, collection_name, collection FROM collections WHERE user_id = $1;`,
      [user_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No collections found",
        });
      } else return rows;
    });
};

exports.fetchCollectionByUserAndId = (user_id, collection_id) => {
  return db
    .query(
      `SELECT collection_id, collection_name, collection FROM collections WHERE user_id = $1 AND collection_id = $2`,
      [user_id, collection_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Collection not found",
        });
      } else return rows[0];
    });
};

exports.createNewCollection = (user_id, collection_name) => {
  return db
    .query(
      `INSERT INTO collections (collection_name, user_id) values ($1, $2) RETURNING *;`,
      [collection_name, user_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.addObjectToCollectionById = (objectId, collection_id, user_id) => {
  return db
    .query(
      `UPDATE collections SET collection = array_append(collection, $1) WHERE collection_id = $2 AND user_id = $3 RETURNING *;`,
      [objectId, collection_id, user_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Collection does not exist",
        });
      } else return rows[0];
    });
};

exports.removeObjectFromCollectionById = (objectId, collection_id, user_id) => {
  return db
    .query(
      `UPDATE collections SET collection = array_remove(collection, $1) WHERE collection_id = $2 RETURNING *;`,
      [objectId, collection_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCollectionById = (user_id, collection_id) => {
  return db
    .query(
      `DELETE FROM collections WHERE user_id = $1 AND collection_id = $2 RETURNING *`,
      [user_id, collection_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Collection does not exist",
        });
      } else return rows;
    });
};
