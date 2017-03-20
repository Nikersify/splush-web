const router = require('express').Router()
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({
	extended: true
}))

router.get('/', (req, res) => res.render('index'))

router.post('/:code/:msg?', (req, res) => {
	const code = req.params.code
	const msg = req.params.msg || req.body.msg || req.query.msg

	if (typeof msg === 'undefined')
		return res.status(403).send('missing msg')

	return res.send(code + ' ' + msg)
})

module.exports = router
