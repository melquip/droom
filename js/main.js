(function() {

	const log = () => console.log.apply(console, arguments);
	log('main.js is working');
	
	// menu animation
	document.querySelector('.hamburger').addEventListener('click', function() {
		!this.classList.contains('is-active') ? this.classList.add('is-active') : this.classList.remove('is-active');
	});

})();