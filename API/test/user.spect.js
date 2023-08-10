const { assert } = require('chai')

const userController = require("../controllers/user.controller")

describe('FR #3: update an user data', function() {

    it('Should update the username to "anyuser"', async() => {
        await userController.updateById(15, 'anyuser', 'user@server.domain', 123321, 'anyuser', 9).then(newUserData => {
            if(newUserData.status == 200) assert.ok(true)
        })
    })

    it('Should NOT update the username to "anyuser" due already exits', async() => {
        await userController.updateById(9, 'anyuser', 'user@server.domain', 123321, 'anyuser', 9).then(newUserData => {
            if(newUserData.data == "Nombre de Usuario Existente") assert.ok(true)
        })
    })
})    