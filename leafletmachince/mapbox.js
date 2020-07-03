//Map----------------------------------------------------------------------------------------------------------------------------
var map = L.map('map').setView([15, 100], 7);
var gl = L.mapboxGL({
  accessToken: 'pk.eyJ1IjoicGh1c2l0ciIsImEiOiJjazY3YzFxaXMwMTNjM21vdWlkbGJ6a2h5In0.JdD-PSvcCikzesyDNAlGlA',
  style: 'https://api.maptiler.com/maps/streets/style.json?key=auAhYrwneLv7vVJ6XYIZ'
}).addTo(map);

//ScalOnMap----------------------------------------------------------------------------------------------------------------------
L.control.scale().addTo(map);

//draw Control---------------------------------------------------------------------------------------------------------------------------
var markIcon = L.AwesomeMarkers.icon({
  prefix: 'fa', //font awesome rather than bootstrap
  markerColor: 'darkred',// see colors above
  icon: 'male' //http://fortawesome.github.io/Font-Awesome/icons/
});

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  position: 'topleft',
  draw: {
    marker: {
      icon: markIcon
    },
    circlemarker: false,
    polyline: {
      shapeOptions: {
        color: 'red'
      },
    },
    circle: false,
    polygon: false,
    rectangle: false,
  },
  edit: {
    featureGroup: drawnItems
  }
});
map.addControl(drawControl);

map.on('draw:created', function (e) {
  var type = e.layerType,
      layer = e.layer;
  if (type === 'marker') {
      var coord_marker = e.layer.editing._marker._latlng.toString().split(', ');
      var lat = coord_marker[0].split('(');
      var lng = coord_marker[1].split(')');
    console.log(lat[1])
    console.log(lng[0])
    var customPopup ='<div style="width:200px">'+ 
                    '<form id="Geo" method="GET">'+
                      '<input type="text" name="nameplace" class="easyui-textbox" style="margin-bottom:10px;width:100%" placeholder="ชื่อสถานที่" >'+
                      '<input type="text" name="name_station" class="easyui-textbox" style="margin-bottom:10px;width:100%" placeholder="ชื่อป้ายสถานี" >'+
                      '<input type="text" name="lat" value="'+lat[1]+'" class="easyui-textbox" style="margin-bottom:10px;width:100%" disabled>'+
                      '<input type="text" name="lng" value="'+lng[0]+'"  class="easyui-textbox" style="margin-bottom:10px;width:100%" disabled>'+
                      '<div> <button type="submit" style="background-color:#b0e0a8;border: none;color: white;margin: 4px 2px;">Submit</button>'+
                            '<button type="submit" style="background-color:#ef6c57;border: none;color: white;margin: 4px 2px;" >Cancel</button>'+
                      '</div>'+
                      '<br>'+
                    '</form>'+
                  '</div>'
    layer.bindPopup(customPopup);
    
  }
 
  drawnItems.addLayer(layer);

  var coordline = e.layer.editing.latlngs[0];
  var polylineDraw = [];
  for (var i = 0; i < coordline.length; i++) {
    polylineDraw.push([coordline[i].lat, coordline[i].lng]);
  }
  var code = polyline.encode(polylineDraw)
  encodebustxt(code)
});

function encodebustxt(data) {
  encode = data;
  document.getElementById('encoded_polyline').value = encode;
  console.log(encode); //show Encode Polyline
}
//-----------------------------------------------------------------------------------------------------------------------------


//Routing------------------------------------------------------------------------------------------------------------------------
var LatStart = null
var LngStart = null
var LatEnd = null
var LngEnd = null
var control = L.Routing.control({
  waypoints: [
    L.latLng(LatStart, LngStart),
    L.latLng(LatEnd, LngEnd)
  ],
  geocoder: L.Control.Geocoder.nominatim(),
  routeWhileDragging: true,
  reverseWaypoints: true,
  showAlternatives: false,
  lineOptions: {
    styles: [{ color: '#f61962', opacity: 1, weight: 3 }],
  },
  altLineOptions: {
    styles: [
      { color: 'black', opacity: 0.15, weight: 9 },
      { color: 'white', opacity: 0.8, weight: 6 },
      { color: 'blue', opacity: 0.5, weight: 9 }
    ]
  },
  router: L.Routing.mapbox('pk.eyJ1IjoicGh1c2l0ciIsImEiOiJjazY3YzFxaXMwMTNjM21vdWlkbGJ6a2h5In0.JdD-PSvcCikzesyDNAlGlA')
}).addTo(map);

control.hide();
map.on('click', function () {
  control.show();
});

//Mark point on map---------------------------------------------------------------------------------------------------------------
function getInstrGeoJson(instr, coord) {
  var formatter = new L.Routing.Formatter();
  var instrPts = {
    type: "FeatureCollection",
    features: []
  };
  for (var i = 0; i < instr.length; ++i) {
    var g = {
      "type": "Point",
      "coordinates": [coord[instr[i].index].lng, coord[instr[i].index].lat]
    };
    var p = {
      "instruction": formatter.formatInstruction(instr[i])
    };
    instrPts.features.push({
      "geometry": g,
      "type": "Feature",
      "properties": p
    });
  }
  return instrPts
}
L.Routing.errorControl(control).addTo(map);

//Function Routing Control-------------------------------------------------------------------------------------------------------
control.on('routeselected', function (e) {
  var coord = e.route.coordinates;
  //var distance = e.route.summary.totalDistance;
  //var start = e.route.waypoints;
  //console.log(start);
  //console.log(distance);
  //console.log(coord); //Show Coordinates
  var c = [];
  for (var i = 0; i < coord.length; i++) {
    c.push([coord[i].lat, coord[i].lng]);
  }
  encodetxt(polyline.encode(c))
  //encodetxt(coord)
});

//--------------------------------------------------------------------------------------------------------------------------------
function encodetxt(data) {
  encode_result = data;
  // var latlngs = data//Lat Lng Array
  // var polyline = L.polyline(latlngs)
  // map.fitBounds(polyline.getBounds());
  // console.log(polyline.encodePath()); //Show Encoded to consol.log Next Step Save to database
  document.getElementById('encoded_polyline').value = encode_result;
  console.log(encode_result); //show Encode Polyline
}

