mapboxAccessToken = "pk.eyJ1IjoiamFrZXBvcnRyYSIsImEiOiJjazhnajdhNnUwMGN3M21waWhsNHZlMGtoIn0.8cBv2T4YFUYzyZX-Au_2nA";

// Creating map object
var map = L.map('map').setView([37.8, -96], 4);

// Adding tile layer
L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${mapboxAccessToken}`, {
    id: "mapbox/light-v9",  
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

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