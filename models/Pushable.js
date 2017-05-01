const rp = require('request-promise')
const words = require('simple-words')

const db = require('../db')
const config = require('../config')

module.exports = class Pushable {
	constructor (code) {
		if (!code) this.code = this.constructor.generateCode()
		else this.code = code
	}

	delete () {
		return db.del('code:' + this.code)
	}

	// find a record by token
	static find (token) {
		return db.find(token, 'code:')
	}

	exists () {
		return db.exists('code:' + this.code)
	}

	async push (msg) {
		const target = await this.getTarget()

		const options = {
			body: {
				to: target,
				notification: {
					body: msg
				}
			},
			headers: {
				'Authorization': `key=${config.firebase.server_key}`,
			},
			json: true,
			url: 'https://fcm.googleapis.com/fcm/send'
		}

		return rp.post(options)
	}

	static generateCode () {
		return words.pick(4).map(x => (x[0].toUpperCase() + x.slice(1))).join('')
	}

	getTarget () {
		return db.get('code:' + this.code)
	}

	setTarget (target) {
		return db.put('code:' + this.code, target)
	}
}
