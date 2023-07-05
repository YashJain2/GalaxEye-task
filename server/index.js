const express = require("express");
const app = express();
const pool = require("./db")
const cors = require("cors");
const jsonData = require('./data/KarnatakaGeoTiles.json')
var isDataInserted = false


//middlewares
app.use(cors());
app.use(express.json());    

//Econnecting to DB
const connectToDB = async () => {
    await pool.connect();
};


// populating the karnataka_geo_data table with the given json data
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
                // console.log(polygonDescription)
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

//read all the rows from the DB
app.post("/fetch", async (req, res) => {
    try {
        await pool.query("SELECT * FROM karnataka_geo_data;");
    } catch (err) {
        console.error(err.message);
    }
})

//checks for intersection b/w AOI and tiles in DB
app.put("/intersect", async (req, res) => {
    try {
        const AOIObject = req.body.AOIGeoJSONObject.geometry;
        console.log(AOIObject);

        var formattedFinalJSONData = {
            type: "FeatureCollection",
            features: []
        };

        const mapData = await pool.query("SELECT ST_AsGeoJSON(polygon) FROM karnataka_geo_data WHERE ST_Intersects(polygon,ST_GeomFromGeoJSON($1));", [AOIObject]);
        for (var i = 0; i < mapData.rows.length; i++) {
            formattedFinalJSONData.features.push(JSON.parse(mapData.rows[i].st_asgeojson));
        }
        res.json(formattedFinalJSONData)
    } catch (err) {
        console.error(err.message);
    }
})

// app.get("/",(req,res)=>{
//     return res.send("Hello to the GalaxEye backend");
// })

// listen on port 3005
app.listen(3005, () => {
    try{
        connectToDB(); //establising the connection when starting the server
        populateTable(); // populating the DB when connection is established
    }
    catch(err){
        console.log("Error in connecting to DB or populating table entries");
    }
    console.log("Server started on port 3005");
})