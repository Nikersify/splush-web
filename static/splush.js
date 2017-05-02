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

// trying something different
var Emitter = function () {
	return this
}

Emitter.prototype.listeners = {}

Emitter.prototype.on = function (domain, fn) {
	if (!fn || !domain) return
	if (!this.listeners[domain]) this.listeners[domain] = []

	this.listeners[domain].push(fn)
	return this
}

Emitter.prototype.off = function (domain, fn) {
	if (!this.listeners[domain] || !fn || !domain) return

	var index = this.listeners[domain].indexOf(fn)
	if (index !== -1) array.splice(index, 1)

	return this
}

Emitter.prototype.emit = function (domain, payload) {
	if (!this.listeners[domain]) return
	for (var listener of this.listeners[domain]) listener(payload)
	return this
}

// constructor
var Splush = function () {
	this.events = new Emitter()
	this.storage.set = this.storage.set.bind(this)
}

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
	return window.Notification.requestPermission().then((permission) => {
		if (permission !== 'granted') throw 'Notification permission denied'

		return this._messaging.getToken().then(function (token) {
			if (!token) throw 'Firebase token resolved to null. ' +
				'(allow notifications?)'

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
		})
	})
}

Splush.prototype.initializeMessaging = function () {
	firebase.initializeApp({
		messagingSenderId: FIREBASE_SENDER_ID // injected by firebaseSenderID.js
	});

	var messaging = this._messaging = firebase.messaging()

	var self = this
	messaging.onMessage(function (e) {
		new window.Notification(e.notification.title, e.notification)
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
	set: function (key, val) {
		this.events.emit('changed-' + key, val)
		window.localStorage[key] = val
	}
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
	}).catch(alert)
}

if (Splush.isSupported) main()
else
	window.alert('Your browser isn\'t supported!')
