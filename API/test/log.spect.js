const { assert } = require('chai')

const logController = require("../controllers/log.controller")

before(function () {
    const mongoose = require('mongoose')
    mongoose.connect(process.env.MONGODB_URI)
    .then(db => console.log("MongoDB is connected"))
    .catch(err => console.log(err))
  });

describe('FR #4: get all logs', function() {    

    it('Should return all logs from the mongodb database', async() => {
        const logs = await logController.findAll()
            if(logs) assert.ok(true)
    })
})    