<key-display>
	<span>{ key }</span>

	const self = this
	window.splush.events.on('changed-key', function (val) {
		self.key = val
		self.update()
	})

	this.key = window.splush._key || '[...]'
</key-display>

