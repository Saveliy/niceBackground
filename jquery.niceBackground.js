/**
 * @author: Saveliy Bondarenko
 * @date: 12.01.13, 23:21
 */

// Если не указаны ширина и высота в атрибутах картинки, это может замедлить работу плагина.

// TODO: Исправить глюки в IE7-IE8. Доработать обработку ресайза. Сделать рефакторинг кода.
// TODO: Объеденить в один блок обработку события ресайза.
// TODO: Реализовать поддержку свойства background-size: 100% при переданном параметре и если браузер поддерживает данное свойство.


(function($){
	jQuery.fn.niceBackground = function(params){
		var items = $(this);
		var params = params || {};
		var resizeObject = $(window);

		if (params.resize && params.resize == 'item')
			resizeObject = items;

		items.each(function() {
			var item = $(this);

//			Установим свой излучатель события изменения размера.

			var height = item.height();
			var width = item.width();

			var emitter = function() {
				var newWidth = item.width();
				var newHeight = item.height();

				if (newHeight != height || newWidth != width) {
					height = newHeight;
					width = newWidth;

					item.trigger({
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

			/**
			 * Подписываемся на событие ресайза.
			 * Subscribe to event resize.
			 */
			var initResize = function() {
				var imgRatio = imgWidth / imgHeight;
				var offset;

				img.css('position', 'absolute');

				resizeObject.resize(function(e) {
					if (params.resize && params.resize == 'item') {
						var ratio = e.width / e.height;

						if (imgRatio > ratio) {
							var wrapHeight = ~~ e.height;
							var newImgWidth = ~~ (wrapHeight * imgRatio);
							img.height(wrapHeight);
							img.width(newImgWidth);
							offset = ~~ (e.width / 2 - newImgWidth / 2);

							if (offset < 0)
								offset = offset * -1;

							img.css({
								'left': - offset + 'px',
								'top': 0 + 'px'
							});
						} else {
							var wrapWidth = ~~ e.width;
							var newImgHeight = ~~ (wrapWidth / imgRatio);
							img.width(wrapWidth);
							img.height(newImgHeight);
							offset = ~~ (e.height / 2 - newImgHeight / 2);

							if (offset < 0)
								offset = offset * -1;

							img.css({
								'top': - offset + 'px',
								'left': 0 + 'px'
							});
						}
					} else {
						var ratio = itemWrap.width() / itemWrap.height();

						if (imgRatio > ratio) {
							var wrapHeight = ~~ itemWrap.height();
							var newImgWidth = ~~ (wrapHeight * imgRatio);
							img.height(wrapHeight);
							img.width(newImgWidth);
							offset = ~~ (itemWrap.width() / 2 - newImgWidth / 2);

							if (offset < 0)
								offset = offset * -1;

							img.css({
								'left': - offset + 'px',
								'top': 0 + 'px'
							});
						} else {
							var wrapWidth = ~~ itemWrap.width();
							var newImgHeight = ~~ (wrapWidth / imgRatio);
							img.width(wrapWidth);
							img.height(newImgHeight);
							offset = ~~ (itemWrap.height() / 2 - newImgHeight / 2);

							if (offset < 0)
								offset = offset * -1;

							img.css({
								'top': - offset + 'px',
								'left': 0 + 'px'
							});
						}
					}
				});
			};

			var itemWrap = $(this);
			var img = itemWrap.find('img');
			var imgWidth = parseInt(img.attr('width'));
			var imgHeight = parseInt(img.attr('height'));

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
