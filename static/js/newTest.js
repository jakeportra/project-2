// Creating map object
var thunderforestToken = "0410bfa706aa490f8370e4bbb0b1d202"
var map = L.map('map').setView([0, 0], 2.5);

var Thunderforest_Outdoors = L.tileLayer('https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: thunderforestToken,
	maxZoom: 22
}).addTo(map);

// function to get country data from click


// Query the endpoint that returns a JSON ...
d3.json("/geojson").then(function (data) {

    L.geoJson(data).addTo(map)

    function getColor(t) {
        return t > 12 ? '#053061' :
               t > 8  ? '#2166ac' :
               t > 5  ? '#4393c3' :
               t > 3  ? '#92c5de' :
               t > 1  ? '#d1e5f0' :
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
        this._div.innerHTML = '<h4>Total Litres of Alcohol Consumed per capita</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.total_litres_of_pure_alcohol + ' Total Litres of Alcohol'
            : 'Hover over a country');

    };

    info.addTo(map);
});

d3.json("/data").then(function (data) {

    // ... and dump that JSON to the console for inspection
    console.log(data); 

    // Next, pull out the keys and the values for graphing

    var country = data.map(data => data.country);
    console.log(country);
    var beerServings = data.map(data => data.beer_servings);
    var wineServings = data.map(data => data.wine_servings);
    var spiritServings = data.map(data => data.spirit_servings);
    var total_liters = data.map(data => data.total_litres_of_pure_alcohol);
    
    // Initializes the page with a default plot
    function init() {
        data = [{
        x: country,
        y: total_liters,
        type: "bar"
    }];
    
        Plotly.newPlot("plot", data);
    }
    
    // Call updatePlotly() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updatePlotly);

    // This function is called when a dropdown menu item is selected
    function updatePlotly() {
        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        var dataset = dropdownMenu.property("value");

        // Initialize x and y arrays
        var x = [];
        var y = [];

        function chooseDataset(dataset) {
            switch(dataset) {
                case "dataset1":
                    x = [1, 2, 3, 4, 5];
                    y = [1, 2, 4, 8, 16];
                    break;
                case "dataset2":
                    x = [10, 20, 30, 40, 50];
                    y = [1, 10, 100, 1000, 10000];
            }
        }

        chooseDataset(dataset);

        // Note the extra brackets around 'x' and 'y'
        Plotly.restyle("plot", "x", [x]);
        Plotly.restyle("plot", "y", [y]);
    }
    init();
});