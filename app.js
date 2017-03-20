const express = require('express')

const app = express()

app.set('view engine', 'pug')

app.use('/', express.static('static'))
app.use('/', require('./controllers'))

app.listen(3030, () => {
	console.log('server listening')
})
