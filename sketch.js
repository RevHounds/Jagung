var map;
var minZoomLevel = 5;
var mapContainer = document.getElementById("map");

      function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }

      function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      }
     function initMap() {
       map = new google.maps.Map(document.getElementById('map'), {
         zoom: minZoomLevel,
         center: {lat: -4.091370, lng: 118.087234},
         zoomControl: false,
         mapTypeControl: false,
         streetViewControl: false,

         styles: [
            {
              featureType: "all",
              elementType: "labels",
              stylers: [
                { visibility: "off" }
              ]
            }
          ]
       });

       var opt = {minZoom : 5, maxZoom : 5};
       map.setOptions(opt);

       var strictBounds = new google.maps.LatLngBounds(
         new google.maps.LatLng(95.010825,-11.009721),
         new google.maps.LatLng(141.01176,6.0771)
       );

       // Load GeoJSON.
        //  var geojson = JSON.parse("province_level.json");
       map.data.loadGeoJson("province_level.json");

       map.data.setStyle(function(feature) {
         var red = (Math.floor(Math.random()*255+1));
         var green = (Math.floor(Math.random()*255+1));
         var blue = (Math.floor(Math.random()*255+1));
         var color = rgbToHex(red, green, blue);
         return ({
           fillColor: color,
           strokeColor: color,
           strokeWeight: 2
         });
       });

       // When the user hovers, tempt them to click by outlining the letters.
       // Call revertStyle() to remove all overrides. This will use the style rules
       // defined in the function passed to setStyle()
       map.data.addListener('mouseover', function(event) {
         document.getElementById('info-box').textContent = event.feature.getProperty('NAME_1');
       });

       map.data.addListener('mouseout', function(event) {
         map.data.revertStyle();
       });

       map.data.addListener('click', function(event) {
         provinceName = event.feature.getProperty('NAME_1');
         localStorage.setItem("province", provinceName);
         window.location.href = 'province-level-detail.html';
       });
     }
