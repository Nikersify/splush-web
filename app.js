const compression = require('compression')
const express = require('express')
const log = require('@nikersify/log')

const mode = process.env.NODE_ENV === 'PRODUCTION'? 'production' : 'development'
log.info('app', `starting in ${log.e(mode)} mode`)

if (!require('fs').existsSync('config.json')) {
	log.fatal('app', `copy ${log.e('config.example.json')} ` +
		`to ${log.e('config.json')} before running the app`)

	process.exit(1)
}

const config = require('./config')

log.success('app', `read ${log.e('config.json')}`)

const app = express()

app.set('view engine', 'pug')
app.use(compression())

app.locals.env = process.env

app.use('/', express.static('static'))
app.use('/', require('./controllers'))

const l = app.listen(config.http.port, () => {
	log.success('http', 'server started')
	log.info('http', `server listening on port ${log.e(l.address().port)}`)

	if (mode === 'development') {
		const r = require('repl').start({ prompt: '> ' })

		r.context.app = app
		r.context.db = require('./db')
		r.context.Pushable = require('./models/Pushable')
	}
})

