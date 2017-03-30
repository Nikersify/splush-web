importScripts('https://www.gstatic.com/firebasejs/3.7.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.7.1/firebase-messaging.js')
importScripts('/firebaseSenderID.js') // la inject

firebase.initializeApp({
	messagingSenderId: FIREBASE_SENDER_ID
})

const messaging = firebase.messaging()
