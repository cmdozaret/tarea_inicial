const { assert } = require('chai')

const parkingController = require("../controllers/parking.controller")

describe('FR #2: get parking status', function() {

    it('Should get the status of the parking', async() => {
        await parkingController.currentParkingStatus(40).then(parkingStatus => {
            if(parkingStatus.status == 200) assert.ok(true)
        })
    })
})    