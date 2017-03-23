const bodyParser = require('body-parser')
const log = require('@nikersify/log')
const router = require('express').Router()
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

router.post('/sub', (req, res) => {
	const target = req.body.target || req.query.target

	if (!target) return res.status(400).json({
		err: 'target not specified',
		success: false
	})

	const pusher = new Pushable()

	pusher.setTarget(target).then(() => {
		return pusher.push('Success!')
	}).then(() => {
		res.json({
			err: null,
			success: true,
			res: {
				code: pusher.code
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

router.post('/:code/:msg?', (req, res) => {
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
})

module.exports = router
