const db = require('../db')

module.exports = class Pushable {
	constructor (code) {
		this.code = code
	}

	exists () {
		return new Promise((resolve, reject) => {
			db.get('code:' + this.code, (err, value) => {
				if (err && err.notFound) resolve(false)
				else resolve(true)
			})
		})
	}

	getTarget () {
		return new Promise((resolve, reject) => {
			db.get('code:' + this.code, (err, value) => {
				if (err) reject(err)
				else resolve(value)
			})
		})
	}
}
