# Virtually Curated User Database

Hosted on: Render
// INSERT URL TO API //

Virtually Curated User Database is an API built for the purpose of accessing user data for a front end application.
This is the backend service which provides user information including collections saved to the front end architecture.

The API has the following endpoints:
GET /api
GET /api/users
GET /api/users/:username/:password
GET /api/collections/:user_id
GET /api/collections/:user_id/:collection_id
POST /api/users
POST /api/collections/:user_id/:password
DELETE /api/user/:username/:password
DELETE /api/:user_id/:password/:collection_id
PATCH /api/collections/:user_id/:password/:collection_id
PATCH /api/collections/:user_id/:password/:collection_id/remove

This datbase is run with PostgreSQL and node-postgres.

To install PostgreSQL: https://www.w3schools.com/postgresql/postgresql_install.php

To install npm:
npm install npm@latest -g

Installation:

1. Clone the repo:
   https://github.com/espiers13/hidden-gems.git

2. Install dependencies:
   npm install

3. devDependencies used:
   {
   "husky": "^8.0.2",
   "jest": "^29.6.2",
   "supertest": "^6.1.3"
   }

4. In order to successfully connect the two databases in be-nc-news locally the following files must be added:
   .env.development
   .env.test

These files must contain the following:
.env.development --> PGDATABASE=virtually_curated
.env.test --> PGDATABASE=virtually_curated_test

5. In order to set up the database run command:
   npm run setup-dbs

6. To seed the local database run command:
   npm run seed

7. Tests are run using jest supertest. To run tests use command:
   npm run test
