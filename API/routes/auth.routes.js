const { login, refreshToken, deleteRefreshToken } = require('./../auth/auth')
const auth = require('./../auth/auth')

module.exports = function(app) { 
    // check if the user is valid and if so return a valid token for that user 
    app.post('/login', async (req, res) => {
        const { username, password } = req.body
        login(username, password).then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // refresh a token for a user
    app.post('/refreshToken', async (req, res) => {
        const token = req.body.token
        refreshToken(token).then(response => {
            res.status(response.status).json(response.data)
        })
    })

    // delete a refresh token from database, so user cannot refresh his session
    app.delete('/logout', auth.authUser, async (req, res) => {
        const token = req.body.token
        deleteRefreshToken(token).then(response => {
            res.status(response.status).json(response.data)
        })
    })
}