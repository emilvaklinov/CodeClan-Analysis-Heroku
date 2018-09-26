const GeoJsonTest = require('../helpers/geoJson_test');
const PubSub = require('../helpers/pub_sub.js');

const MapView = function(){
}

const geoJsonTest = new GeoJsonTest();

MapView.prototype.bindEvents = function () {
    let eventCounter = 0;
    let allCoordinates = [];

    // load empty map on start
    this.renderMap();

    PubSub.subscribe('FormView:search-term-submitted', (event) => {
        eventCounter = 0;
        allCoordinates = [];
    });

    PubSub.subscribe('Searches:happy-tweet-coordinates-loaded', (event) => {
        eventCounter += 1;
        allCoordinates = allCoordinates.concat(event.detail, allCoordinates);
        if (eventCounter === 2){
            console.log('all coords happy', allCoordinates);
            this.renderMap(allCoordinates);
            this.removeLoadingSpinner();
        } else {
            console.log('all coords sad was resolved first', allCoordinates);
        }
    });

    PubSub.subscribe('Searches:sad-tweet-coordinates-loaded', (event) => {
        eventCounter += 1;
        allCoordinates = allCoordinates.concat(event.detail, allCoordinates);
        if (eventCounter === 2){
            console.log('all coords sad', allCoordinates);
            this.renderMap(allCoordinates);
            this.removeLoadingSpinner();
        } else {
            console.log('all coords happy was resolved first', allCoordinates);
        }
    });
  };

MapView.prototype.renderMap = function(coordinates){
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
// console.log('from inside map: ', coordinates);

const json = {
    "type": "FeatureCollection",
        "crs": { 
            "type": "name", 
            "properties": { 
                "title": "testing",
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84" 
            } },
    "features": coordinates
}
// console.log('data: ', json);


    mapboxgl.accessToken = 'pk.eyJ1IjoibS1qZXJ3YW4iLCJhIjoiY2ptZ29pb2UwNGYxbTN3bzJnNTZpc2IzZCJ9.O-ibkJlgtLAeBMMYJOB5Uw';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [0, 45],
        zoom: 0.65
    });

    map.on('load', function () {
        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        map.addSource('twitter_test', {
            "type": "geojson",
            "data": 
            {
                "type": "FeatureCollection",
                    "crs": { 
                        "type": "name", 
                        "properties": { 
                            "title": "testing",
                            "name": "urn:ogc:def:crs:OGC:1.3:CRS84" 
                        } },
                "features": coordinates
            }
        });

        map.addLayer({
            "id": "twitter_test-heat",
            "type": "heatmap",
            "source": "twitter_test",
            "maxzoom": 9,
            "paint": {
                // Increase the heatmap weight based on frequency and property magnitude
                "heatmap-weight": [
                    "interpolate",
                    ["linear"],
                    ["get", "retweets"],
                    0, 0,
                    6, 1
                ],
                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                "heatmap-intensity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0, 1,
                    9, 3
                ],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(33,102,172,0)",
                    0.2, "rgb(103,169,207)",
                    0.4, "rgb(209,229,240)",
                    0.6, "rgb(253,219,199)",
                    0.8, "rgb(239,138,98)",
                    1, "rgb(178,24,43)"
                ],
                // Adjust the heatmap radius by zoom level
                "heatmap-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0, 2,
                    9, 20
                ],
                // Transition from heatmap to circle layer by zoom level
                "heatmap-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7, 1,
                    9, 0
                ],
            }
        }, 'waterway-label');

        map.addLayer({
            "id": "twitter_test-point",
            "type": "circle",
            "source": "twitter_test",
            "minzoom": 7,
            "paint": {
                // Size circle radius by earthquake magnitude and zoom level
                "circle-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7, [
                        "interpolate",
                        ["linear"],
                        ["get", "retweets"],
                        1, 1,
                        6, 4
                    ],
                    16, [
                        "interpolate",
                        ["linear"],
                        ["get", "retweets"],
                        1, 5,
                        6, 50
                    ]
                ],
                // Color circle by earthquake magnitude
                "circle-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "retweets"],
                    1, "rgba(33,102,172,0)",
                    2, "rgb(103,169,207)",
                    3, "rgb(209,229,240)",
                    4, "rgb(253,219,199)",
                    5, "rgb(239,138,98)",
                    6, "rgb(178,24,43)"
                ],
                "circle-stroke-color": "white",
                "circle-stroke-width": 1,
                // Transition from heatmap to circle layer by zoom level
                "circle-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7, 0,
                    8, 1
                ]
            }
        }, 'waterway-label');
    });

}

MapView.prototype.removeLoadingSpinner = function(){
  const loadingOverlay = document.querySelector('#loading-overlay');
  const loadingModal = document.querySelector('#loading-modal');
  loadingOverlay.classList.add('hidden');
  loadingModal.classList.add('hidden');
}

module.exports = MapView;
