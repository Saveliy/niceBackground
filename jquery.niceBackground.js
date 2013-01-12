/**
 * @author: Saveliy Bondarenko
 * @date: 12.01.13, 23:21
 */

// В атрибутах картинки должны быть указанны width и height.
// Img - должен быть position-absolute;
//

// TODO: Определять высоту и ширину картинки.
// TODO: Реализовать поддержку свойства background-size: 100% при переданном параметре и если браузер поддерживает данное свойство.


(function($){
	jQuery.fn.niceBackground = function(){
		var items = $(this);

		items.each(function() {
			var itemWrap = $(this);
			var img = itemWrap.find('img');
			var imgWidth = parseInt(img.attr('width'));
			var imgHeight = parseInt(img.attr('height'));
			var imgRatio = imgWidth / imgHeight; // Брать из атрибутов.
			var offset;

			img.css('position', 'absolute');

			$(window).resize(function() {
				var ratio = itemWrap.width() / itemWrap.height();

				if (imgRatio > ratio) {
					var wrapHeight = itemWrap.height();
					var newImgWidth = wrapHeight * imgRatio;
					img.height(wrapHeight);
					img.width(newImgWidth);
					offset = itemWrap.width() / 2 - newImgWidth / 2;

					if (offset < 0)
						offset = offset * -1;

					img.css({
						'left': - offset + 'px',
						'top': 0 + 'px'
					});
				} else {
					var wrapWidth = itemWrap.width();
					var newImgHeight = wrapWidth / imgRatio;
					img.width(wrapWidth);
					img.height(newImgHeight);
					offset = itemWrap.height() / 2 - newImgHeight / 2;

					if (offset < 0)
						offset = offset * -1;


					img.css({
						'top': - offset + 'px',
						'left': 0 + 'px'
					});
				}
			});
		});

		return items;
	};
})(jQuery);
