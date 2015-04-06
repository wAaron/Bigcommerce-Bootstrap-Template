var JQZOOM_OPTIONS = {
	zoomType: 'innerzoom',
	preloadImages: false,
	title: false
};

$().ready(function() {
	
	$('.ProductDetailsGrid').hideIfChildrenInvisible();
	$('.OutOfStockMessage, .alert-sold-out').hideIfEmpty();
	$('#navbar-collapse-main-menu > ul > li, aside .category-list li, .page-category aside ul li').highlightActiveLinks();
	$('.product-rating, .Rating, .CompareRating').formatRating();

	$('.productOptionPickListSwatch').formatProductColorSwatches();
	$('.productOptionViewRectangle').formatProductOptions();


	$('.InitialFocus').focus();
	
	$( document ).ajaxStart(function() {
		
		showLoadingIndicator();
	});
	
	$( document ).ajaxComplete(function() {
		
		hideLoadingIndicator();
	});

	/*$('.slide-heading').each( function(){

		var title_words = $(this).text().split(' '),
			first_word = title_words.shift();

		$(this).html( first_word + '<small>' + title_words.join(' ') + '</small>' );
	});*/
	
	/* --- Header --- */

	$(document).on('click', "#header button",function() {

		$("html, body").animate({ scrollTop: 0 }, "slow");
		
		return false;
	});

	$('.YouSave').text( $('.YouSave').text().replace('(', '').replace(')', '') );

	if( !$('#collapseTwo .panel-body > div').text().length ){

		$('#collapseTwo').parent().remove();
	}
	/* 
		* If menu item has text in parenthesis put it in an em tag so we can style a subtitle 
	*/
	$('#navigation-top > ul > li a small').each( function(){
		
		var textInParenthesis = $(this).text().match(/\(([^)]+)\)/);
		
		if(textInParenthesis){
			
			var match = $(this).text().match(/\d+/);
			
			if(match){
				
				$(this).text( '(' + match[0] + ')' );				
			}
		}
	});
	
	$('.category-list').addClass('nav navbar-left');
	
	$('#header .navbar-left li, #header .navbar-right li').each( function(){
		
		if( $('ul li', this).length ){
			
			$('> a', this).append( $('<i />').addClass('glyphicon glyphicon-chevron-down') );
			}else{
			
			$('ul', this).remove();
		}
	});
	
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
	
	function lazyContainer(searchNode) {
		$(searchNode).find('.active').each(function() {
			var imgSrc = $(this).attr('data-src');
			if (imgSrc) {
				$(this).css({'background': 'url(' + imgSrc + ') 0% 50% no-repeat', 'backgroundSize': 'contain'});
				$(this).attr('data-src','');
			}
		});
	}
	
	$("#home-slide-show").on('slid.bs.carousel', function() {

	    lazyContainer(this);
	});
	
	lazyContainer("#home-slide-show");
	
	/* Product Lists */
	
	$('li.QuickView .photo').each( function(){
		
		$(this).append( 
		$('<div />').attr({
			'class': 'overlay-quickview'
		}).html('<a href="#" class="btn btn-info btn-quickview"><i class="glyphicon glyphicon-eye-open"></i> <span class="hidden-md hidden-s hidden-xs">Open in Quickview</span><span class="hidden-lg">Quickview</span></span>')
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

			    $('.productOptionPickListSwatch').formatProductColorSwatches();
            	$('.productOptionViewRectangle').formatProductOptions();
			});			
		}
	});	
	
	// $(document).on('click', '.btn-quickview', function(e){
		
	// 	e.preventDefault();
		
	// 	var nProductID   = $(this).parents('li').attr('data-product') || 0,
	// 	quickViewURL = '/remote.php?w=getproductquickview&pid=' + nProductID;
		
	// 	$.getJSON( quickViewURL ).success(function(data) {
			
	// 		$('#general-modal .modal-content').html(data.content);
	// 		$('#general-modal').modal('show');
	// 	});
	// });
	
	/* --- Product Page -- */


	
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
	
	$('.TabContainer .TabNav li').click(function() {
		
		$(this).parent('.TabNav').find('li').removeClass('Active');
		$(this).parents('.TabContainer').find('.TabContent').hide();
		$(this).addClass('Active');
		$(this).parents('.TabContainer').find('#TabContent'+this.id).show();
		$(this).find('a').blur();
		
		return false;
	});
	
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
	
	
    $('#product-accordion').on('show.bs.collapse', function () {
	
		$(this).find('.panel').each(function(){
			
			//console.log( $(this).find('.panel-title a').attr('class') );
			
			if ( $(this).find('.panel-title a').attr('aria-expanded') == "true" ) {
				$(this).find('.panel-title i.glyphicon').removeClass("glyphicon-plus").addClass("glyphicon-minus");
			}
			
			if ( $(this).find('.panel-title a').attr('aria-expanded') == "false" ) {
				$(this).find('.panel-title i.glyphicon').removeClass("glyphicon-minus").addClass("glyphicon-plus");
			}
		});
		
	});
	
    $('#product-accordion').on('hide.bs.collapse', function () {

		$(this).find('.panel').each(function(){
			
			//console.log( $(this).find('.panel-title a').attr('class') );
			
			if ( $(this).find('.panel-title a').attr('aria-expanded') == "true" ) {
				$(this).find('.panel-title i.glyphicon').removeClass("glyphicon-plus").addClass("glyphicon-minus");
			}
			
			if ( $(this).find('.panel-title a').attr('aria-expanded') == "false" ) {
				$(this).find('.panel-title i.glyphicon').removeClass("glyphicon-minus").addClass("glyphicon-plus");
			}
		});
		
	});




	/******************
	 * From Cleanglobals.js
	/******************/

	// $('.autobox').autobox();
	
	$(".icon-twitter .symbol").text('twitterbird');
	$(".icon-facebook .symbol").text('facebook');
	$(".icon-googleplus .symbol").text('googleplus');
	$(".icon-youtube .symbol").text('youtube');
	$(".icon-pinterest .symbol").text('pinterest');
	
	$('.cart-thumb a').addClass('thumbnail');
	$("#breadcrumbs ul").addClass('breadcrumb'); // Still need this for products page
	$('.sf-menu').removeClass('sf-menu');
	$('.sf-vertical').removeClass('sf-vertical');
	$(".SuccessMessage").addClass('alert alert-success').removeClass('SuccessMessage').removeClass('Message');
	$(".ErrorMessage").addClass('alert alert-danger').removeClass('ErrorMessage').removeClass('Message');
	$(".InfoMessage").addClass('alert alert-info').removeClass('InfoMessage').removeClass('Message');
	
	if($("#PurchaseGiftCertificate").length){
	
		$("#GiftCertificateThemeList br").remove();
	}
	
	$("#collapseByCategory .panel-body ul").addClass('list-unstyled');
	
	$(".breadcrumb ul, .breadcrumb ol, #ProductBreadcrumb ul").addClass('breadcrumb');
	$(".breadcrumb ul li:last-child, .breadcrumb ol li:last-child").addClass('active');
	
	$("#BlogRecentPosts ul li").each( function(){
	
		$(this).addClass('list-group-item');
	});
	
	$(".btn-secondary").addClass('btn btn-default');
	$('.ActivePage').addClass('active');
	
	$("form dl").each( function(){
		
		$(this).find("dt").each( function(){
		
			$(this).addClass('control-label');
			$(this).next().find("input, textarea, select").addClass('form-control').removeAttr('size');
		});
	});
	
	$("dd input[type=text], dd select, .quantityInput, .CartCode input[type=text]").addClass('form-control');
	
	$("input[type=submit]").addClass('btn btn-primary');
	
	$(".FormFieldLabel").parents("dt").addClass('control-label');
	
	$("#subcategory-list li").each( function(){
	
		$(this).addClass('list-group-item');
	});
	
	if($(".pagination li:first-child").not('.sr-only').text() == ''){
	
		$(".pagination li:first-child").addClass('disabled').html( $('<a href="#">&laquo; Prev</a>') );
	}
	
	$(".pagination li.active").wrapInner('<a href="#" />');
	
	$("#SimilarProductsByCustomerViews h3").html( '<span>' + $("#SimilarProductsByCustomerViews h3").text() + '</span>' );

	//Make categories page 1 column if nothing is in the sidebar
	
	if(!$(".page-category #main aside.col-md-3 li").length){
		
		$(".page-category #main aside.col-md-3").remove();
		
		$(".page-category #main .col-md-9").removeClass('col-md-9').addClass('col-md-12');
	}

	$('#content-newsletter p a').addClass('btn btn-primary');

	/**************
	* End from cleanglobals.js
	/**************/

	if( $('body.page-product').length ){

		if( !$('#carousel-thumbnails li').length ){

			$('#product-left-column').hide();
			$('#product-right-column').addClass('no-images');

			$('#add-to-cart-box > div').removeClass('col-md-3').removeClass('col-md-5').addClass('col-md-4');
		}

		if( $("#carousel-thumbnails li.thumbnail").length < 2 ){
			
			$("#carousel-thumbnails").hide();
			$("#product-image-carousel .pagination").hide();
		}
		
		if( $('#product-attribute-weight dd').text() == '' ){
			
			$('#product-attribute-weight').hide();
		}
		
		if( !$('#product-attributes dd').text().replace('unit(s)', '').replace('unit(s)', '').trim().length ){
			
			$('#product-attributes').hide();
		}
	}

	// if( $('body').hasClass('page-sitemap') ){

	// 	$('#breadcrumbs').detach().prependTo('.navbar-inverse');
	// 	$('.page-header').detach().insertAfter('#breadcrumbs');
	// }

	if( $('body').hasClass('page-category') ){
		
		if($('aside .category-list > li.active').length){

			$('aside .category-list > li').each( function(){

				if(!$(this).hasClass('active')){

					$(this).css('display', 'none');
				}
			});
		}
	}

	$('body').addClass('loaded');
});

/* --- Functions --- */

