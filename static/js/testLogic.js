  
// Show that we've loaded the JavaScript file
console.log("Loaded testLogic.js");

// Initializes the page with a default plot
function init() {
    data = [{
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16] }];
  
    Plotly.newPlot("plot2", data);
}
  
// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#leafletButton").on("change", updatePlotly);

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
    Plotly.restyle("plot2", "x", [x]);
    Plotly.restyle("plot2", "y", [y]);
}

init();
  