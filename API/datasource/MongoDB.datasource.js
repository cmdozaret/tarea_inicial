// connector to MongoDB database
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)
.then(db => console.log("MongoDB is connected"))
.catch(err => console.log(err))

const logSchema = mongoose.Schema({
    date: Date,
    userId: Number,
    action: String,
    table: String,
    jsonData: String
})

const logModel = mongoose.model('log', logSchema)

module.exports = {
    logModel
}