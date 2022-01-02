var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    // id: "mapbox/streets-v11",mapbox://styles/mapbox/light-v10
    accessToken: API_KEY
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

            }).bindPopup("<h4>Location: " + earthquake.properties.place + "</h4> <hr> <h5>Magnitude: " + earthquake.properties.mag + "  Depth: " + earthquake.geometry.coordinates[2]+ " km</h5>").addTo(myMap);
        }
      }

    // Create a legend

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

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

