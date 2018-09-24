
const GeoJsonTest = function () {
}

GeoJsonTest.prototype.testData = function () {

    const geoJsonTestData = {
        "geojson-marker": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-0, 0]
                },
                "properties": {
                    "title": "Mapbox DC",
                    "marker-symbol": "monument"
                }
            }
        }
    }
    return geoJsonTestData;
}
module.exports = GeoJsonTest;