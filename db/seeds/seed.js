const format = require("pg-format");
const db = require("../connection");

const seed = ({ usersData, collectionsData }) => {
  return db
    .query(`DROP TABLE IF EXISTS collections;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (   
            user_id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            username VARCHAR NOT NULL UNIQUE,
            email VARCHAR NOT NULL UNIQUE,
            password VARCHAR NOT NULL
        );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE collections (
        collection_id SERIAL PRIMARY KEY,
        collection_name VARCHAR NOT NULL UNIQUE,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        collection TEXT[] DEFAULT array[]::int[]
      );`);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (name, username, email, password) VALUES %L RETURNING *;",
        usersData.map(({ name, username, email, password }) => [
          name,
          username,
          email,
          password,
        ])
      );
      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const insertCollectionsQueryStr = format(
        "INSERT INTO collections (user_id, collection_name, collection) VALUES %L RETURNING *;",
        collectionsData.map(({ user_id, collection_name, collection }) => [
          user_id,
          collection_name,
          collection ? `{${collection.join(",")}}` : "{}",
        ])
      );
      return db.query(insertCollectionsQueryStr);
    });
};

module.exports = seed;
