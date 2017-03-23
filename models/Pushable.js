const rp = require('request-promise')
const db = require('../db')
const config = require('../config')

module.exports = class Pushable {
	constructor (code) {
		this.code = code
	}

	delete () {
		return db.del('code:' + this.code)
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

	getTarget () {
		return db.get('code:' + this.code)
	}

	setTarget (target) {
		return db.put('code:' + this.code, target)
	}
}
