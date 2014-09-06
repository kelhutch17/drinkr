/* Custom Javascript for this PhoneGap APP */

$(document).on( "mobileinit", function() {
	console.log("Initialize jQuery Mobile Phonegap Enhancement Configurations")
	// Make your jQuery Mobile framework configuration changes here!
	$.mobile.allowCrossDomainPages = true;
	$.support.cors = true;
	$.mobile.buttonMarkup.hoverDelay = 0;
	$.mobile.pushStateEnabled = false;
	$.mobile.defaultPageTransition = "none";

});


$(document).on( "pagecreate", function() {

	$('#drinktype').on('change', function () {
		var $this = $(this),
			val = $this.val()

		switch(val) {
			case "beershow":
			$('#beercontent').collapsible("expand");
			break;
			case "cocktailshow":
			$('#cocktailcontent').collapsible("expand");
			break;
			case "shotshow":
			$('#shotcontent').collapsible("expand");
		} 
		
	});

	$("#beershow").click(function(){
		
	});

	$("#cocktailshow").click(function(){
		
	});

	$("#shotshow").click(function(){
		
	});


});
