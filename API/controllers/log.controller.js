const { logModel } = require("./../datasource/MongoDB.datasource")

// Create a log in Mongo Database
async function createLog(userId, action, table, jsonData) {
    const date = new Date()
    const log = new logModel({
        date: date,
        userId: userId,
        action: action,
        table: table,
        jsonData, jsonData
    })
    const result = await log.save()
}

// Get All Logs
async function findAll() {
    const logs = await logModel.find()
    return { status: 200, data: logs } 
}

async function deleteAll() {
    await logModel.deleteMany({})
    return { status: 200, data: "" } 
}

module.exports = {
    createLog,
    findAll,
    deleteAll
}