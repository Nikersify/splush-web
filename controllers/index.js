const router = require('express').Router()
const bodyParser = require('body-parser')
const Pushable = require('../models/Pushable')

router.use(bodyParser.urlencoded({
	extended: true
}))

router.get('/', (req, res) => res.render('index'))

router.post('/:code/:msg?', (req, res) => {
	const code = req.params.code
	const msg = req.params.msg || req.body.msg || req.query.msg

	if (typeof msg === 'undefined') return res.status(400).json({
		err: 'msg not specified',
		success: false
	})

	const pusher = new Pushable(code)
	pusher.exists().then((exists) => {
		if (!exists) throw { reason: 'invalid code', code: 403 }
		return pusher.push(msg)
	}).then((success) => {
		if (success)
			res.json({
				err: null,
				success: true
			})
		else throw { reason: 'server error', code: 500 }
	}).catch((e) => {
		const err = e.reason || 'something went horribly wrong'
		res.json({
			err: err,
			success: false
		})
	})
})

module.exports = router
