/**
 * Light Javascript "class" frameworking for you
 * to organize your code a little bit better.
 */

var Frontpage = function() {

	var exports = {

		map: null,

		marker: {

			plot: function(locations) {

				// ensure is an array
				if(typeof locations != typeof [])
					locations = [locations];

				var i, marker;

				// loop
	    		for (i = 0; i < locations.length; i++) {  

	      			marker = new google.maps.Marker({
	        			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
	        			map: exports.map
	      			});

	      			google.maps.event.addListener(marker, 'click', (function(marker, i) {
        				return function() {
          					infowindow.setContent(locations[i][0]);
          					infowindow.open(frontpage.map, marker);
        				}
      				})(marker, i));
	      		}

	      		// manage infowindows
	      		var infowindow = new google.maps.InfoWindow();
			}
		}
	};

	function init()	{		

		console.log("Initializing map...");
		exports.map = new google.maps.Map(document.getElementById("map-canvas"), {
			zoom: 6,
			center: new google.maps.LatLng(-22.9000, -47.0833),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
	}
	exports.init = init;

	return exports;
}

var frontpage = new Frontpage();

$(document).ready(function() {
	frontpage.init();
});