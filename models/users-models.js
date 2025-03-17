const db = require("../db/connection");

exports.fetchAllUsers = () => {
  return db.query(`SELECT username FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserLogin = (username, password, user_id) => {
  let query = null;
  let str = "";

  if (username) {
    query = username;
    str = `username = $1`;
  } else if (!username && user_id) {
    query = user_id;
    str = `user_id = $1`;
  }

  const queryStr = `SELECT * FROM users WHERE ${str} AND password = $2;`;

  return db.query(queryStr, [query, password]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 401,
        msg: "Username and password do not match",
      });
    } else return rows[0];
  });
};

exports.createNewUser = (newUser) => {
  let queryStr = `INSERT INTO users (name, username, email, password) values ($1, $2, $3, $4) RETURNING *;`;
  const values = [
    newUser.name,
    newUser.username,
    newUser.email,
    newUser.password,
  ];

  return db.query(queryStr, values).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeUser = (username, password) => {
  return db
    .query(
      `DELETE FROM users WHERE username = $1 AND password = $2 RETURNING *;`,
      [username, password]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 401,
          msg: "Username and password do not match",
        });
      } else return rows;
    });
};
