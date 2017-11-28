var map;
var geocoder; 
var markers = []; 

function initialize() {
  geocoder = new google.maps.Geocoder();
  var mapOptions = {
    zoom: 12,
    center: {lat: 37.7, lng: 122.4}
  };
  map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
  codeAddress(function() {
    // do nothing
  }); 
}

function codeAddress(cb) {
  var address = $('#location').val() || "San Francisco, CA"; 
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      locationName = results[0].formatted_address;
      coords = results[0].geometry.location;  
      setMapOnAll(null); 
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      }); 
      markers.push(marker); 
      cb();  
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
      cb(); 
    }
  });
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

