const { create, findAll, findOneById, updateById, deleteById } = require('../controllers/rent.controller')
const auth = require('./../auth/auth')
const { ROLE } = require("./../config/role.config")

module.exports = function(app) { 
    // Create a Rent. Check first if there is capacity for that parking at that specific time
    app.post('/rent', auth.authUser, auth.authROLE(ROLE.ROLE_CLIENT), async (req, res) => {
        const { idparking, initialdate, enddate, idcar } = req.body
        const userid = req.user.id
        const result = await create(idparking, initialdate, enddate, idcar, userid)
        res.status(result ? result.status : 500).json(result ? result.data : "")
    })

    // Read All Rents
    app.get('/rent', auth.authUser, auth.authROLE(ROLE.ROLE_ADMIN), async (req, res) => {
        findAll().then(response => {
            res.status(response ? response.status : 500).json(response ? response.data : "")
        })
    })

    // Read One Rent
    app.get('/rent/:id', auth.authUser, auth.authPermissionsOnOneRent, async (req, res) => {
        const id = req.params.id
        findOneById(id).then(response => {
            res.status(response ? response.status : 500).json(response ? response.data : "")
        })
    })

    // Update (set) One Rent Information
    app.put('/rent/:id', auth.authUser, auth.authPermissionsOnOneRent, async (req, res) => {
        const { initialdate, enddate, idcar } = req.body
        const id = req.params.id
        const userId = req.user.id
        updateById(id, initialdate, enddate, idcar, userId).then(response => {
            res.status(response ? response.status : 500).json(response ? response.data : "")
        })
    })

    // Delete One Rent
    app.delete('/rent/:id', auth.authUser, auth.authPermissionsOnOneRent, async (req, res) => {
        const id = req.params.id
        const userId = req.user.id
        deleteById(id, userId).then(response => {
            res.status(response ? response.status : 500).json(response ? response.data : "")
        })
    })
 }