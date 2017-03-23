const rp = require('request-promise')
const db = require('../db')
const config = require('../config')

module.exports = class Pushable {
	constructor (code) {
		if (!code) this.code = this.generateCode()
		else this.code = code
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

	static generateCode () {
		// temporary
		const g = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
			'abcdefghijklmnopqrstuvwxyz0123456789'

		return Array.apply(null, Array(3)).map(() => {
			return g.charAt(Math.floor(Math.random() * g.length))
		}).join('')
	}

	getTarget () {
		return db.get('code:' + this.code)
	}

	setTarget (target) {
		return db.put('code:' + this.code, target)
	}
}
