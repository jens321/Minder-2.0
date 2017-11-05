var map;
var geocoder; 
function initialize() {
  geocoder = new google.maps.Geocoder();
  var mapOptions = {
    zoom: 12,
    center: {lat: 37.7, lng: 122.4}
  };
  map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
  codeAddress(); 
}

function codeAddress() {
  var address = $('#location').val() || "San Francisco, CA"; 
  console.log(address); 
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
