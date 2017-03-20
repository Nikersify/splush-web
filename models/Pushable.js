const db = require('../db')

module.exports = class Pushable {
	constructor (code) {
		this.code = code
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
