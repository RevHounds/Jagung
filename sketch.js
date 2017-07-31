var map;
var minZoomLevel = 5;
var mapContainer = document.getElementById("map");

      function convertToX(lon){
        lon = radians(lon);
        var a = (256 / PI) * pow(2, 1);
        var b = lon + PI;
        return a * b;
      }

      function convertToY(lat){
        lat = radians(lat);
        var a = (256 / PI) * pow(2, 1);
        var b = tan(PI / 4 + lat / 2);
        var c = PI - log(b);
        return a * c;
      }

      function drawProvinceMap(coordinates){
        document.createElement('canvas');
        var minX = 9999999, maksY = 0;
        for(var i=0; i<coordinates.length; i++){
          for(var j=0; j<coordinates[i].length; j++){
            for(var k=0; k<coordinates[i][j].length; k++){
              var x = (coordinates[i][j][k][0]);
              if(x < minX) minX = x;
              var y = (coordinates[i][j][k][1]);
              if(y > maksY) maksY = y;
            }
          }
        }
          for(var i=0; i<coordinates.length; i++){
            beginPath();
            for(var j=0; j<coordinates[i].length; j++){
              for(var k=0; k<coordinates[i][j].length; k++){
                var x = (coordinates[i][j][k][0]);
                var y = (coordinates[i][j][k][1]);
                x = convertToX(x) - convertToX(minX);
                y = convertToY(y) - convertToY(maksY);
                x = x*10+10;
                y = y*10+100;
                vertex(x, y);
              }
            }
            endPath();
          }
        }

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
         province_coordinate = event.feature;
         var mapContainer = document.getElementById("map");
         mapContainer.parentNode.removeChild(mapContainer);
         map = document.createElement("provinceLevel");
         var provinceCoordinate = []
         provinceCoordinate = event.feature.getProperty('NAME_1');
         drawProvinceMap(provinceCoordinate);
       });
     }
