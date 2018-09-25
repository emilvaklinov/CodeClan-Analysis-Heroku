
const GeoJsonTest = function () {
}

GeoJsonTest.prototype.negativeTestData = function () {
    const negativeTestData = {
        "type": "FeatureCollection",
            "crs": { 
                "type": "name", 
                "properties": { 
                    "title": "testing",
                    "name": "urn:ogc:def:crs:OGC:1.3:CRS84" 
                } },
        "features": [

            { "geometry": { "type": "Point", "coordinates": [-0.111094, 52.509865] } },
        ]
    }

    return negativeTestData;
}

module.exports = GeoJsonTest;


// working with most data:
// { "type": "Feature", "properties": { "id": "1", "retweets": 2.00, }, "geometry": { "type": "Point", "coordinates": [-0.118092, 51.509865, 0]}},
