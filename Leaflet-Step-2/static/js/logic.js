
// Create the tile layer that will be the background of our map: satellite map
var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
});

// Create the tile layer that will be the background of our map: out door map
var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
});

// Create the tile layer that will be the background of our map: light map
var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});


// ****************   Generate tectonic plate layer and earthquakes layer

// Initialize the tectonic plate layer and earthquakes layer
var layers = {
    tectonicplates: new L.LayerGroup(),
    earthquakemap: new L.LayerGroup()
};

// Create a baseMaps object to hold the lightmap layer
var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": grayscalemap,
    "Outdoors": outdoormap
};

// Create an overlayMaps object to hold the bikeStations layer
var overlayMaps = {
    "Tectonic Plates": layers.tectonicplates,
    "Earthquakes": layers.earthquakemap
};

// Create the map object with options
var myMap = L.map("map", {
    center: [37.09, -65.71],
    zoom: 4,
    layers: [satellitemap, layers.tectonicplates, layers.earthquakemap]
});

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);



// function that returns a color based on earthquakes  depth
function getColor(d) {
    return d > 90 ? '#d73027' :
           d > 70  ? '#fc8d59' :
           d > 50   ? '#fee08b' :
           d > 30   ? '#d9ef8b' :
           d > 10   ? '#91cf60' :
                      '#1a9850'
};


//   get data from  USGS GeoJSON Feed page: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(response) {

    // console.log(response.features);

    // add each earthquake to the map with different size and color 
    for (var i = 0; i < response.features.length; i++) {

        var earthquake = response.features[i];
    
        if (earthquake) {
            L.circleMarker(([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]]), {
                fillOpacity: 0.8,
                color: "black",
                weight: 1,

                // fill color is reflected by the depth of the earthquake
                fillColor: getColor(earthquake.geometry.coordinates[2]),

                // radius is reflected by the magnitude of the earthquake
                radius: earthquake.properties.mag*5

            }).addTo(layers.earthquakemap);
        }
      }

    // Create a legend

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
   
});


// Tectonicplate layer
// Our style object
var mapStyle = {
    color: "yellow",
    fill: false,
    weight: 1.5
  };

d3.json("static/data/PB2002_plates.json").then(function(response) {

    L.geoJson(response, {
        // Passing in our style object
        style: mapStyle
      }).addTo(layers.tectonicplates);   
});
