$(document).ready(function() {
	if("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			// if geolocation succeeds
			getPlace(position.coords.latitude, position.coords.longitude);
			getWeather(position.coords.latitude, position.coords.longitude);
			getTime();
			
		}, function() {
			// if geolocation fails
			$("#loading").text("Sorry can't get location data");
		});
	} else {
		$("body").text("Sorry your browser does not support this app.");
	}
});

function getPlace(lat, long) {
	var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyCSZQPOa2OYQN575Nvrk_j2OsapFgKGc8A";
	
	$.getJSON(url, function (data) {
		var place = data.results[2].formatted_address;

		// display place
		$("#place").text(place);
	});
}

function getWeather(lat, long) {
	var url = "https://api.darksky.net/forecast/3281a4257e555f65182487558ec82654/" + lat + "," + long;
	
	$.getJSON(url, function (data) {

		var weather = {
			temperature: {},
			icon: data.currently.icon, 
			summary: data.currently.summary,
			dayForecast: data.hourly.summary,
			weekForecast: data.daily.summary
		};

		weather.temperature.farenheit = Math.round(data.currently.temperature, 1);
		weather.temperature.celsius = Math.round(((data.currently.temperature - 32) / 1.8), 1);

		switchTemp(weather.temperature.farenheit, weather.temperature.celsius);

		// variable to toggle between farenheit and celsius
		var isFarenheit = true;
	
		// different icon depending on weather
		var iconLookup = {
			"clear-day": '<i class="wi wi-day-sunny"></i>',
			"clear-night": '<i class="wi wi-night-clear"></i>',
			"rain": '<i class="wi wi-rain"></i>',
			"snow": '<i class="wi wi-snow"></i>',
			"sleet": '<i class="wi wi-sleet"></i>',
			"wind": '<i class="wi wi-windy"></i>',
			"fog": '<i class="wi wi-fog"></i>',
			"cloudy": '<i class="wi wi-cloudy"></i>',
			"partly-cloudy-day": '<i class="wi wi-day-cloudy"></i>',
			"partly-cloudy-night": '<i class="wi wi-night-alt-cloudy"></i>'
		};

		// see current temperature
		$("#temperature").text(weather.temperature.celsius);

		$("#summary").text(weather.summary);

		// see current weather
		$("#icon").html(iconLookup[weather.icon]);
		
		// forecast summary for day
		$("#day").html('<p>'+ weather.dayForecast + '</p>' + '<p>'+ weather.weekForecast + '</p>');

	}).done(function() {
		$("#loading").fadeOut("slow", function() {
			$(this).remove();
			$("#container").fadeIn("slow");
		});
	});
}

function getTime() {
	var date = new Date(),
		hours = date.getHours(),
		minutes = date.getMinutes(),
		ampm = hours >= 12 ? 'PM' : 'AM';

  	hours = hours % 12;
  	hours = hours ? hours : 12; // the hour '0' should be '12'
  	minutes = minutes < 10 ? '0' + minutes : minutes;
  	strTime = hours + ':' + minutes + ' ' + ampm;

  	$("#time").text(strTime);
}

function switchTemp(tempF, tempC) {
	$("#farenheit").click(function() {
		$("#farenheit").toggleClass("selected");
		$("#celsius").toggleClass("selected");
		$("#temperature").text(tempF);
	});

	$("#celsius").click(function() {
		$("#farenheit").toggleClass("selected");
		$("#celsius").toggleClass("selected");
		$("#temperature").text(tempC);
	});

}