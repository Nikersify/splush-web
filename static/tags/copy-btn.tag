<copy-btn>
	<textarea class='copy-area'></textarea>
	<button onclick={ copy } class={ animation-flash: animate }>
		<i class="icon clipboard"></i>
	</button>

	<style>
		button {
			position: relative;
			background: none;
			border: none;
			outline: none;
			padding: 0;
		}

		button.animation-flash::after {
			animation: flash cubic-bezier(0, 0.45, 0.4, 1) 1.5s;
			content: 'Copied!';
			cursor: default;
			font-style: italic;
			left: -15px;
			position: absolute;
			top: -20px;
		}

		@keyframes flash {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
				top: -35px;
			}
		}

		.copy-area {
			border: none;
			cursor: default;
			height: 0;
			left: 0;
			outline: none;
			position: fixed;
			top: -10px;
			width: 0;
		}
	</style>

	this.animate = false

	copy (e) {
		e.preventDefault()

		try {
			var ca = document.querySelector('.copy-area')
			ca.value = this.opts.text
			ca.select()

			var s = document.execCommand('copy')
			if (!s) throw 'copy command failed'
			this.animate = true
			setTimeout(() => {
				this.animate = false
				this.update()
			}, 1000)
			this.update()
		} catch (e) {
			console.error(e)
		}
	}
</copy-btn>
