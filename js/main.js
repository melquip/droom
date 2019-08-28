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
			posStart: 25, 
			posFinish: 90, 
			property:"bottom", 
			vStart: 0.25, 
			vFinish: -1.2, 
			unit:"em"
		},{ 
			element:".droom", 
			posStart: 25, 
			posFinish: 90, 
			property:"opacity", 
			vStart: 0.5, 
			vFinish: 1, 
			unit:""
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

	// checks if an element is inside the viewport 
	$.fn.isInViewport = function($sides) {
		let box = $(this).get(0).getBoundingClientRect();
		let boxSides = $sides.length === 0 ? ["top", "left", "bottom", "right"] : $sides;
		let top = $.inArray("top", boxSides) > -1 ? box.top >= 0 : true;
		let left = $.inArray("left", boxSides) > -1 ? box.left >= 0 : true;
		let bottom = $.inArray("bottom", boxSides) > -1 ? box.bottom <= (window.innerHeight || document.documentElement.clientHeight) : true;
		let right = $.inArray("right", boxSides) > -1 ? box.right <= (window.innerWidth || document.documentElement.clientWidth) : true;
		return top && left && bottom && right;
	};

	// activate animate.css on scroll after loading
	let animateElements = $('[data-animate]');
	$(window).on('scroll', function() {
		animateElements.each(function() {
			let $this = $(this);
			if (!$this.hasClass("animdone")) {
				if($this.isInViewport(["bottom"])) {
					$this.addClass($this.data("animate") + " animdone");
				}
			}
		});
	});
	// always start on begining of page after loading
	$('html, body').scrollTop(0);
	setTimeout(function() {
		$(window).trigger('scroll');
	}, 1100);
})(jQuery);