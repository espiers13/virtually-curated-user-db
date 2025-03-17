const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

// ENDPOINTS TEST:

describe("Endpoints test - GET /api", () => {
  test("status code 200: will return a json representaiton of all of the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toMatchObject(endpoints);
      });
  });
});

// USERS TESTS:

// GET ALL USERS

describe("GET ALL USERS - GET /api/users", () => {
  test("status code 200: will return an array of all usernames in the database", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        body.forEach((user) => {
          expect(user).toHaveProperty("username");
        });
      });
  });
});

// GET USER BY USERNAME & PASSWORD

describe("GET USER DETAILS BY USERNAME AND PASSWORD - GET /api/user/:username/:password", () => {
  test("status code 200: returns an object containing user info matching the username and password", () => {
    return request(app)
      .get("/api/user/alicej/P@ssw0rd123")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          name: "Alice Johnson",
          username: "alicej",
          email: "alice.johnson@example.com",
          password: "P@ssw0rd123",
          user_id: 1,
        });
      });
  });
  test("status code 401: returns appropriate status code and error message when username and password do not match", () => {
    return request(app)
      .get("/api/user/alicej/notapassword")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Username and password do not match");
      });
  });
});

// POST NEW USER
describe("POST USER - POST /api/users", () => {
  test("status code 201: posts a new user to users database and returns the new user", () => {
    const newUser = {
      name: "Emily Spiers",
      username: "emilys123",
      email: "test@email.com",
      password: "testpassword",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject(newUser),
          expect(body).toHaveProperty("user_id");
      });
  });
  test("status 400: returns appropriate status code and error message when invalid user is passed through (missing some data)", () => {
    const newUser = {
      name: "Emily Spiers",
      email: "test@email.com",
      password: "testpassword",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'error: null value in column "username" of relation "users" violates not-null constraint'
        );
      });
  });
  test("status 409: returns appropriate status code and error message when username already exists", () => {
    const newUser = {
      name: "Emily Spiers",
      username: "alicej",
      email: "test@email.com",
      password: "testpassword",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(409)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `error: duplicate key value violates unique constraint "users_username_key"`
        );
      });
  });
  test("status 409: returns appropriate status code and error message when email already exists", () => {
    const newUser = {
      name: "Emily Spiers",
      username: "testUsername",
      email: "alice.johnson@example.com",
      password: "testpassword",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(409)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `error: duplicate key value violates unique constraint "users_email_key"`
        );
      });
  });
});

// DELETE USER BY USERNAME AND PASSWORD

describe("DELETE USER - /api/user/:username/:password", () => {
  test("status 204: deletes user and returns empty object", () => {
    return request(app)
      .delete("/api/user/alicej/P@ssw0rd123")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("status 401: returns appropriate error code and message when password does not match username", () => {
    return request(app)
      .delete("/api/user/alicej/notapassword")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Username and password do not match");
      });
  });
});

// GET COLLECTIONS BY USER_ID

describe("GET COLLECTIONS - /api/collections/:user_id", () => {
  test("status 200: returns an array of all collection objects associated with given user_id", () => {
    return request(app)
      .get("/api/collections/1")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        body.forEach((collection) => {
          expect(collection).toHaveProperty("collection_name");
          expect(collection).toHaveProperty("collection");
          expect(collection).toHaveProperty("collection_id");
        });
      });
  });
  test("status 404: returns appropriate status code and message when user_id does not have any collections", () => {
    return request(app)
      .get("/api/collections/5")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No collections found");
      });
  });
});

// GET COLLECTION BY NAME/ID AND USER_ID

describe("GET COLLECTION BY ID - /api/collections/:user_id/:collection_id", () => {
  test("status 200: returns a collection object matching the user_id and collection_id given", () => {
    return request(app)
      .get("/api/collections/1/2")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          collection_id: 2,
          collection_name: "Sculptures",
          collection: ["O223344", "O334455", "O445566", "O556677", "O667788"],
        });
      });
  });
  test("status 404: returns appropriate status code and message when given a non-existent collection_id or user_id", () => {
    return request(app)
      .get("/api/collections/1/4")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Collection not found");
      });
  });
});

// POST - CREATE NEW COLLECTION BY USER_ID AND PASSWORD

describe("POST COLLECTION - /api/collections/:user_id/:password", () => {
  test("status 201: posts a new collection (empty array) linked to a user_id when given correct id/password combination, and a collection name", () => {
    const newCollection = {
      collection_name: "Test",
    };
    return request(app)
      .post("/api/collections/1/P@ssw0rd123")
      .send(newCollection)
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          user_id: 1,
          collection_id: 6,
          collection_name: "Test",
          collection: [],
        }),
          expect(body).toHaveProperty("collection_id");
      });
  });
  test("status 401: returns appropriate status code and message when password does not match user_id", () => {
    const newCollection = {
      collection_name: "Test",
    };
    return request(app)
      .post("/api/collections/1/notapassword")
      .send(newCollection)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Username and password do not match");
      });
  });
  test("status 400: returns appropriate status code and message when no collection title is passed through", () => {
    const newCollection = {
      collection_name: null,
    };
    return request(app)
      .post("/api/collections/1/P@ssw0rd123")
      .send(newCollection)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'error: null value in column "collection_name" of relation "collections" violates not-null constraint'
        );
      });
  });
});

// PATCH - ADD NEW OBJECT ID TO COLLECTION

describe("PATCH NEW OBJECT TO COLLECTION - /api/collections/:user_id/:password/:collection_id", () => {
  test("status 200: adds a new object_id to a collection array and returns the collection", () => {
    const newObject = {
      objectId: "O222333",
    };
    return request(app)
      .patch("/api/collections/1/P@ssw0rd123/1")
      .send(newObject)
      .expect(200)
      .then(({ body }) => {
        const collection = body.collection;
        expect(Array.isArray(collection)).toBe(true);
        expect(collection.length).toBeGreaterThan(0);
        expect(collection).toContain(newObject.objectId);
        expect(body.collection_id).toBe(1);
      });
  });
  test("status 401: returns appropriate status code and message when password does not match user_id", () => {
    const newObject = {
      objectId: "O222333",
    };
    return request(app)
      .patch("/api/collections/1/notapassword/1")
      .send(newObject)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Username and password do not match");
      });
  });
  test("status 401: returns appropriate status code and message when invalid collection ID is passed through", () => {
    const newObject = {
      objectId: "O222333",
    };
    return request(app)
      .patch("/api/collections/1/P@ssw0rd123/100")
      .send(newObject)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Collection does not exist");
      });
  });
});

// PATCH - REMOVE OBJECT ID FROM COLLECTION

describe("REMOVE OBJ FROM ARRAY - /api/collections/:user_id/:password/:collection_id/remove", () => {
  test("status 204: removes object from collecion array and returns updated collection", () => {
    const removeObject = { objectId: "O123456" };
    return request(app)
      .patch("/api/collections/1/P@ssw0rd123/1/remove")
      .send(removeObject)
      .expect(200)
      .then(({ body }) => {
        const collection = body.collection;
        expect(Array.isArray(collection)).toBe(true);
        expect(collection).not.toContain(removeObject.objectId);
        expect(body.collection_id).toBe(1);
      });
  });
  test("status 401: returns appropriate status code and message when password does not match user_id", () => {
    const removeObject = { objectId: "O123456" };
    return request(app)
      .patch("/api/collections/1/notapassword/1")
      .send(removeObject)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Username and password do not match");
      });
  });
});

// DELETE COLLECTION WITH USER_ID, PASSWORD, AND COLLECTION_ID

describe("DELTE COLLECTION - /api/collections/:user_id/:password/:collection_id", () => {
  test("status 204: deletes collection and returns an empty object", () => {
    return request(app)
      .delete("/api/collections/1/P@ssw0rd123/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("status 401: returns appropriate error code and message when password does not match username", () => {
    return request(app)
      .delete("/api/collections/1/notapassword/1")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Username and password do not match");
      });
  });
  test("status 401: returns appropriate error code and message when non existent collection_id passed through", () => {
    return request(app)
      .delete("/api/collections/1/P@ssw0rd123/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Collection does not exist");
      });
  });
});
