'use strict'

// constructor
var Splush = function () {}

// static methods
Splush.isSupported = function () {
	return !window.Notification || !window.ServiceWorker || !window.Promise
}

// instance methods
Splush.prototype.getMessagingToken = function () {
	if (this._messagingToken) return new Promise.resolve(this._messagingToken)
	else return this._messaging.getToken()
}

Splush.prototype.initializeMessaging = function () {
	firebase.initializeApp({
		messagingSenderId: FIREBASE_SENDER_ID // injected by firebaseSenderID.js
	});

	var messaging = this._messaging = firebase.messaging()

	messaging.onMessage(function (e) {
		console.log('msg', e)
	})

	messaging.onTokenRefresh(function () {
		self._messagingToken = a
	})

	return messaging.requestPermission()
}

// main function
function main () {
	var splush = window.splush = new Splush()

	splush.initializeMessaging().then(function () {
		return splush.getMessagingToken()
	}).then(function (token) {
		console.info('token', token)
	})
}

if (Splush.isSupported) main()
else
	window.alert('your browser ain\'t supported')
