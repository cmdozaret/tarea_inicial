const { createLog } = require("./log.controller")
const bcrypt = require('bcrypt')
const { pool } = require("../datasource/PostgreSQL.datasource")
const { OPERATION } = require("./../config/log.config")

const  validateEmail = (email) => {
	return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test( email );	
}

const findUserByUsername = async (username) => {
    const result = await pool.query(`SELECT * from security."user" WHERE username = $1`, [username])
    return result.rows[0]
}

const validateNewUser = (username, email, contactnumber, password) => {
    return ((username == null || username == undefined) || (email == null || email == undefined)
        || (contactnumber == null || contactnumber == undefined) || (password == null || password == undefined)
        || (!validateEmail(email)) || (isNaN(contactnumber)))
}

const create = async (username, email, contactnumber, password, userId) => {
    if(validateNewUser(username, email, contactnumber, password)) 
        return { status: 200, data: "Usuario Invalido" }
    const temp = await findUserByUsername(username)
    if(temp) return { status: 200, data: "Nombre de Usuario Existente" }
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await pool.query('INSERT INTO security."user" ("username", "email", "contactnumber", "password") VALUES ($1, $2, $3, $4) RETURNING *', [username, email, contactnumber, hashedPassword])
    const json = JSON.stringify(newUser.rows[0])
    createLog(userId, OPERATION.LOG_CREATE, 'security."user"', json)
    return { status: newUser ? 201 : 500, data: newUser ? newUser.rows[0] : "Ha Ocurrido un Error" }
}

const findAll = async () => {
  const result = await pool.query(`SELECT * FROM security."user"`)
  return { status: 200, data: result.rows }
}

const findOneById = async (id) => {
  const result = await pool.query(`SELECT * FROM security."user" WHERE id=$1`, [id])
  return { status: 200, data: result.rows[0] }
}

const updateById = async (id, username, email, contactnumber, password, userId) => {
    if(validateNewUser(username, email, contactnumber, password)) 
        return { status: 200, data: "Usuario Invalido" }
    const temp = await findUserByUsername(username)
    if(temp && temp.id != id) return { status: 200, data: "Nombre de Usuario Existente" }
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const result = await pool.query(`UPDATE security."user" SET username=$2, email=$3, contactnumber=$4, password=$5 WHERE id=$1`, [id, username, email, contactnumber, hashedPassword])
    const json = JSON.stringify({ username: username, email: email, contactnumber: contactnumber, password: hashedPassword })
    createLog(userId, OPERATION.LOG_MODIFY, 'security."user"', json)
    return { status: 200, data: result.rows }
}

const deleteById = async (id, userId) => {
  const result = await pool.query(`DELETE FROM security."user" WHERE id=$1`, [id])
  const json = JSON.stringify({ id: id })
  createLog(userId, OPERATION.LOG_DELETE, 'security."user"', json)
  return { status: 200, data: result.rows }
}

const assign = async (id, roleId, userId) => {
  roleId = JSON.parse(roleId)
  roleId.forEach(async element => {
    const result = await pool.query(`INSERT INTO security._user_rol("idRol", "idUser") VALUES ($1, $2);`, [element, id])
  });  
  const json = JSON.stringify({ id: id, roleId: roleId })
  createLog(userId, OPERATION.LOG_CREATE, 'security."_user_rol"', json)
  return { status: 200, data: "Roles Asignados Correctamente" }
}

module.exports = {
    create,
    findAll,
    findOneById,
    updateById,
    deleteById,
    findUserByUsername,
    assign
}