const { createLog } = require("./log.controller")
const { pool } = require("../datasource/PostgreSQL.datasource")
const { OPERATION } = require("./../config/log.config")

const create = async (maxCapacity, userId) => {
  if(isNaN(maxCapacity)) return { status: 422, data: "Entidad no procesable" }
  const a = await pool.query('INSERT INTO business.parking ("maxCapacity") VALUES ($1) RETURNING *', [maxCapacity])
  const json = JSON.stringify(a.rows[0])
  createLog(userId, OPERATION.LOG_CREATE, "business.parking", json)
  return { status: 201, data: a.rows[0] }
}

const findAll = async () => {
  const result = await pool.query(`SELECT * FROM "business"."parking"`)
  return { status: 200, data: result.rows }
}

const findOneById = async (id) => {
  const result = await pool.query(`SELECT * FROM "business"."parking" WHERE id=$1`, [id])
  return { status: 200, data: result.rows[0] }
}

const updateById = async (id, maxCapacity, userId) => {
  const result = await pool.query(`UPDATE business.parking SET "maxCapacity"=$2 WHERE id=$1`, [id, maxCapacity])
  const json = JSON.stringify({ id: id, maxCapacity: maxCapacity })
  createLog(userId, OPERATION.LOG_MODIFY, "business.parking", json)
  return { status: result ? 200 : 500, data: result ? "Actualizacion Completada" : "Ha Ocurrido un Error" }
}

const deleteById = async (id, userId) => {
  const result = await pool.query(`DELETE FROM business.parking WHERE id=$1`, [id])
  const json = JSON.stringify({ id: id })
  createLog(userId, OPERATION.LOG_DELETE, "business.parking", json)
  return { status: result ? 200 : 500, data: result.rowCount ? "Se ha Eliminado Correctamente" : "Ha Ocurrido un Error" }
}

const currentParkingStatus = async (idParking) => {
  const currentDate = new Date()
  const parkingData = await findOneById(idParking)
  const parking = parkingData.data
  if(!parking) return { status: 200, data: "No Existe el Parqueo" }
  const result = await pool.query(`SELECT COALESCE(COUNT(id), 0) FROM 
    business.rent WHERE initialdate <= $1 AND enddate >= $1 AND idparking=$2`, [currentDate, idParking])
  let percent = result.rows[0].coalesce ? (result.rows[0].coalesce * 100 / parking.maxCapacity).toFixed(2) : 0
  return { status: 200, data: {currentOcupation: result.rows[0].coalesce ? result.rows[0].coalesce : 0, maxCapacity: parking.maxCapacity, percent: percent} }
}

module.exports = {
    create,
    findAll,
    findOneById,
    updateById,
    deleteById,

    currentParkingStatus
}