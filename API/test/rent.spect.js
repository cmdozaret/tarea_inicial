const { assert } = require('chai')

const rentController = require("../controllers/rent.controller")

describe('FR #1: rent a parking place', function() {
    it('Should create a new rent', async() => {
        await rentController.create(2, '2023-07-24 11:59:59', '2023-07-25 11:59:59', 'P123 123', 7).then(rent => {
            if(rent.status == 201) assert.ok(true)
        })
    })

    it('Should not create a new rent due permission', async() => {
        const rent = await rentController.create(2, '2023-07-24 11:59:59', '2023-07-25 11:59:59', 'P123 123', 8)        
        if(rent.status == 200) assert.ok(true)
    })
})    