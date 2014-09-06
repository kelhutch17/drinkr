/* Custom Javascript for this PhoneGap APP */

function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}	

function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}


$(document).on( "mobileinit", function() {
	console.log("Initialize jQuery Mobile Phonegap Enhancement Configurations")
	// Make your jQuery Mobile framework configuration changes here!
	$.mobile.allowCrossDomainPages = true;
	$.support.cors = true;
	$.mobile.buttonMarkup.hoverDelay = 0;
	$.mobile.pushStateEnabled = false;
	$.mobile.defaultPageTransition = "none";
	var getvars = getUrlVars();

	if(!supports_html5_storage()){
		alert("not supported");
	}
	else{
		console.log(getvars);
		if( "submit" in getvars ){
			localStorage["drinkr.name"] = getvars["name"];
			localStorage["drinkr.age"] = getvars["age"];
			localStorage["drinkr.weight"] = getvars["weight"];
			localStorage["drinkr.gender"] = getvars["gender"];
			localStorage["drinkr.heightft"] = getvars["heightft"];
			localStorage["drinkr.heightin"] = getvars["heightin"];
			console.log("data stored");
		}

		console.log(localStorage["drinkr.name"]);
	}

	$("#submit").on("click", function( event ){

		event.preventDefault();

		$.mobile.navigate( $(this).attr( "href" ), {
			foo: $(this).attr("data-foo")
		});

	}

});