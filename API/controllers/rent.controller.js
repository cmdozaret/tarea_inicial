const parking = require('./parking.controller')
const { createLog } = require("./log.controller")
const { pool } = require("../datasource/PostgreSQL.datasource")

const { OPERATION } = require("./../config/log.config")

const create = async (idparking, initialdate, enddate, idcar, userId) => {
  const parkingObject = await parking.findOneById(idparking)
  if(parkingObject.data == undefined) return { status: 200, data: "Parqueo Inexistente" }
  const count = await pool.query(`SELECT COUNT(id) FROM business.rent WHERE initialdate <= $2 AND
    enddate >= $2 AND idparking=$1`, [idparking, initialdate])
  if(parkingObject.data.maxCapacity <= count.rows[0].count) return { status: 200, data: "Parqueo lleno a esa hora" }
  else {
    result = await pool.query(`INSERT INTO business.rent ("idparking", "initialdate", "enddate", "idcar", "iduser") VALUES ($1, $2, $3, $4, $5) RETURNING *`, [idparking, initialdate, enddate, idcar, userId])
    const json = JSON.stringify(result.rows[0])
    createLog(userId, OPERATION.LOG_CREATE, "business.rent", json)
    return { status: 201, data: result.rows[0] }                 
  }
}

const findAll = async () => {
  const result = await pool.query(`SELECT * FROM business.rent`)
  return { status: 200, data: result.rows }
}

const findOneById = async (id) => {
  const result = await pool.query(`SELECT * FROM business.rent WHERE id=$1`, [id])
  return { status: 200, data: result.rows[0] }
}

const updateById = async (id, initialdate, enddate, idcar, userId) => {
  const result = await pool.query(`UPDATE business.rent SET initialdate=$2, enddate=$3, idcar=$4 WHERE id=$1`, [id, initialdate, enddate, idcar])
  const json = JSON.stringify({id: id, initialdate: initialdate, enddate: enddate, idcar: idcar})
  createLog(userId, OPERATION.LOG_MODIFY, "business.rent", json)
  return { status: 200, data: result.rows }
}

const deleteById = async (id, userId) => {
  const result = await pool.query(`DELETE FROM business.rent WHERE id=$1`, [id])
  const json = JSON.stringify({ id: id })
  createLog(userId, OPERATION.LOG_DELETE, "business.rent", json)
  return { status: 200, data: result.rows }
}

module.exports = {
    create,
    findAll,
    findOneById,
    updateById,
    deleteById
}