
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

		/*Store all our data into localStorage*/
		stashData(data);

		heightobj = heightToFeet(data.height);

		/*Update all the placeholders on the page*/
		populateContainers(data);

		/*Then change to the main page*/
		$.mobile.changePage('#home', { transition: 'slide' });
	});

	/*Settings menu control*/
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
  	return true;
  }


  function retrieveData() {
  	var data = {};
  	data.age = localStorage.getItem('age');
  	data.gender = localStorage.getItem('gender');
  	data.height = localStorage.getItem('height');
  	data.name = localStorage.getItem('name');
  	data.weight = localStorage.getItem('weight');
  	return data;
  }



/*
   Alcohol Calculation Functions
  ===============================
  */


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


  var COCKTAILS = 
  {
  	"margarita":["2.5", "40"], "cosmopolitan":["2","37.5"], "martini":["2.25", "37.4"], "vodka + non-alcoholic mixer":["2", "40"], "rum + non-alcoholic mixer":["2","40"],
  	"gin + non-alcoholic mixer":["2","47.3"], "whiskey + non-alcoholic mixer":["2","42.5"], "tequila sunrise":["1.5","38"], "white russian":["3","33.4"],
  	"moscow mule":["2","40"], "long island iced tea":["2.5","39.1"], "daquiri or pina colada":["3","40"], "mojito":["2","40"], "bloody mary":["2","40"],
  	"sea/bay breeze":["2","40"], "irish car bomb":["13","6.75"], "jager bomb":["2","35"], "vegas bomb":["2","28"], "mimosa":["6","14"], "malibu bay breeze":["1.5","21"]
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