const auth = require('./../auth/auth')
const { create, findAll, findOneById, updateById, deleteById, currentParkingStatus } = require('./../controllers/parking.controller')
const { ROLE } = require("./../config/role.config")

module.exports = function(app) { 
    // RF 2
    // Get Current Parking Status
    app.get('/parking/status', auth.authUser, auth.authROLE(ROLE.ROLE_EMPLOYEE), async (req, res) => {
        const { idParking } = req.body
        currentParkingStatus(idParking).then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // Create Parking
    app.post('/parking', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        const { maxCapacity } = req.body
        const userId = req.user.id
        create(maxCapacity, userId).then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // Read All Parkings
    app.get('/parking', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        findAll().then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // Read One Parking
    app.get('/parking/:id', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        const id = req.params.id
        findOneById(id).then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // Update (set) One Parking Information
    app.put('/parking', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        const { id, maxCapacity } = req.body
        const userId = req.user.id
        const response = await updateById(id, maxCapacity, userId)
        res.status(response.status).json(response.data)
    })

    // Delete One Parking
    app.delete('/parking', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        const { id } = req.body
        const userId = req.user.id
        deleteById(id, userId).then(response => {
            res.status(response.status).json(response.data)
        })
    })    
 }