// Animation
$(".container-content").delay(2750).fadeIn();

// Counter
const countdown = () => {
  const countDate = new Date("Jun 24, 2023 12:00:00").getTime();

  const currentTime = new Date().getTime();
  const gap = countDate - currentTime;

  const millisecond = 1;
  const second = millisecond * 1000;
  const minutes = second * 60;
  const hour = minutes * 60;
  const day = hour * 24;

  const textDay = Math.floor(gap / day);
  const textHour = Math.floor((gap % day) / hour);
  const textMinutes = Math.floor((gap % hour) / minutes);
  const textSecond = Math.floor((gap % minutes) / second);
  const textMillisecond = Math.floor((gap % second) / millisecond);

  document.querySelector('.day').innerText = textDay;
  document.querySelector('.hour').innerText = textHour;
  document.querySelector('.minutes').innerText = textMinutes;
  document.querySelector('.seconds').innerText = textSecond;
};

setInterval(countdown, 500);


// Google Maps
$(function() {
  let GMAP_LOCATION_CHURCH = {lat: 40.0786061, lng: -2.13710315};
  let GMAP_LOCATION_CELEBRATION = {lat: 40.1355637, lng: -2.142616315};

  var directionsService = new google.maps.DirectionsService();

  function middlePoint(lat_a, lng_a, lat_b, lng_b) {
    // Longitude difference
    var dLng = (lng_b - lng_a).toRad();

    // Convert to radians
    lat_a = lat_a.toRad();
    lat_b = lat_b.toRad();
    lng_a = lng_a.toRad();

    var bX = Math.cos(lat_b) * Math.cos(dLng);
    var bY = Math.cos(lat_b) * Math.sin(dLng);
    var lat3 = Math.atan2(Math.sin(lat_a) + Math.sin(lat_b), Math.sqrt((Math.cos(lat_a) + bX) * (Math.cos(lat_a) + bX) + bY * bY));
    var lng3 = lng_a + Math.atan2(bY, Math.cos(lat_a) + bX);

    //-- Return result
    return [lng3.toDeg(), lat3.toDeg()];
  }

  function mapSettings(coordinates, zoom=17) {
    return {
      zoom: zoom,
      center: coordinates,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      scrollwheel: false,
      draggable: true,
      streetViewControl: true,
      streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
      },
      panControl: true,
      panControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
      },
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: ["satellite", "terrain"],
      },
      navigationControl: false,
      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},            
    };
  }

  function mapMarker(map, coordinates) {
    new google.maps.Marker({
      map,
      draggable: false,
      animation: google.maps.Animation.BOUNCE,
      position: coordinates
    });
  }

  function generateRoute(map) {
    var start = new google.maps.LatLng(GMAP_LOCATION_CHURCH.lat, GMAP_LOCATION_CHURCH.lng);
    var end = new google.maps.LatLng(GMAP_LOCATION_CELEBRATION.lat, GMAP_LOCATION_CELEBRATION.lng);

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          for (var i = 0, len = response.routes.length; i < len; i++) {
              let _direction = new google.maps.DirectionsRenderer({
                  map: map,
                  directions: response,
                  routeIndex: i
              })
              
              let info_window = new google.maps.InfoWindow();

              if (i != 0) {
                _direction.setOptions({
                  polylineOptions: {
                    strokeColor: 'gray'
                  }
                });
                info_window.setZIndex(0);
              }
              else {
                info_window.setZIndex(1);
              }

              let center = response.routes[i].overview_path[Math.floor(response.routes[i].overview_path.length / 2)];
              info_window.setPosition(center);
              info_window.setContent(`<strong>Trayecto: </strong>${response.routes[i].legs[0].duration.text}<br><strong>Distancia: </strong>${response.routes[i].legs[0].distance.text}`);
              info_window.open(map);
          }
        }
    });
}
  
  // Location Church
  let _coordinates_church = new google.maps.LatLng(GMAP_LOCATION_CHURCH.lat, GMAP_LOCATION_CHURCH.lng);
  let _settings_church = mapSettings(_coordinates_church);
  
  let map_church = new google.maps.Map(document.getElementById("gmap-location-church"), _settings_church);
  mapMarker(map_church, _coordinates_church);

  // Location Celebration
  let _coordinates_celebration = new google.maps.LatLng(GMAP_LOCATION_CELEBRATION.lat, GMAP_LOCATION_CELEBRATION.lng);
  let _settings_celebration = mapSettings(_coordinates_celebration, 11);
  
  let map_celebration = new google.maps.Map(document.getElementById("gmap-location-celebration"), _settings_celebration);
  mapMarker(map_celebration, _coordinates_celebration);


  // Location Route
  let _coordinates_route = new google.maps.LatLng(middlePoint(GMAP_LOCATION_CHURCH.lat, GMAP_LOCATION_CHURCH.lng, GMAP_LOCATION_CELEBRATION.lat, GMAP_LOCATION_CELEBRATION.lng));
  let _settings_route = mapSettings(_coordinates_celebration);
  let map_route = new google.maps.Map(document.getElementById("gmap-location-route"), _settings_route);
  let directions_display = new google.maps.DirectionsRenderer();
  
  directions_display.setMap(map_route);
  generateRoute(map_route);
});

// Helper functions
if (typeof (Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function () {
      return this * Math.PI / 180;
  }
}

if (typeof (Number.prototype.toDeg) === "undefined") {
  Number.prototype.toDeg = function () {
      return this * (180 / Math.PI);
  }
}