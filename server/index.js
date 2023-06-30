const express = require("express");
const app = express();
const pool = require("./db")
const cors = require("cors");
const jsonData = require('./data/KarnatakaGeoTiles.json')
var isDataInserted = false


//MIDDLEWARE
app.use(cors());
app.use(express.json());    

//ESTABLISHING A CONNECTION TO DB
const connectToDB = async () => {
    await pool.connect();
};

const populateTable = async () => {

    if (!isDataInserted) {
        const data = await pool.query("SELECT * FROM karnataka_geo_data");
        if (data.rowCount > 0) {
            isDataInserted = true;
            console.log("Data is already present");
            return;
        }
        else {
            for (var i = 0; i < jsonData.features.length; i++) {
                var polygonDescription = jsonData.features[i];
                console.log(polygonDescription)
                pool.query("INSERT INTO karnataka_geo_data(polygon) VALUES(ST_GeomFromGeoJSON($1)) ", [polygonDescription.geometry]);
            }
            console.log("Data Insertion Successful");
            return;

        }
    }
    else {
        console.log("Data is already present");
        return;
    }

};

//READ ALL TABLE ROWS AND FOMRAT AS GEOJSON DATA
app.post("/read", async (req, res) => {
    try {
        await pool.query("SELECT * FROM karnataka_geo_data;");
    } catch (err) {
        console.error(err.message);
    }
})

//CHECKS FOR INTERSECTION BETWEEN AREA OF INTEREST AND TILES IN DB
app.put("/intersect", async (req, res) => {
    try {
        const AOIObject = req.body.AOIGeoJSONObject.geometry;
        console.log(AOIObject);

        var formattedJSONData = {};
        formattedJSONData.type = "FeatureCollection"
        formattedJSONData.features = []

        const mapData = await pool.query("SELECT ST_AsGeoJSON(polygon) FROM karnataka_geo_data WHERE ST_Intersects(polygon,ST_GeomFromGeoJSON($1));", [AOIObject]);
        for (var i = 0; i < mapData.rows.length; i++) {
            formattedJSONData.features.push(JSON.parse(mapData.rows[i].st_asgeojson));
        }
        res.json(formattedJSONData)
    } catch (err) {
        console.error(err.message);
    }
})

// LISTEN ON PORT 3005
app.listen(3005, () => {
    console.log("Server started on port 3005");
})