const levelup = require('levelup')
const log = require('@nikersify/log')
const path = require('path')
const config = require('../config')

log.info('db', `level path set to ${log.e(path.resolve(config.level.path))}`)

const db = levelup(config.level.path)

module.exports.level = db

module.exports.del = (field) => new Promise((resolve, reject) => {
	db.del(field, (err) => {
		if (err) reject(err)
		else resolve()
	})
})

module.exports.find = (value, prefix = '') => new Promise((resolve, reject) => {
	const stream = db.createReadStream()

	stream.on('data', (data) => {
		if (data.value === value && data.key.indexOf(prefix) === 0) {
			stream.destroy()

			// strip out the prefix
			resolve(data.key.substr(prefix.length))
		}
	})
	.on('end', () => {
		resolve(null)
	})
	.on('error', (err) => {
		reject(err)
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
