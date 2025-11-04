/*
	Story by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Stable viewport height variable for mobile browsers (address bar show/hide)
	(function setViewportUnitVar() {
		function setVh() {
			var vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', vh + 'px');
		}

		function isIOS() {
			return /iP(hone|od|ad)/.test(navigator.platform) ||
				(/Mac/.test(navigator.platform) && 'ontouchend' in document);
		}

		function isLineInApp() {
			return /Line\//i.test(navigator.userAgent || '');
		}

		setVh();

		// On iOS LINE: don't update on resize (scroll bar show/hide fires resize)
		if (!(isIOS() && isLineInApp())) {
			window.addEventListener('resize', setVh);
		}

		// Still adjust on orientation change
		window.addEventListener('orientationchange', function() {
			setTimeout(setVh, 250);
		});

		// Mark iOS LINE for CSS targeting
		if (isIOS() && isLineInApp()) {
			$body.addClass('line-ios');
		}
	})();

	// Countdown to 27 December 2025 (local time, midnight)
	(function initCountdown() {
		var target = new Date(2025, 11, 27, 0, 0, 0, 0); // month is 0-based
		var $days = $('#cd-days'), $hours = $('#cd-hours'), $mins = $('#cd-mins'), $secs = $('#cd-secs');

		if (!$days.length) return;

		function tick($el, nextVal) {
			if ($el.text() !== nextVal) {
				$el.text(nextVal).addClass('flip');
				setTimeout(function(){ $el.removeClass('flip'); }, 420);
			}
		}

		function update() {
			var now = new Date();
			var diffMs = Math.max(0, target - now);
			var totalSec = Math.floor(diffMs / 1000);
			var days = Math.floor(totalSec / 86400);
			var hours = Math.floor((totalSec % 86400) / 3600);
			var mins = Math.floor((totalSec % 3600) / 60);
			var secs = totalSec % 60;
			tick($days, String(days));
			tick($hours, hours.toString().padStart(2, '0'));
			tick($mins, mins.toString().padStart(2, '0'));
			tick($secs, secs.toString().padStart(2, '0'));
		}

		update();
		setInterval(update, 1000);
	})();

	// Add to Calendar (ICS download; opens device calendar)
	(function initAddToCalendar() {
		var btn = document.getElementById('add-to-calendar');
		if (!btn) return;

		btn.addEventListener('click', function(e) {
			// Prefer static ICS on LINE to avoid blocked Blob downloads
			var isLine = /Line\//i.test(navigator.userAgent || '');
			if (isLine) {
				// allow default navigation to the static ICS
				btn.setAttribute('href', 'mark-sai-wedding.ics');
				return;
			}

			e.preventDefault();

			// Event: all-day on 27 Dec 2025
			var ics = [
				'BEGIN:VCALENDAR',
				'VERSION:2.0',
				'PRODID:-//MARKSAI WEDDING//EN',
				'BEGIN:VEVENT',
				'UID:' + Date.now() + '@marksai',
				'DTSTAMP:' + formatIcsDate(new Date()),
				'SUMMARY:Mark & Sai — Wedding',
				'DESCRIPTION:Mark & Sai Wedding Day',
				'DTSTART;VALUE=DATE:20251227',
				'DTEND;VALUE=DATE:20251228',
				'END:VEVENT',
				'END:VCALENDAR'
			].join('\r\n');

			var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
			var url = URL.createObjectURL(blob);
			var a = document.createElement('a');
			a.href = url;
			a.download = 'mark-sai-wedding.ics';
			document.body.appendChild(a);
			a.click();
			setTimeout(function(){
				URL.revokeObjectURL(url);
				document.body.removeChild(a);
			}, 0);
		});

		function formatIcsDate(d) {
			function pad(n){ return n < 10 ? '0' + n : '' + n; }
			return d.getUTCFullYear()
				+ pad(d.getUTCMonth() + 1)
				+ pad(d.getUTCDate())
				+ 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
		}
	})();

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Browser fixes.

		// IE: Flexbox min-height bug.
			if (browser.name == 'ie')
				(function() {

					var flexboxFixTimeoutId;

					$window.on('resize.flexbox-fix', function() {

						var $x = $('.fullscreen');

						clearTimeout(flexboxFixTimeoutId);

						flexboxFixTimeoutId = setTimeout(function() {

							if ($x.prop('scrollHeight') > $window.height())
								$x.css('height', 'auto');
							else
								$x.css('height', '100vh');

						}, 250);

					}).triggerHandler('resize.flexbox-fix');

				})();

		// Object fit workaround.
			if (!browser.canUse('object-fit'))
				(function() {

					$('.banner .image, .spotlight .image').each(function() {

						var $this = $(this),
							$img = $this.children('img'),
							positionClass = $this.parent().attr('class').match(/image-position-([a-z]+)/);

						// Set image.
							$this
								.css('background-image', 'url("' + $img.attr('src') + '")')
								.css('background-repeat', 'no-repeat')
								.css('background-size', 'cover');

						// Set position.
							switch (positionClass.length > 1 ? positionClass[1] : '') {

								case 'left':
									$this.css('background-position', 'left');
									break;

								case 'right':
									$this.css('background-position', 'right');
									break;

								default:
								case 'center':
									$this.css('background-position', 'center');
									break;

							}

						// Hide original.
							$img.css('opacity', '0');

					});

				})();

	// Smooth scroll.
		$('.smooth-scroll').scrolly();
		$('.smooth-scroll-middle').scrolly({ anchor: 'middle' });

	// Wrapper.
		$wrapper.children()
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			});

	// Items.
		$('.items')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children()
				.wrapInner('<div class="inner"></div>');

	// Gallery.
		$('.gallery')
			.wrapInner('<div class="inner"></div>')
			.prepend(browser.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children('.inner')
				//.css('overflow', 'hidden')
				.css('overflow-y', browser.mobile ? 'visible' : 'hidden')
				.css('overflow-x', browser.mobile ? 'scroll' : 'hidden')
				.scrollLeft(0);

		// Style #1.
			// ...

		// Style #2.
			$('.gallery')
				.on('wheel', '.inner', function(event) {

					var	$this = $(this),
						delta = (event.originalEvent.deltaX * 10);

					// Cap delta.
						if (delta > 0)
							delta = Math.min(25, delta);
						else if (delta < 0)
							delta = Math.max(-25, delta);

					// Scroll.
						$this.scrollLeft( $this.scrollLeft() + delta );

				})
				.on('mouseenter', '.forward, .backward', function(event) {

					var $this = $(this),
						$inner = $this.siblings('.inner'),
						direction = ($this.hasClass('forward') ? 1 : -1);

					// Clear move interval.
						clearInterval(this._gallery_moveIntervalId);

					// Start interval.
						this._gallery_moveIntervalId = setInterval(function() {
							$inner.scrollLeft( $inner.scrollLeft() + (5 * direction) );
						}, 10);

				})
				.on('mouseleave', '.forward, .backward', function(event) {

					// Clear move interval.
						clearInterval(this._gallery_moveIntervalId);

				});

		// Lightbox.
			$('.gallery.lightbox').each(function() {
				var $gallery = $(this);
				var $images = $gallery.find('a[href$=".jpg"], a[href$=".png"], a[href$=".gif"], a[href$=".mp4"]');
				
				// Function to get all image URLs
				var getImageUrls = function() {
					var urls = [];
					$images.each(function() {
						urls.push($(this).attr('href'));
					});
					return urls;
				};
				
				var imageUrls = getImageUrls();
				
				// Function to show image at index
				var showImage = function(index) {
					if (index < 0 || index >= imageUrls.length) return;
					
					var $modal = $gallery.children('.modal');
					var $modalImg = $modal.find('img');
					
					if ($modal[0]._locked) return;
					
					$modal[0]._locked = true;
					$gallery[0]._currentIndex = index;
					
					// Remove loaded class
					$modal.removeClass('loaded');
					
					// Set new src
					$modalImg.attr('src', imageUrls[index]);
					
					// Update navigation buttons
					var $prevBtn = $modal.find('.gallery-nav-prev');
					var $nextBtn = $modal.find('.gallery-nav-next');
					
					if ($prevBtn.length) {
						$prevBtn.toggle(index > 0);
					}
					if ($nextBtn.length) {
						$nextBtn.toggle(index < imageUrls.length - 1);
					}
					
					setTimeout(function() {
						$modal[0]._locked = false;
					}, 600);
				};
				
				// Store functions in gallery element
				$gallery[0].showImage = showImage;
				$gallery[0]._totalImages = imageUrls.length;
			})
				.on('click', 'a', function(event) {

					var $a = $(this),
						$gallery = $a.parents('.gallery'),
						$modal = $gallery.children('.modal'),
						$modalImg = $modal.find('img'),
						href = $a.attr('href'),
						$images = $gallery.find('a[href$=".jpg"], a[href$=".png"], a[href$=".gif"], a[href$=".mp4"]');

					// Not an image? Bail.
						if (!href.match(/\.(jpg|gif|png|mp4)$/))
							return;

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Locked? Bail.
						if ($modal[0]._locked)
							return;

					// Find current index
						var currentIndex = 0;
						$images.each(function(index) {
							if ($(this).attr('href') === href) {
								currentIndex = index;
								return false;
							}
						});
						
						$gallery[0]._currentIndex = currentIndex;

					// Lock.
						$modal[0]._locked = true;

					// Set src.
						$modalImg.attr('src', href);

					// Set visible.
						$modal.addClass('visible');

					// Focus.
						$modal.focus();
						
					// Update navigation buttons
						setTimeout(function() {
							var $prevBtn = $modal.find('.gallery-nav-prev');
							var $nextBtn = $modal.find('.gallery-nav-next');
							var totalImages = $gallery[0]._totalImages || $images.length;
							
							if ($prevBtn.length) {
								$prevBtn.toggle(currentIndex > 0);
							}
							if ($nextBtn.length) {
								$nextBtn.toggle(currentIndex < totalImages - 1);
							}
						}, 100);

					// Delay.
						setTimeout(function() {

							// Unlock.
								$modal[0]._locked = false;

						}, 600);

				})
				.on('click', '.modal', function(event) {
					
					// Don't close if clicking on navigation buttons or image
					if ($(event.target).closest('.gallery-nav-prev, .gallery-nav-next, .inner').length) {
						event.stopPropagation();
						return;
					}

					var $modal = $(this),
						$modalImg = $modal.find('img'),
						$gallery = $modal.parent('.gallery');

					// Locked? Bail.
						if ($modal[0]._locked)
							return;

					// Already hidden? Bail.
						if (!$modal.hasClass('visible'))
							return;

					// Lock.
						$modal[0]._locked = true;

					// Clear visible, loaded.
						$modal
							.removeClass('loaded')

					// Delay.
						setTimeout(function() {

							$modal
								.removeClass('visible')

							setTimeout(function() {

								// Clear src.
									$modalImg.attr('src', '');

								// Unlock.
									$modal[0]._locked = false;

								// Focus.
									$body.focus();

							}, 475);

						}, 125);

				})
				.on('click', '.gallery-nav-prev', function(event) {
					event.preventDefault();
					event.stopPropagation();
					
					var $gallery = $(this).closest('.gallery');
					var currentIndex = $gallery[0]._currentIndex || 0;
					
					if ($gallery[0].showImage && currentIndex > 0) {
						$gallery[0].showImage(currentIndex - 1);
					}
				})
				.on('click', '.gallery-nav-next', function(event) {
					event.preventDefault();
					event.stopPropagation();
					
					var $gallery = $(this).closest('.gallery');
					var totalImages = $gallery[0]._totalImages || 0;
					var currentIndex = $gallery[0]._currentIndex || 0;
					
					if ($gallery[0].showImage && currentIndex < totalImages - 1) {
						$gallery[0].showImage(currentIndex + 1);
					}
				})
				.on('keydown', '.modal', function(event) {
					var $modal = $(this);
					var $gallery = $modal.parent('.gallery');
					var totalImages = $gallery[0]._totalImages || 0;
					var currentIndex = $gallery[0]._currentIndex || 0;

					// Escape? Hide modal.
						if (event.keyCode == 27) {
							$modal.trigger('click');
							return;
						}
						
					// Left arrow? Previous image.
						if (event.keyCode == 37 && currentIndex > 0) {
							if ($gallery[0].showImage) {
								$gallery[0].showImage(currentIndex - 1);
							}
							return;
						}
						
					// Right arrow? Next image.
						if (event.keyCode == 39 && currentIndex < totalImages - 1) {
							if ($gallery[0].showImage) {
								$gallery[0].showImage(currentIndex + 1);
							}
							return;
						}

				})
				.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div><button class="gallery-nav-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button><button class="gallery-nav-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button></div>')
					.find('img')
						.on('load', function(event) {

							var $modalImg = $(this),
								$modal = $modalImg.parents('.modal');

							setTimeout(function() {

								// No longer visible? Bail.
									if (!$modal.hasClass('visible'))
										return;

								// Set loaded.
									$modal.addClass('loaded');

							}, 275);

						});

})(jQuery);