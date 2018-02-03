<key-gen>
	<button	class="ui button
		{ primary: !splush.errorMsg }
		{ negative: splush.errorMsg }
		{ disabled: splush.errorMsg }
		{ hidden: showKey }"
		onclick={ reveal }>{ splush.errorMsg ? splush.errorMsg + ' :(' : 'Click me!'}</button>

	<key-display class={ hidden: !showKey }></key-display>
	<copy-btn text={ key } class={ hidden: !showKey }></copy-btn>

	<style>
		key-gen {
			display: block;
			margin-bottom: 1em;
		}

		.hidden {
			display: none !important;
		}

		span {
			font-weight: bold;
		}
	</style>

	reveal (e) {
		e.preventDefault()
		window.splush.fetchKey().then((key) => {
			if (key) {
				this.key = key
				this.showKey = true
				this.update()
			}
		}).catch((e) => {
			if (e === null) {
				e = 'Unknown error'
			}

			window.splush.errorMsg = e
			this.showKey = false
			this.update()
		})
	}

	const self = this
	window.splush.events.on('changed-key', function (val) {
		self.key = val
		self.update()
	})

	window.splush.events.on('error-msg', function () {
		self.update()
	})

	this.showKey = !!window.splush._key
	this.key = window.splush._key
	this.errorMsg = null
	this.splush = window.splush
</key-gen>
