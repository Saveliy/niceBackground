/**
 * @author: Saveliy Bondarenko
 * @date: 12.01.13, 23:21
 */

// Если не указаны ширина и высота в атрибутах картинки, это может замедлить работу плагина.
// Для коректной работы необходима сборка modernizer с определением поддержки background-size и transform.

// TODO: Исправить глюки в IE7-IE8. Доработать обработку ресайза. Сделать рефакторинг кода.

(function($){
	jQuery.fn.niceBackground = function(params){
		var Modernizr = Modernizr || {};
		var items = $(this);
		var params = params || {};
		var resizeObject = $(window);

		if (params.resize && params.resize == 'item')
			resizeObject = items;

		items.each(function() {
			var itemWrap = $(this);
			var height = itemWrap.height();
			var width = itemWrap.width();

			var img = itemWrap.find('img');
			var imgWidth = parseInt(img.attr('width'));
			var imgHeight = parseInt(img.attr('height'));


//			Если передан параметр background проверим поддерживает ли браузер свойство background-size.

			if (params.background && Modernizr.backgroundsize) {
				var url = img.attr('src');
				itemWrap.css({
					background: 'url(' + url + ') no-repeat',
					backgroundSize: 'cover'
				});
				img.remove();
				return true;
			}

//			Установим свой излучатель события изменения размера.

			if (params.resize && params.resize == 'item') {
				var emitter = function() {
					var newWidth = itemWrap.width();
					var newHeight = itemWrap.height();

					if (newHeight != height || newWidth != width) {
						height = newHeight;
						width = newWidth;

						itemWrap.trigger({
							type: 'resize',
							height: height,
							width: width
						});
					}

					setTimeout(function() {
						emitter();
					}, 40)
				}

				emitter();
			}

			/**
			 * Подписываемся на событие ресайза.
			 * Subscribe to event resize.
			 */
			var initResize = function() {
				var imgRatio = imgWidth / imgHeight;
				var offset;

				img.css('position', 'absolute');

				resizeObject.resize(function(e) {
					var itemWrapHeight = e.height || itemWrap.height();
					var itemWrapWidth = e.width || itemWrap.width();

					var ratio = itemWrapWidth /itemWrapHeight;

					if (imgRatio > ratio) {
						var wrapHeight = itemWrapHeight;
						var newImgWidth = ~~ (wrapHeight * imgRatio);

						img.height(wrapHeight);
						img.width(newImgWidth);

						offset = ~~ (itemWrapWidth / 2 - newImgWidth / 2);

						if (offset < 0)
							offset = offset * -1;

						if (Modernizr.csstransforms) {
							img.css({
								transform: 'translate(-' +  offset + 'px , 0px)'
							});
						} else {
							img.css({
								'left': - offset + 'px',
								'top': 0 + 'px'
							});
						}

					} else {
						var wrapWidth = itemWrapWidth;
						var newImgHeight = ~~ (wrapWidth / imgRatio);

						img.width(wrapWidth);
						img.height(newImgHeight);

						offset = ~~ (itemWrapHeight / 2 - newImgHeight / 2);

						if (offset < 0)
							offset = offset * -1;

						if (Modernizr.csstransforms) {
							img.css({
								transform: 'translate(0px , -' + offset + 'px)'
							});
						} else {
							img.css({
								'top': - offset + 'px',
								'left': 0 + 'px'
							});
						}
					}
				});
			};

			/**
			 * Обработаем событие, если не указаны аттрибуты.
			 * Processing the event, if image attributes do not specified.
			 */

			if (isNaN(imgWidth) || isNaN(imgHeight)) {
				var surveyImgSize = function() {
					imgHeight = img.height();
					imgWidth = img.width();

					if (imgHeight == 0 || imgWidth == 0) {
						setTimeout(function() {
							surveyImgSize();
						}, 100);
					} else {
						initResize();
					}
				};

				surveyImgSize();
			} else {
				initResize();
			}
		});

		return items;
	};
})(jQuery);
