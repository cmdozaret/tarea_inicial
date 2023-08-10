const auth = require('./../auth/auth')
const { create, findAll, findOneById, updateById, deleteById, assign } = require('./../controllers/user.controller')
const { ROLE } = require("./../config/role.config")

module.exports = function(app) { 
    // assign roles to user
    app.post('/user/assign', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        const { id, roleId } = req.body
        const userId = req.user.id
        assign(id, roleId, userId).then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // insert a user into database
    app.post('/user', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        const { username, email, contactnumber, password } = req.body
        const userId = req.user.id
        create(username, email, contactnumber, password, userId).then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // Read All Users
    app.get('/user', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        findAll().then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // Read One User
    app.get('/user/:id', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        const id = req.params.id
        findOneById(id).then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // Update (set) One User Information
    app.put('/user', auth.authUser, auth.authPermissionsOnUser, async (req, res) => {
        const { id, username, email, contactnumber, password } = req.body
        const userId = req.user.id
        updateById(id, username, email, contactnumber, password, userId).then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // Delete One User
    app.delete('/user/:id', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        const id = req.params.id
        const userId = req.user.id
        deleteById(id, userId).then(response => {
            res.status(response.status).json(response.data)
        })
    })
}