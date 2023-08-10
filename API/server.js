require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

require("./routes/auth.routes")(app)
require("./routes/parking.routes")(app)
require("./routes/rent.routes")(app)
require("./routes/user.routes")(app)
require("./routes/log.routes")(app)

const port = isNaN(process.env.SERVER_PORT) ? 3000 : Number(process.env.SERVER_PORT)
app.listen(port)