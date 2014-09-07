
/*
   JQuery Mobile Init Functions
  ==============================
  */

  $(document).on("mobileinit", function () {
	console.log("Initialize jQuery Mobile Phonegap Enhancement Configurations")
	// Make your jQuery Mobile framework configuration changes here!
	$.mobile.allowCrossDomainPages = true;
	$.support.cors = true;
	$.mobile.buttonMarkup.hoverDelay = 0;
	$.mobile.pushStateEnabled = false;
	$.mobile.defaultPageTransition = "none";
});

  $(document).on( "pagecreate", function() {
	/* If we already have name set, we assume we have all the info and we don't
	show the user the initial setup screen */
	if (localStorage.getItem("name") != null){
		var data = retrieveData();
		populateContainers(data);
		$.mobile.changePage('#home');
	}

	/* Setup various event handlers here */

	$('#drinktype').on('change', function () {
		var $this = $(this),
		val = $this.val();

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

	$('#recenttable').hide();

	$('#initialsubmit').click(function(){
		console.log("Initial submit");
		var data = {};
		data.age = $('#age').val();
		data.gender = $('input[name=gender]:checked').val();
		var heightft = $('#heightft').val();
		var heightin = $('#heightin').val();
		data.height = heightToInches(heightft, heightin);
		data.name = $('#name').val();
		data.weight = $('#weight').val();
		data.totalDrinks = $('#totalDrinks').val();

		/*Store all our data into localStorage*/
		stashData(data);

		heightobj = heightToFeet(data.height);

		/*Update all the placeholders on the page*/
		populateContainers(data);

		/*Then change to the main page*/
		$.mobile.changePage('#home', { transition: 'slide' });
	});


	/*Main Drink entry logic here*/
	$('#beersubmit').click(function(){
		addDrink("beer");
	});

	$('#cocktailsubmit').click(function(){
		addDrink("cocktail");
	});

	$('#shotsubmit').click(function(){
		addDrink("shot");
	});

	$("#beername").change(function(){
		$("#beerabv").val('');
	});

	$("#shotname").change(function(){
		$("#shotabv").val('');
	});

	/*Settings menu control*/
	$('#editage').click(function(){
		$('#editagepicker').val(data.age);
	});

	$('#editgender').click(function(){
		if (data.gender == "male") {
			$('#editgenderpickermale').prop('checked', true);
			$('#editgenderpickerfemale').prop('checked', false);
		}
		else {
			$('#editgenderpickermale').prop('checked', false);
			$('#editgenderpickerfemale').prop('checked', true);
		}
	});

	$('#editheight').click(function(){
		var heightobj = heightToFeet(data.height);
		$('#editheightftpicker').val(heightobj.feet);
		$('#editheightinpicker').val(heightobj.inches);
	});

	$('#editname').click(function(){
		$('#editnamepicker').val(data.name);
	});

	$('#editweight').click(function(){
		$('#editweightpicker').val(data.weight);
	});

	/* called when anything in the edit menu is submitted */
	$('.editsubmit').on('click', function(){
		console.log("Updating all");
		data.age = $('#editagepicker').val();
		data.gender = $('input[name=editgenderpicker]:checked').val();
		var heightobj = heightToInches($('#editheightftpicker').val(),$('#editheightinpicker').val());
		data.height = heightobj
		data.name = $('#editnamepicker').val();
		data.weight = $('#editweightpicker').val();
		data.totalDrinks = $('#totalDrinks').val();
		stashData(data);
		populateContainers(data);
	});

	$('#cleardata').click(function(){
		console.log("clearing everything!");
		localStorage.clear();
		window.location.replace("#");
	});
});


/*
   Data Handling Functions
  =========================
  */

  function heightToInches(feet, inches){
	return ((feet*12) + +inches);
  }


  function heightToFeet(inches){
	var height = {};
	height.feet = Math.floor(inches/12);
	height.inches = inches % 12;
	return height;
  }


  function populateContainers(data) {
	try {
		$(".agecontainer").text(data.age);
		$(".gendercontainer").text(data.gender);
		var heightobj = heightToFeet(data.height);
		$(".heightftcontainer").text(heightobj.feet);
		$(".heightincontainer").text(heightobj.inches);
		$(".namecontainer").text(data.name);
		$(".weightcontainer").text(data.weight);
	}
	catch(err) {
		console.log(err);
		return false;
	}
	return true;
  }


  function stashData(data) {
	localStorage.setItem('age',data.age);
	localStorage.setItem('gender',data.gender);
	localStorage.setItem('height',data.height);
	localStorage.setItem('name',data.name);
	localStorage.setItem('weight',data.weight);
	localStorage.setItem('totalDrinks', data.totalDrinks);
	localStorage.setItem('BAC', data.BAC);
	return true;
  }


  function retrieveData() {
	var data = {};
	data.age = localStorage.getItem('age');
	data.gender = localStorage.getItem('gender');
	data.height = localStorage.getItem('height');
	data.name = localStorage.getItem('name');
	data.weight = localStorage.getItem('weight');
	data.totalDrinks = localStorage.getItem('totalDrinks');
	data.BAC = localStorage.getItem('BAC');
	return data;
  }



/*
   Alcohol Calculation Functions
  ===============================
  */

function addDrink(type){
	if ($('#recenttable').is(":hidden")){
		$('#recenttable').show();
		$('#recenttext').hide();
	}


	var drink = {};
	switch(type){
		case "beer":
		drink = beerLoad();
		break;
		case "cocktail":
		drink = cocktailLoad();
		break;
		case "shot":
		drink = shotLoad();
		break;
	}

	time = timeStamp();

	var fields = "<td>" + drink.type + "</td>" +
		"<td>" + drink.name + "</td>" +
		"<td>" + drink.size + "</td>" +
		"<td>" + drink.percent + "</td>" +
		"<td>" + time + "</td>";

	$("#recentdrinks").find('tbody').append($('<tr>').html(fields));
	
	// track total drinks
	var totalDrinks = parseInt($("#totalDrinks").val());
	totalDrinks = isNaN(totalDrinks) ? 0 : totalDrinks;
	totalDrinks++;
	$("#totalDrinks").text(totalDrinks.toString());
	$("#totalDrinks").val(totalDrinks);

	var BAC;
	// oz % wt hrs --
	BAC = solveBAC(drink.size, parseInt(drink.percent), localStorage.getItem('weight'), .20);
	
	var oldBAC = $("#BAC").val();

	if ($("#BAC").val() === "") {
		oldBAC= BAC;
	}
	else {	
		oldBAC = +oldBAC + BAC;
	}

	$("#BAC").text(oldBAC.toFixed(3).toString());
    $("#BAC").val(oldBAC);

	if (BAC >= .2){
		sendYo();
	}
	

	var lastDrink = Date.now();


}

function beerLoad(){
	var BEER = 
	{
		"bud light":"4.2", "miller light":"4.2", "yuengling":"4.4",
		"yuengling light":"3.5", "coors light":"4.2", "heineken":"5",
		"pbr":"4.74", "natural light":"4.2", "guiness":"4.3", "stella artois":"5.2",
		"samuel adams":"4.9", "red stripe":"4.7", "bass":"5", "rolling rock":"4.4",
		"busch":"4.1", "beck's":"4.9", "hoegaarden":"4.9", "hefeweizen":"4.9",
		"keystone light":"4.2", "miller high life":"5", "corona":"4.6", "corona light":"4.5",
		"angry orchard":"5", "redd's apple ale":"5", "woodchuck hard cider":"5", 
		"magner's vintage cider":"4.5", "mike's hard lemonade":"5", "colt 45":"6.5", 
		"hurricane":"5.9", "olde english":"5.9", "steel reserve":"8.1"
	};

	var drink = {};

	drink.type = "beer";
	drink.name = $('#beername').val();
	drink.size = $('#beersize').val();

	if ($('#beerabv').val() != "") {
		drink.percent = $('#beerabv').val();
		console.log("using the given abv");
	}
	else {
		if (drink.name in BEER) {
			drink.percent = BEER[drink.name];
			console.log(drink.percent);
		}
		else {
			console.log("404 beer not found");
		}
	}
	return drink;
	
}

function cocktailLoad(){
	var COCKTAILS = 
	{
		"margarita":["2.5", "40"], "cosmopolitan":["2","37.5"], "martini":["2.25", "37.4"], "vodka + non-alcoholic mixer":["2", "40"], "rum + non-alcoholic mixer":["2","40"],
		"gin + non-alcoholic mixer":["2","47.3"], "whiskey + non-alcoholic mixer":["2","42.5"], "tequila sunrise":["1.5","38"], "white russian":["3","33.4"],
		"moscow mule":["2","40"], "long island iced tea":["2.5","39.1"], "daquiri or pina colada":["3","40"], "mojito":["2","40"], "bloody mary":["2","40"],
		"sea/bay breeze":["2","40"], "irish car bomb":["13","6.75"], "jager bomb":["2","35"], "vegas bomb":["2","28"], "mimosa":["6","14"], "malibu bay breeze":["1.5","21"]
	};

	var drink = {};

	drink.type = "cocktail";
	drink.name = $('#cocktailname').val();
	drink.size = $('#cocktailshots').val();

	
	if (drink.name in COCKTAILS) {
		var fields = (COCKTAILS[drink.name]).toString().split(',');
		drink.percent = fields[1];
		console.log(drink.percent);
	}
	else {
		console.log("404 cocktail not found" + drink.name);
	}
	
	return drink;
	
}

function shotLoad(){
	var SHOTS =
	{
		"kamikaze":["2","37.5"], "lemon drop":["1.5","40"], "redheaded slut":["2","29"], "vodka":["1.5","40"], "rum":["1.5","40"], "gin":["1.5","47.3"],
		"whiskey":["1.5","45"], "tequila":["1.5","40"], "fireball":["1.5","33"], "dirty girl scout":["4","22.8"], "washington apple":[".75","30"],
		"alabama slammer":["1.5","33.3"], "blow job":[".75","24.3"], "fourth of july":["1","27.5"]
	};

	var drink = {};

	drink.type = "shot";
	drink.name = $('#shotname').val();
	drink.size = $('#shots').val();

	if ($('#shotabv').val() != "") {
		drink.percent = $('#shotabv').val();
		console.log("using the given abv");
	}
	else {
		if (drink.name in SHOTS) {
			var fields = (SHOTS[drink.name]).toString().split(',');
			drink.percent = fields[1];
			console.log(drink.percent);
		}
		else {
			console.log("404 shot not found");
		}
	}
	return drink;
	
}


function sendYo(username){

	$.post("https://api.justyo.co/yo/",{"api_token":"d43534d3-c41e-b018-97c6-9d1f4c106ddf", "username":"RYANRAPINI" })
	//curl --data ""  https:%2F/api.justyo.co/yo/);
}



function solveBAC(ounces, percent, weight, hours) {
	var result = (ounces * percent * 0.075 / weight) - (hours * 0.015);
	result = Math.round(result * 1000) / 1000;
	return result
}



/**
* Return a timestamp with the format "m/d/yy h:MM:ss TT"
* @type {Date}
*/
 
function timeStamp() {
// Create a date object with the current time
var now = new Date();
 
// Create an array with the current month, day and time
var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
 
// Create an array with the current hour, minute and second
var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
 
// Determine AM or PM suffix based on the hour
var suffix = ( time[0] < 12 ) ? "AM" : "PM";
 
// Convert hour from military time
time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
 
// If hour is 0, set it to 12
time[0] = time[0] || 12;
 
// If seconds and minutes are less than 10, add a zero
for ( var i = 1; i < 3; i++ ) {
if ( time[i] < 10 ) {
time[i] = "0" + time[i];
}
}
 
// Return the formatted string
return date.join("/") + " " + time.join(":") + " " + suffix;
}