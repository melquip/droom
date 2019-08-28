(function ($) {

	const log = () => console.log.apply(console, arguments);
	log('main.js is working');

	// menu animation
	$('.hamburger').on('click', function () {
		$(this).toggleClass('is-active');
	});

	// Droom parallax effect
	$('.intro').liveParallax([
		{ 
			element:".droom", 
			posStart: 0, 
			posFinish: 100, 
			property:"bottom", 
			vStart: 0.5, 
			vFinish: -1.125, 
			unit:"em"
		}
	]);

	// smooth scrolling
	$('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function (event) {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				event.preventDefault();
				$('html, body').animate({
					scrollTop: target.offset().top - 70
				}, 1000, function () {
					var $target = $(target);
					$target.focus();
					if ($target.is(":focus")) {
						return false;
					} else {
						$target.attr('tabindex', '-1');
						$target.focus();
					}
				});
			}
		}
	});
})(jQuery);