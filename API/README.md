# Guajirito backend Test

This project was created with:
- [Express] - fast node.js network app framework
- [PostgreSQL] - permanent data database
- [MongoDB] - logs database

## Software Requirements
First Should Install This Programs
- [Node.js] - JavaScript runtime environment
- [PostgreSQL] - open source object-relational database 
- [MongoDB] - open source document-oriented database 

Once installed, must create a database in your postgres server named 'express', and restore the _express_ backup in it. The backup is located inside 'backup' folder, at root directory.

## Available Scripts
Before you are able to run the app you need to install the dependencies
```sh
cd path_of_the_cloned_app
cd API
npm install
```

## Run the Project
The api use an environment file for its configurations, you can provide that file if you don't it will use the default values.

`PORT=3000` default port to run at the server

For the connection to MongoDB the API use this values:
`MONGO_URL=mongodb://0.0.0.0/express`

For the connection to PostgreSQL the API use this values:
`PG_USER=postgres` default user
`PG_PASSWORD=postgres` default password
`PG_HOST=localhost` default server address
`PG_PORT=5432` default PostgreSQL port

For development you can run the app like this:
```sh
npm run dev
```
For run as a service you can run it like this:
```sh
npm run build
npm run start
```

### Postman Request
The API comes with a [Postman] Request Collection to test most requirements. In order to use it first must either install [desktop Postman], or create an acount and register at the web service provided by [Postman]. Once installed, import the '_guajirito collection.postman_collection.json_' file into the app and test the Requests. The file is located inside the folder named 'Postman collection', at root directory.

### API tests
The tests where made with mochajs
```sh
npm run test
```
   [express]: <http://expressjs.com>
   [PostgreSQL]: <https://www.postgresql.org/>
   [MongoDB]: <https://www.mongodb.com/>
   [node.js]: <http://nodejs.org>
   [Postman]: <https://www.postman.com/>
   [desktop Postman]: <https://www.postman.com/downloads/>