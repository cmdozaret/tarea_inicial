const auth = require('./../auth/auth')
const { findAll, deleteAll } = require("./../controllers/log.controller")
const { ROLE } = require("./../config/role.config")

module.exports = function(app) {    
    // Get All Logs
    app.get('/log', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        findAll().then(response => {
            res.status(response.status).json(response.data)
        })
    })
    
    // Delete All Logs From Mongo Database
    app.delete('/log', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        deleteAll().then(response => {
            res.status(response.status).json(response.data)
        })
    })
}