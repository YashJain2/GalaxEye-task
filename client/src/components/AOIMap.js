import React, { useEffect, useRef, useState } from 'react'
import { FeatureGroup, MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'

function AOIMap() {
    const noTilesToDisplay = {
        "type": "FeatureCollection",
        "features": [],
    };

    const color = "purple"; // colour of AOI shapes
    let staticTiles;
    const geoDataRefLayer = useRef(null);

    // to hold the state for intersecting tile section for the corresponding AOI
    const [intersectingTiles, setintersectingTiles] = useState(noTilesToDisplay);

    const featureGroupRef = useRef(null);


    const updateMap = async (AOIGeoJSONObject) => {
        // Initializing an empty array for tiles intersection on GEOJSON data
        var intersectingTilesArray = [];
        var response
        try {
            const AOIgeometry = { AOIGeoJSONObject }
            response = await fetch("http://localhost:3005/intersect", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(AOIgeometry)
            })
            const data = await response.json();
            intersectingTilesArray.push(data)
        }
        catch (e) {
            console.error(e.message)
        }

        //intersecting tiles section
        console.log(intersectingTilesArray);

        setintersectingTiles(intersectingTilesArray);
    }

    const onAOICreated = async (e) => {
        updateMap(e.layer.toGeoJSON());
    }

    const onAOIEdited = (e) => {
        updateMap(e.layers.toGeoJSON().features[0]);
    }

    const onAOIDeleted = () => {
        setintersectingTiles(noTilesToDisplay);
    }

    // Checks if AOI already exists, and if exists remove the old one
    const checkAndRemoveAOI = (featureGroupReference) => {
        const layers = featureGroupReference.current._layers;
        if (Object.keys(layers).length > 1) {
            Object.keys(layers).forEach((layerid, i) => {
                if (i > 0) {
                    return;
                }
                const layer = layers[layerid];
                featureGroupReference.current.removeLayer(layer);
            });
        }
    }

    // Renders geoJSON and AOI async
    useEffect(() => {
        if (geoDataRefLayer.current) {
            geoDataRefLayer.current.clearLayers().addData(intersectingTiles);
            checkAndRemoveAOI(featureGroupRef);
        }
    }, [intersectingTiles])

    // Fetch static tiles on initialization
    useEffect(() => {
        const fetchDataFromTable = async () => {
            try {
                const response = await fetch("http://localhost:3005/read");
                const JSONObject = await response.json();
                staticTiles = JSONObject;
            }
            catch (err) {
                console.error(err.message);
            }
        }
        fetchDataFromTable();
    }, []);


    return (
        <MapContainer center={[12.91621054954953, 77.65186499781416]} zoom={10} style={{ width: "100%", height: "100vh" }} scrollWheelZoom={false}>
            <FeatureGroup
                ref={featureGroupRef}
            >
                <EditControl
                    position='topright'
                    onCreated={onAOICreated}
                    onDeleted={onAOIDeleted}
                    onEdited={onAOIEdited}
                    draw={{
                        polygon: {
                            allowIntersection: true,
                            shapeOptions: { color: color },
                        },
                        rectangle: {
                            allowIntersection: true,
                            shapeOptions: { color: color },
                        },
                        polyline: false,
                        circle: false,
                        circlemarker: false,
                        marker: false,
                    }}
                    edit={{ 
                        selectedPathOptions: {
                            color: color,
                            fillColor: color,
                        },
                        shapeOptions: { color: color },
                    }} />
            </FeatureGroup>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON ref={geoDataRefLayer} data={intersectingTiles} />
        </MapContainer>
    )
}

export default AOIMap