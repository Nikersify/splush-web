<key-gen>
	<button	class="ui button primary { hidden: showKey }"
		onclick={ reveal }>Click me!</button>

	<key-display class={ hidden: !showKey }></key-display>
	<copy-btn text={ key } class={ hidden: !showKey }></copy-btn>
	<span class="err { hidden: !errorMsg }">{ errorMsg }</span>

	<style>
		key-gen {
			display: block;
			margin-bottom: 1em;
		}

		.err {
			font-weight: bold;
			color: red;
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
			if (e === null) e = 'unknown error'

			this.errorMsg = e
			this.showKey = false
			this.update()
		})
	}

	const self = this
	window.splush.events.on('changed-key', function (val) {
		self.key = val
		self.update()
	})

	this.showKey = !!window.splush._key
	this.key = window.splush._key
	this.errorMsg = null

</key-gen>
