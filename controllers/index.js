const bodyParser = require('body-parser')
const log = require('@nikersify/log')
const router = require('express').Router()
const config = require('../config')
const Pushable = require('../models/Pushable')

router.use(bodyParser.urlencoded({
	extended: true
}))

const errorHandler = (res) => {
	return (e) => {
		const err = e.reason || 'something went horribly wrong'
		const status = e.status || 500
		if (status === 500) log.error(e)
		return res.status(status).json({
			err: err,
			success: false
		})
	}
}

router.get('/', (req, res) => res.render('index'))

router.get('/firebaseSenderID.js', (req, res) => {
	res.setHeader('Content-Type', 'application/javascript')
	res.send(`FIREBASE_SENDER_ID = '${config.firebase.sender_id}'`)
})

router.post('/sub', (req, res) => {
	const target = req.body.target || req.query.target

	if (!target) return res.status(400).json({
		err: 'target not specified',
		success: false
	})

	Pushable.find(target).then((result) => {
		if (!result) {
			const pusher = new Pushable()

			return pusher.setTarget(target).then(() => {
				return pusher.push('Success!')
			}).then(() => {
				return Promise.resolve(pusher.code)
			})
		} else return Promise.resolve(result)
	}).then((code) => {
		res.json({
			err: null,
			success: true,
			res: {
				code: code
			}
		})
	}).catch(errorHandler(res))
})

router.post('/unsub', (req, res) => {
	const code = req.body.code || req.query.code
	const target = req.body.target || req.query.target

	if (!code) return res.json({
		err: 'code not specified',
		success: false
	})

	const pusher = new Pushable(code)

	pusher.exists().then((exists) => {
		if (!exists) throw { reason: 'invalid code', status: 400 }
		return pusher.getTarget()
	}).then((target_) => {
		if (target !== target_) throw { reason: 'invalid target', status: 400}
		return pusher.delete()
	}).then(() => {
		res.json({
			err: null,
			success: true
		})
	}).catch(errorHandler(res))
})

const apiHandler = (req, res) => {
	const code = req.params.code
	const msg = req.params.msg || req.body.msg || req.query.msg

	if (typeof msg === 'undefined') return res.status(400).json({
		err: 'msg not specified',
		success: false
	})

	const pusher = new Pushable(code)
	pusher.exists().then((exists) => {
		if (!exists) throw { reason: 'invalid code', status: 400 }
		return pusher.push(msg)
	}).then((success) => {
		if (success)
			res.json({
				err: null,
				success: true
			})
		else throw { reason: 'server error', status: 500 }
	}).catch(errorHandler(res))
}

router.route('/:code/:msg?').post(apiHandler).get(apiHandler)

module.exports = router
