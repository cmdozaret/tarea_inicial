const { findUserByUsername } = require("./../controllers/user.controller")
const { ROLE } = require("./../config/role.config")

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { pool } = require("../datasource/PostgreSQL.datasource")

async function login(username, password) {
    var user = await findUserByUsername(username)
    if(!user) return { status: 403, data: "Credenciales Invalidas"}
    try {
        if(await bcrypt.compare(password, user.password)) {
            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)
            var result = await pool.query('INSERT INTO security."refreshToken" ("token") VALUES ($1) RETURNING *', [refreshToken])
            return result ? { status: 201, data: {accessToken: accessToken, refreshToken: refreshToken} } : { status: 500, data: "Ha Ocurrido un Error" }
        }
        else return { status: 403, data: "Credenciales Invalidas"}
    }
    catch(err) { res.status(err.code ? err.code : 500).send(err.message ? err.message : 'Error') }
}

// Verify If A Refresh Token Exists
async function verifyToken(token) {
    const result = await pool.query(`SELECT * FROM security."refreshToken" WHERE token=$1`, [token])
    return result ? result.rows[0] : undefined
}

async function refreshToken(token) {
    var newAccessToken = null
    var status = 401
    if(!token || await verifyToken(token) == undefined) return { status: status, data: "Error. Debe Autenticarse" }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send()
        newAccessToken = generateAccessToken(user)
        status = 200
    })
    return { status: status, data: {accessToken: newAccessToken} }
}

async function deleteRefreshToken(token) {
    var result = await pool.query('DELETE FROM security."refreshToken" WHERE token=$1', [token])
    return { status: result ? 200 : 400, data: result ? result.rows : undefined }
}

function generateAccessToken(user) {
    return jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' })
} 

function generateRefreshToken(user) {
    return jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET)
}

function authUser(req, res, next) {    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null || token == undefined) return res.status(401).send("No Tiene Acceso")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, needle) => {
        if(err) return res.status(403).send("No Tiene Acceso")
        pool.query(`SELECT * FROM security."user"`, (error, results) => {
            if (error) throw error
            var flag = true
            for(let i = 0; i < results.rows.length; i++) 
                if(results.rows[i].username === needle.username) {
                    req.user = results.rows[i]
                    flag = false
                    break
                }
            if(flag) return res.status(403).send("No Tiene Acceso")
            next()
        })
    })
}

function authROLE(ROLE) {
    return (req, res, next) => {
        pool.query(`select ro.name from security."role" ro inner join 
            security."_user_rol" ur on ro.id = ur."idRol"
            where ur."idUser" = $1`, [req.user.id], (error, results) => {
            if (error) throw error
            var flag = true
            for(let i = 0; i < results.rows.length; i++) 
                if(results.rows[i].name === ROLE) {
                    flag = false
                    next()
                    break
                }
            if(flag) return res.status(403).send("No Tiene Acceso")
        })
    }
}

function authPermissionsOnOneRent(req, res, next) {    
    const idUser = req.user.id
    const { id } = req.params.id
    pool.query(`select ro.name from security."role" ro inner join 
    security."_user_rol" ur on ro.id = ur."idRol"
    where ur."idUser" = $1`, [idUser], (error, result) => {
        if(error) throw error   
        var flag = true
        for(let i = 0; i < result.rows.length; i++) {
            flag = false
            if(result.rows[i].name === ROLE.ROLE_ADMIN) next()
        }
        if(flag) {
            pool.query(`SELECT * FROM business.rent WHERE id = $1 AND iduser = $2`, [id, idUser], (error, rent) => {
                if(error) throw error
                if(rent.rows.length) next()
                else { return res.status(403).send("Acceso Denegado") }
            })
        }            
    })
}

function authPermissionsOnUser(req, res, next) {    
    const { id } = req.body
    if(id === req.user.id) return next()
    pool.query(`select * from security."role" ro
    inner join security._user_rol ur on ro.id = ur."idRol"
    where ur."idUser" = $1`, [req.user.id], (error, result) => {
        if(error) throw error
        for(let i = 0; i < result.rows.length; i++) {
            if(result.rows[i].name === ROLE.ROLE_ADMIN) return next()
        }
        return res.status(403).send("Acceso Denegado")
    })
}

module.exports = { 
    generateAccessToken,
    generateRefreshToken,
    deleteRefreshToken,

    authUser,
    authROLE,
    authPermissionsOnOneRent,
    authPermissionsOnUser,

    login,
    refreshToken
}