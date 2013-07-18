/**
 * Light Javascript "class" frameworking for you
 * to organize your code a little bit better.
 */

var Frontpage = function() {

	var exports = {

		map: null,
		mapOverlays: [],

		clearMapOverlays: function(circle) {

			var i = 0;
			var length = frontpage.mapOverlays.length;

			if(circle)
			{
				for (i = 0; i < length; i++ ) {
					frontpage.mapOverlays[i].setMap(null);
    			}

    			frontpage.mapOverlays = [];
			}

			else
			{

				for (i = 0; i < length; i++ ) {
					if(typeof frontpage.mapOverlays[i].getRadius != 'function') {
    					frontpage.mapOverlays[i].setMap(null);
    				}
    			}

    			frontpage.mapOverlays = [frontpage.mapOverlays[0]];
			}
		},

		marker: {

			plot: function(locations) {

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

      				// create info window
      				var infowindow = new google.maps.InfoWindow();

      				// add to array
	      			frontpage.mapOverlays.push(marker);
	      		}
			},

			draggable : function(dragend, dragstart) {

				dragend = dragend || function(){};
				dragstart = dragstart || function(){};

				marker = new google.maps.Marker({
					map:frontpage.map,
					draggable:true,
					animation: google.maps.Animation.DROP,
					position: frontpage.map.getCenter()
				});
  				google.maps.event.addListener(marker, 'click', toggleBounce);

				frontend.map.addOverlay(marker);
				frontpage.mapOverlays.push(marker);
			},

			draggableCircle: function(radius, center_changed, radius_changed) {

				radius = radius || 15000;
				center_changed = center_changed || function(){};
				radius_changed = radius_changed || function(){};

				var circleOptions = {
					strokeColor: '#FF0000',
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: '#FF0000',
					fillOpacity: 0.35,
					map: frontpage.map,
					center: frontpage.map.getCenter(),
					radius: radius,
					draggable: true,
					editable: true,

					center_changed: center_changed,
					radius_changed: radius_changed
				};

				var circle = new google.maps.Circle(circleOptions);
				frontpage.mapOverlays.push(circle);
			}
		},

		users: {

			plot: function(origin, distance) {

				$.getJSON("/index.php/user", function(data) {

					var users = [];

					for(var i = 0; i < data.length; i++)
						users.push([
							data[i].userName + " (" + data[i].city + ")", 
							parseFloat(data[i].latitude), 
							parseFloat(data[i].longitude),
							i + 1
						]);

					frontpage.marker.plot(users);
				});

			},

			filter: function(center, radius) {

				$.getJSON("/index.php/user/getNearLocation", {

					lat: center.lat(), 
					lng: center.lng(), 
					radius: radius

				}, function(data) {

					var users = [];

					for(var i = 0; i < data.length; i++) {

						if(data[i].distance > radius) continue;

						users.push([
							data[i].userName + " (" + data[i].city + ")", 
							parseFloat(data[i].latitude), 
							parseFloat(data[i].longitude),
							i + 1
						]);
					}

					frontpage.marker.plot(users);
				});
			}
		},
	};

	exports.pages = {

		map: function() {

			console.log("Ploting all users...");
			frontpage.users.plot();
		},

		search: function() {

			console.log("Ploting search circle...");
			frontpage.marker.draggableCircle(15000, 

				// center changed
				function(){

					$("#filter-latitude").html(frontpage.mapOverlays[0].getCenter().lat());
					$("#filter-longitude").html(frontpage.mapOverlays[0].getCenter().lng());
					$("#filter-radius").html(frontpage.mapOverlays[0].getRadius());
				},

				// radius changed
				function(){

					$("#filter-latitude").html(frontpage.mapOverlays[0].getCenter().lat());
					$("#filter-longitude").html(frontpage.mapOverlays[0].getCenter().lng());
					$("#filter-radius").html(frontpage.mapOverlays[0].getRadius());
				}
			);

			// show circle options
			$("#filter-latitude").html(frontpage.mapOverlays[0].getCenter().lat());
			$("#filter-longitude").html(frontpage.mapOverlays[0].getCenter().lng());
			$("#filter-radius").html(frontpage.mapOverlays[0].getRadius());

			// bind search click
			$("#filter-apply").on("click", function()
			{
				frontpage.clearMapOverlays();

				frontpage.users.filter(
					frontpage.mapOverlays[0].getCenter(), 
					frontpage.mapOverlays[0].getRadius()
				);
			});

			// show filter div
			$("#search-filter").show();
		},

		go: function(url) {

			// clear map
			frontpage.clearMapOverlays(true);

			$("#search-filter").hide();

			$("li[class='active']").removeClass("active");

			if(url == "#" || url == "")
				$("#map-li").addClass("active");

			else
				$(url+"-li").addClass("active");

			// get page methods
			switch(url) {

				case "#search":
					frontpage.pages.search();
					break;

				default:
					frontpage.pages.map();
					break;
			}
		}
	}

	function init()	{		

		console.log("Initializing map...");
		exports.map = new google.maps.Map(document.getElementById("map-canvas"), {
			zoom: 9,
			center: new google.maps.LatLng(-22.9000, -47.0833),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		console.log("Preparing pages callbacks...");

		$(window).on('hashchange', function() {
  			frontpage.pages.go(window.location.hash);
		});
	}
	exports.init = init;

	return exports;
}

var frontpage = new Frontpage();

$(document).ready(function() {

	frontpage.init();

	// open initial state
	frontpage.pages.go(window.location.hash);
});