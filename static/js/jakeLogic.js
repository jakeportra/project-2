// Creating map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 8
});

mapboxAccessToken = "pk.eyJ1IjoiamFrZXBvcnRyYSIsImEiOiJjazhnajdhNnUwMGN3M21waWhsNHZlMGtoIn0.8cBv2T4YFUYzyZX-Au_2nA";
// Adding tile layer
L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${mapboxAccessToken}`, {
  id: "mapbox/light-v9",  
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  tileSize: 512,
  zoomOffset: -1
}).addTo(myMap);

L.geoJson(countries.geo.json).addTo(myMap);

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}




// Grab data with d3
d3.json("/data").then(function (data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "MHI2016",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
        "$" + feature.properties.MHI2016);
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});



