  
// Show that we've loaded the JavaScript file
console.log("Loaded enriqueLogic.js");

// Query the endpoint that returns a JSON ...
d3.json("/data").then(function (data) {

    // ... and dump that JSON to the console for inspection
    console.log(data); 

    // Next, pull out the keys and the values for graphing

    var country = data.map(data => data.country);
    var beerServings = data.map(data => data.beer_servings);
    var wineServings = data.map(data => data.wine_servings);
    var spiritServings = data.map(data => data.spirit_servings);
    var total_liters = data.map(data => data.total_litres_of_alcohol);

    var trace1 = {
        x: country,
        y: beerServings,
        name: "Beer",
        type: "bar"
    };

    var trace2 = {
        x: country,
        y: wineServings,
        name: "Wine",
        type: "bar"
    };

    var trace3 = {
        x: country,
        y: spiritServings,
        name: "Spirit",
        type: "bar"
    };

    var data = [trace1, trace2, trace3];

    var layout= {barmode: 'group'};

    Plotly.newPlot("plot", data, layout);
});

d3.selectAll("#selDataset").on("change", updatePlotly);