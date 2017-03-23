const levelup = require('levelup')

const db = levelup('./level_db')

module.exports.level = db

module.exports.del = (field) => new Promise((resolve, reject) => {
	db.del(field, (err) => {
		if (err) reject(err)
		else resolve()
	})
})

module.exports.get = (field) => new Promise((resolve, reject) => {
	db.get(field, (err, value) => {
		if (err) reject(err)
		else resolve(value)
	})
})

module.exports.exists = (field) => new Promise((resolve, reject) => {
	db.get(field, (err, value) => {
		if (err && err.notFound) resolve(false)
		else resolve(true)
	})
})

module.exports.put = (field, value) => new Promise((resolve, reject) => {
	db.put(field, value, (err) => {
		if (err) reject(err)
		else resolve()
	})
})
