$( document ).ready( function(){
	$('.portfolio-holder ul').jcarousel({
		scroll: 1,
		wrap: 'both',
		initCallback: _carousel_init,
		buttonNextHTML: null,
		buttonPrevHTML: null
	});
	
	$('#navigation').animate({ top: '-250px' }, 800);
	
	$('#navigation').hover(
		function(){ $(this).animate({ top: '0px' }, 1300);  },
		function(){ $(this).animate({ top: '-250px' }, 900 ); }
	);
	
});
function _carousel_init(carousel) {
	$('.portfolio .portfolio-nav .next').bind('click', function() {
		carousel.next();
		return false;
	});

	$('.portfolio .portfolio-nav .prev').bind('click', function() {
		carousel.prev();
		return false;
	});
};