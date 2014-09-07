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

	$("#recenttable").hide();

});

var BEER = 
{
	"Bud Light":"4.2", "Miller Light":"4.2", "Yuengling":"4.4",
	"Yuengling Light":"3.5", "Coors Light":"4.2", "Heineken":"5",
	"PBR":"4.74", "Natural Light":"4.2", "Guiness":"4.3", "Stella Artois":"5.2",
	"Samuel Adams":"4.9", "Red Stripe":"4.7", "Bass":"5", "Rolling Rock":"4.4",
	"Busch":"4.1", "Beck's":"4.9", "Hoegaarden":"4.9", "Hefeweizen":"4.9",
	"Keystone Light":"4.2", "Miller High Life":"5", "Corona":"4.6", "Corona Light":"4.5",
	"Angry Orchard":"5", "Redd's Apple Ale":"5", "Woodchuck Hard Cider":"5", 
	"Magner's Vintage Cider":"4.5", "Mike's Hard Lemonade":"5", "Colt 45":"6.5", 
	"Hurricane":"5.9", "Olde English":"5.9", "Steel Reserve":"8.1"
};

var COCKTAILS = 
{
	"margarita":["2.5", "40"], "cosmopolitan":["2","37.5"], "martini":["2.25", "37.4"], "Vodka + Non-Alcoholic Mixer":["2", "40"], "Rum + Non-Alcoholic Mixer":["2","40"],
	"Gin + Non-Alcoholic Mixer":["2","47.3"], "Whiskey + Non-Alcoholic Mixer":["2","42.5"], "Tequila Sunrise":["1.5","38"], "White Russian":["3","33.4"],
	"Moscow Mule":["2","40"], "Long Island Iced Tea":["2.5","39.1"], "Daquiri or Pina Colada":["3","40"], "Mojito":["2","40"], "Bloody Mary":["2","40"],
	"Sea/Bay Breeze":["2","40"], "Irish Car Bomb":["13","6.75"], "Jager Bomb":["2","35"], "Vegas Bomb":["2","28"], "Mimosa":["6","14"], "Malibu Bay Breeze":["1.5","21"]
};

var SHOTS =
{
	"kamikaze":["2","37.5"], "lemon drop":["1.5","40"], "redheaded slut":["2","29"], "vodka":["1.5","40"], "rum":["1.5","40"], "gin":["1.5","47.3"],
	"whiskey":["1.5","45"], "tequila":["1.5","40"], "fireball":["1.5","33"], "dirty girl scout":["4","22.8"], "washington apple":[".75","30"],
	"alabama slammer":["1.5","33.3"], "blow job":[".75","24.3"], "fourth of july":["1","27.5"]
};


function solveBAC(ounces, percent, weight, hours) {
	var result = (ounces * percent * 0.075 / weight) - (hours * 0.015);
	result = Math.round(result * 1000) / 1000;
	return result
}
