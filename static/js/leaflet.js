// Creating map object
var thunderforestToken = "0410bfa706aa490f8370e4bbb0b1d202"
var map = L.map('map').setView([0, 0], 2.5);

var Thunderforest_Outdoors = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: thunderforestToken,
	maxZoom: 22
}).addTo(map);

// Query the endpoint that returns a JSON ...
d3.json("/geojson").then(function (data) {

    L.geoJson(data).addTo(map)

    function getColor(t) {
        return t > 14 ? '#014636' :
               t > 12 ? '#016c59' :
               t > 10 ? '#02818a' :
               t > 8  ? '#3690c0' :
               t > 6  ? '#67a9cf' :
               t > 4  ? '#a6bddb' :
               t > 2  ? '#d0d1e6' :
               t > 1  ? '#ece2f0' :
                        '#f7f7f7' ;
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.total_litres_of_pure_alcohol),
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7
        };
    }

    L.geoJson(data, {style: style}).addTo(map);

    var geojson; 

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
        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
        
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
    
    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Total Pure Alcohol Consumed Per Capita</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.total_litres_of_pure_alcohol + ' Liters of Alcohol'
            : 'Hover over a country.');

    };

    info.addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 4, 6, 8, 10, 12, 14],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
});

