(function($){
	// http://www.cssnewbie.com/equalheights-jquery-plugin/
	$.fn.equalHeights = function(options) {
		var settings = $.extend( {
			container: null
		}, options);
		
		var currentTallest = 0;
		var outerTallest = 0;
		var $this = $(this);
		
		$this
			.css({
				'height': 'auto',
				'min-height': '0px'
			})
			.each(function() {
				var $el = $(this);

				if ($el.height() > currentTallest) {
					currentTallest = $el.height();
					outerTallest = $el.outerHeight();
				}
			})
			.css({
				'height': currentTallest,
				'min-height': currentTallest
			});

			if (settings.container!=null) {
				$this.parents(settings.container).css({
					'height': outerTallest,
					'min-height': outerTallest
				});
			}
		
		return this;
	};
	
	$.fn.splitRows = function(options) {
		var settings = $.extend( {
			container: '.row',
			class: 'row-i-'
		}, options);

		if (this.length === 0) {
			return this;
		}

		var $container = $(this[0]).parent(settings.container);
		var container_width = $container.innerWidth();

		var els_width_summ = 0;
		var row_i = 0;
		
		this.each(function(){
			var $el = $(this);
			var el_width = $el.outerWidth();
			els_width_summ += el_width;

			if (els_width_summ > container_width) {
				els_width_summ = el_width;
				row_i += 1;
			}

			var old_row_i = $el.attr('data-row');
			if (old_row_i) {
				$el.removeClass(settings.class + old_row_i);
			}
			
			$el.attr('data-row', row_i).addClass(settings.class + row_i);
		});

		return this;
	};

	$.equalHeightsAdvanced = function(options) {
		var settings = $.extend({
			container: '.row-goods',
			cell: '.cell',
			block: 'article',
			class: 'row-i-',
			class_first_el: 'row-el-first',
			class_last_el: 'row-el-last',
			class_row_first: 'row-first'
		}, options);

		var $split_rows_items = $(settings.container +' '+ settings.cell);
		$split_rows_items.splitRows(settings);

		var $prev_el;
		var old_class;
		var row_num = 0;
		var el_i=0;
		var els_in_row = 0;

		$split_rows_items.each(function() {
			var $el = $(this);
			$el
				.removeClass(settings.class_first_el)
				.removeClass(settings.class_middle_el)
				.removeClass(settings.class_last_el)
				.removeClass(settings.class_row_first);

			var old_row_i = $el.attr('data-row');
			var el_class = settings.class + old_row_i;
			
			el_i++;
			if (old_class !== el_class) {
				row_num++;
				els_in_row = el_i;
				el_i = 0;
				
				$(settings.container +' .'+ el_class +' '+ settings.block).equalHeights({
					container: '.cell'
				});
				old_class = el_class;
				
				$el.addClass(settings.class_first_el);
				
				if ($prev_el) {
					$prev_el.addClass(settings.class_last_el);
				}
			}

			if (row_num===1) {
				$el.addClass(settings.class_row_first);
			}
			
			$prev_el = $el;
		});

		if (els_in_row && (els_in_row-1)===el_i) {
			$prev_el.addClass(settings.class_last_el);
		}

		return this;
	};

})(jQuery);
