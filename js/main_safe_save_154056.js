$().ready(function() {

	$('.ProductDetailsGrid').hideIfChildrenInvisible();
	$('.OutOfStockMessage, .alert-sold-out').hideIfEmpty();
	$('ul.nav li, aside .category-list li, #SideAccountMenu > ul > li').highlightActiveLinks();
	$('.product-rating, .review-rating, .Rating, .CompareRating').formatRating();

	$('.InitialFocus').focus();

	$( document ).ajaxStart(function() {

		showLoadingIndicator();
	});
	
	$( document ).ajaxComplete(function() {

		hideLoadingIndicator();
	});

	/* --- Header --- */

	var bLoggedIn = ($('#top-menu li:nth-child(2) a').text() == 'Sign out')?1:0;

	if(!bLoggedIn){

		$('#top-menu li:nth-child(1), #top-menu li:nth-child(2)').css('display', 'none');
	}

	if(!$('.link-cart span').text().length){

		$('.link-cart span').text('(0 items)');
	}
	

	$('#home-slide-show .slide-text').each( function(){

		$(this).html( $(this).text().replace('||', '<br /><br />') );
	});

	$("#home-slide-show").each( function(){
		
		var nSlides = $(".carousel-inner li", this).length,
			sliderID = $(this).attr('id'),
			bIndicators = $(this).attr('data-indicators');
		
		$(".carousel-inner li:first-child", this).addClass('active');
		
		if(bIndicators !== false){
			
			for( var j = 0; j < nSlides; j++){
				
				var classActive = (!j)?' class="active"':'';
				
				$(".carousel-indicators", this).append( '<li data-target="#' + sliderID + '" data-slide-to="' + j + '"' + classActive + '></li>' );
			}
		}
	});

	$('.ShippingAddressList li').addClass('col-md-4');




	// function lazyContainer(searchNode) {
	//    $(searchNode).find('.active').each(function() {
	//        var imgSrc = $(this).attr('data-src');
	//        if (imgSrc) {
	//            $(this).css({'background': 'url(' + imgSrc + ') 0% 50% no-repeat', 'backgroundSize': 'contain'});
	//            $(this).attr('data-src','');
	//        }
	//    });
	// }

	// $("#home-slide-show").on('slide.bs.carousel', function() {
	//     lazyContainer(this);
	// });

	// lazyContainer("#home-slide-show");

	/* Product Lists */

	$('li.QuickView .photo').each( function(){

		$(this).append( 
			$('<div />').attr({
				'class': 'overlay-quickview'
			}).html('<a href="#" class="btn btn-info btn-quickview"><i class="glyphicon glyphicon-eye-open"></i> <span class="hidden-xs">Open in Quickview</span></span>')
		);
	});

	$(document).on('click', '.col-item .photo', function(e){

		e.preventDefault();

		if( $(e.target).attr('class') == 'overlay-quickview' ){

			window.location = $(this).parents('li').find('h5 a').attr('href');
		}else{

			var nProductID   = $(this).parents('li').attr('data-product') || 0,
				quickViewURL = '/remote.php?w=getproductquickview&pid=' + nProductID;

			$.getJSON( quickViewURL ).success(function(data) {

			   $('#general-modal .modal-content').html(data.content);
			   $('#general-modal').modal('show');
			});			
		}
	});	

	/* --- Product Page -- */

	if( $("#carousel-thumbnails li.thumbnail").length < 2 ){

		$("#carousel-thumbnails").hide();
		$("#product-image-carousel .pagination").hide();
	}

	if( $('#product-attribute-weight dd').text() == '' ){

		$('#product-attribute-weight').hide();
	}

	$('#product-attributes dd').text().replace('unit(s)', '')
	
	// if( !$('#product-attributes dd').text().replace('unit(s)', '').replace('unit(s)', '').trim().length ){

	// 	$('#product-attributes').hide();
	// }


	if($('#BulkDiscountLink').is(':visible')){


		$('.product-price-container .lead').css({ lineHeight: '27px' });
	}



	$('.nav.category-list .category-list').removeClass('nav navbar-nav category-list');

	if($('body').hasClass('page-category') || $('body').hasClass('page-product')){

		// if($('#breadcrumbs ul li:nth-child(2) a').length){

		// 	var categoryLink = $('#breadcrumbs ul li:nth-child(2) a').attr('href').replace(window.location.protocol + '//' + window.location.host, ''),
		// 		categoryColor = $('#header .category-list > li > a[href$="' + categoryLink + '"]').siblings('ul').css('borderColor');

		// 	$('.page-category h1.page-header').css({'backgroundColor': categoryColor, 'color': '#fff'});
		// 	$('aside > .category-list > li > a, #main a:hover, #breadcrumbs a').css('color', categoryColor);
		// }else{

		// 	console.log('tesft');

			var categoryName = $('#breadcrumbs ul li:nth-child(2)').text();

			$('#header .category-list > li > a').each( function(){

				if($(this).text() == categoryName){

					var categoryColor = $(this).siblings('ul').css('borderColor');
					//aside .category-list > li > ul > li > a
					$('.page-category h1.page-header').css({'backgroundColor': categoryColor, 'color': '#fff'});

					$('aside .category-list > li > ul > li > ul > li > a:hover, aside .category-list > li > ul > li > ul > li.active > a')
						.css({'color': categoryColor});

					$('aside > .category-list > li > a, #main a:hover, #breadcrumbs a, #header .category-list li.active a')
						.css('color', categoryColor);

					$('aside .category-list > li > ul > li > ul > li > a:hover')
						.css('color', categoryColor);

					$('aside .category-list > li > ul > li > ul > li.active > a')
						.css('color', categoryColor);

				}
			});
		// }
	}

	if( $('body').hasClass('page-product') ){

		var minimumQuantity = $('#product-attribute-minimum-quantity dd').text();

		if(minimumQuantity > 1){

			$('#text_qty_').val( minimumQuantity );
		}
	}
	/* 
	 * Superfish is ooooooold and we don't need it 
	*/
    $(".sf-menu").removeClass('sf-menu');


	/* --- Homepage --- */

	$('#top-products-slide-show').carousel({

		interval: 4000
	}).on('slide.bs.carousel', function (e) {
        var nextH = $(e.relatedTarget).height();
        $(this).find('.active').parent().animate({ height: nextH }, 500);
    }).carousel(0);
	
	$("#top-products-slide-show .carousel-inner > li").chunkList();

	/* --- Cart page --- */

	$('.CartThumb').each( function(){

		$('a', this).addClass('thumbnail pull-left');
		$('img', this).addClass('media-object');
	})

	
	
	// $('.TabContainer .TabNav li').click(function() {

	// 	$(this).parent('.TabNav').find('li').removeClass('Active');
	// 	$(this).parents('.TabContainer').find('.TabContent').hide();
	// 	$(this).addClass('Active');
	// 	$(this).parents('.TabContainer').find('#TabContent'+this.id).show();
	// 	$(this).find('a').blur();

	// 	return false;
	// });
	
	// generic checkbox => element visibility toggle based on id of checkbox and class names of other elements
	$('.CheckboxTogglesOtherElements').on('change', function(event){

		if (!this.id) {
			return;
		}
		
		var className = 'ShowIf_' + this.id + '_Checked',
			elements = $('.' + className);
		
		if (this.checked) {
			// easy, show matching elements
			elements.show();
			return;
		}
		
		// if not checked it's a little more tricky -- only hide elements if they are not showing for multiple check boxes
		var classExpression = /^ShowIf_(.+)_Checked$/;

		elements.each(function(){
			var $$ = $(this);
			
			// before hiding this element, check its classes to see if it has another ShowIf_?_Checked - if it does, see if that class points to a checked box
			var classes = $$.attr('class').split(/\s+/),
				checked = false;

			$.each(classes, function(key,value){

				if (value === className) {
					// we're processing this class already so we know it's unchecked - ignore it
					return;
				}
				
				var result = classExpression.exec(value);

				if (result === null) {
					// not a ShowIf_?_Class
					return;
				}
				
				var id = result[1];

				if ($('#' + id ).attr('checked')) {
					// found a checked box
					checked = true;
					return false;
				}
			});
			
			if (!checked) {
				// found no checkbox that should be keeping this element visible
				$$.hide();
			}
		});
		
	}).change();

	if( $('body').hasClass('page-category') ){
		
		if($('aside .category-list li.active').length){

			$('aside .category-list li.active').parents('ul').parent().addClass('active');
			$('aside .category-list li.active').parents('ul').parents('ul').parent().addClass('active');

			$('aside .category-list > li').each( function(){

				if(!$(this).hasClass('active')){

					$(this).css('display', 'none');
				}
			});
		}
	}


});

/* --- Functions --- */

$.fn.hideIfEmpty = function(){

	if(!$(this).text().trim().length)
		$(this).hide();

	return this;
}

$.fn.hideIfChildrenInvisible = function(){

	if(!$('> *:visible', this).length)
		$(this).hide();

	return this;
}

$.fn.highlightActiveLinks = function(){

	$(this).each( function(){

		var relativeLink = $('a', this).attr('href').replace(window.location.protocol + '//' + window.location.host, '');

		if(relativeLink == window.location.pathname + window.location.search)
			$(this).addClass('active');

	});

	return this;
}

$.fn.formatRating = function(){

	$(this).each( function(){

		if(!!$(this).attr('data-rating')){

			var nRating = $(this).attr('data-rating');
		}else
		if($('img', this).length){

			var nRating = $(this).find('img').attr('src').match(/Rating(\d+)/)[1];

			$('img', this).remove();
		}else{
			
			var nRating = this.className.match(/Rating(\d+)/)[1];
		}

		for( var i = 0; i < 5; i++ ){

			var classDisabled = (i >= nRating)?'glyphicon-disabled ':'';

			$(this).append( $('<i class="' + classDisabled + 'glyphicon glyphicon-star"></i>') );
		}
	});

	return this;
}

$.fn.chunkList = function(){

	var per_slide = 4;
	
	for(var i = 0; i < this.length; i += per_slide){

		var current = (i == per_slide)?' active':'';

		this.slice(i, (i + per_slide)).wrapAll('<li class="item' + current + '"><ul class="ProductList"></ul></li>');
	}

	return this;
}