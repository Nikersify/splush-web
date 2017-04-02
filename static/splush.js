'use strict'

// utils
window.fetchJSON = function (url, opts) {
	return new Promise(function (resolve, reject) {
		fetch(url, opts).then(function (res) {
			res.json().then(function (body) {
				if (!res.ok) reject(body)
				else resolve(body)
			})
		})
	})
}

// constructor
var Splush = function () {}

// static methods
Splush.isSupported = function () {
	return !window.Notification
		|| !window.ServiceWorker
		|| !window.Promise
		|| !window.fetch
}

// instance methods
Splush.prototype.fetchKey = function () {
	var self = this
	return this.getMessagingToken().then(function (token) {
		if (!token) throw 'Firebase token resolved to null. ' +
			'(allow notifications?)'
		if (token === self.storage.get('token')) {
			return Promise.resolve(self.storage.get('key'))
		} else {
			var headers = new Headers()
			headers.append('Content-Type', 'application/x-www-form-urlencoded')

			return fetchJSON('/sub', {
				body: 'target=' + token,
				headers: headers,
				method: 'POST'
			}).then(function (r) {
				var key = r.res.code
				self.storage.set('key', key)
				self.storage.set('token', token)
				return Promise.resolve(key)
			})
		}
	}).catch(alert)
}

Splush.prototype.getMessagingToken = function () {
	return this._messaging.getToken()
}

Splush.prototype.initializeMessaging = function () {
	firebase.initializeApp({
		messagingSenderId: FIREBASE_SENDER_ID // injected by firebaseSenderID.js
	});

	var messaging = this._messaging = firebase.messaging()

	var self = this
	messaging.onMessage(function (e) {
		new window.Notification(e.notification.body)
	})

	messaging.onTokenRefresh(function () {
		self.getMessagingToken().then(function (token) {
			self._messagingToken = token
		})
	})
}

Splush.prototype.storage = {
	exists: function (item) {
		return !!window.localStorage.getItem(item)
	},
	delete: window.localStorage.removeItem.bind(window.localStorage),
	get: window.localStorage.getItem.bind(window.localStorage),
	flush: window.localStorage.clear.bind(window.localStorage),
	set: window.localStorage.setItem.bind(window.localStorage)
}

// main function
function main () {
	var splush = window.splush = new Splush()
	splush.initializeMessaging()

	new Promise(function (resolve, reject) {
		try {
			riot.compile(function () {
				splush.tags = riot.mount('*')
				resolve()
			})
		} catch (e) { reject(e) }
	}).catch(function (e) {
		alert(e)
	})
}

if (Splush.isSupported) main()
else
	window.alert('your browser ain\'t supported')
