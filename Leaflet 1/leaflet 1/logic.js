// Create the map object 
//https://stackoverflow.com/questions/60428521/change-color-of-leaflet-map
//https://gis.stackexchange.com/questions/75590/setstyle-function-for-geojson-features-leaflet
//Ref: class lessons 17: 1/1, 1/10, 2/2, 2/4


var map = L.map("map", {
    center: [29.90, -175],
    zoom: 1
  });
  //north pacific ocean centered between recent quakes

  
// Send the api request , get data
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken:API_KEY
}).addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

        console.log(data);
        plotquakeData(data);

            
});

//Ref: https://leafletjs.com/reference-1.3.4.html#geojson, 
//automating with functions:https://sandbox.idre.ucla.edu/dh150/tutorials/1-6-add-a-marker-function-with-leaflet
//https://gis.stackexchange.com/questions/229723/displaying-properties-of-geojson-in-popup-on-leaflet
//Magnitude indicated by depth per instructions

function plotquakeData(data){

 
 L.geoJson(data,
     {
       pointToLayer: function(feature, latlng){
         return L.circleMarker(latlng);
     }, 
     style: circleStyles,
     onEachFeature: function(feature, layer) {
       layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + 
       "<br>Depth:" +feature.geometry.coordinates[2]);
     }

   }).addTo(map);
}

function circleStyles(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getFillColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.geometry.coordinates[2]), 
      stroke: true,
      weight: 0.5
    };
  }
  //REF:https://leafletjs.com/examples/choropleth/
  //https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
  function getFillColor(d) {
  
    var colors = ['lightgreen','yellowgreen','gold','orange','salmon','red'];
  
    return  d > 500? colors[5]:
    d > 400 ? colors[4]:
    d > 300 ? colors[3]:
    d > 200 ? colors[2]:
    d > 100 ? colors[1]:
              colors[0];

  }

  
function getRadius(depth) {
    var radius = 0
    if (depth === 0) {
        radius = 1
    }
    else {
        radius = depth/50;
    }
    return radius
    
};

  //references as above plus class lesson on chloropleth
var legend = L.control({position: 'bottomright'});

legend.onAdd = function() {

    var div = L.DomUtil.create('div', 'info legend');
    magnitude = [50,100,200, 300,400, 500];
    labels = ['lightgreen','yellowgreen','gold','orange','salmon','red' ] ;

      for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style = "background:' + labels[i] + '"></i>' + 
            magnitude[i] + (magnitude[i+1] ? '&ndash;' + magnitude[i+1] + '<br>' : '+');
        
        }

    return div;
};
legend.addTo(map);




              
                


   
